/**
 * Higgsfield (Seedance) で shots.json の各カットを生成し、out/clips/ に落とす。
 *
 *   HF_API_KEY=xxx HF_API_SECRET=yyy node seedance.mjs
 *   HF_API_KEY=... HF_API_SECRET=... node seedance.mjs --only s3_reveal
 *   node seedance.mjs --dry-run     # 認証なしで投げる内容だけ確認する
 *
 * API: https://docs.higgsfield.ai/docs/how-to/introduction.md
 *   POST https://platform.higgsfield.ai/{model_id}          … ジョブ投入
 *   GET  https://platform.higgsfield.ai/requests/{id}/status … 状態取得
 *   認証: Authorization: Key {api_key}:{api_key_secret}
 *
 * 生成は非同期キュー。ここでは投入 → ポーリング → 完了した動画の URL を
 * ダウンロード、までを行う。合成は assemble.mjs の担当。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.HF_BASE_URL || 'https://platform.higgsfield.ai';
const KEY = process.env.HF_API_KEY;
const SECRET = process.env.HF_API_SECRET;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

const cfg = JSON.parse(readFileSync(join(HERE, 'shots.json'), 'utf8'));
const clipsDir = join(HERE, 'out', 'clips');
mkdirSync(clipsDir, { recursive: true });

const shots = cfg.shots.filter(s => !only || s.id === only);
if (!shots.length) throw new Error(`--only ${only} に一致するカットがありません`);

if (!dryRun && (!KEY || !SECRET)) {
  console.error(
    'HF_API_KEY / HF_API_SECRET が未設定です。\n' +
    'cloud.higgsfield.ai で API キーを発行し、環境変数に入れてから再実行してください。\n' +
    '投げる内容だけ確認する場合は --dry-run を付けてください。');
  process.exit(2);
}

const authHeaders = {
  'Authorization': `Key ${KEY}:${SECRET}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* 1 段目: 静止画。2 段目: その静止画を Seedance で動かす。
   ドキュメント上 Seedance は image-to-video のみで image_url が必須なため、
   image_url を直接指定しないカットはまず静止画を作る。          */
function stillPayload(shot) {
  return { ...cfg.imageDefaults, prompt: shot.still, ...(shot.imageParams || {}) };
}
function videoPayload(shot, imageUrl) {
  return {
    image_url: imageUrl,
    prompt: shot.motion,
    duration: shot.duration,
    ...(shot.params || {}),
  };
}

async function submit(shot, modelId, payload) {
  const res = await fetch(`${BASE}/${modelId}`, {
    method: 'POST', headers: authHeaders, body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`[${shot.id}] ${modelId} 投入失敗 HTTP ${res.status}: ${text.slice(0, 400)}`);
  const json = JSON.parse(text);
  if (!json.request_id) throw new Error(`[${shot.id}] request_id が返りませんでした: ${text.slice(0, 400)}`);
  return json;
}

/* queued / in_progress の間ポーリングする。completed 以外の終端は投げる。 */
async function poll(shot, requestId, { intervalMs = 6000, timeoutMs = 15 * 60 * 1000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let last = '';
  while (Date.now() < deadline) {
    const res = await fetch(`${BASE}/requests/${requestId}/status`, { headers: authHeaders });
    const text = await res.text();
    if (!res.ok) throw new Error(`[${shot.id}] 状態取得失敗 HTTP ${res.status}: ${text.slice(0, 300)}`);
    const json = JSON.parse(text);
    if (json.status !== last) { console.log(`[${shot.id}] ${json.status}`); last = json.status; }
    if (json.status === 'completed') return json;
    if (json.status === 'failed' || json.status === 'nsfw') {
      throw new Error(`[${shot.id}] 生成が ${json.status} で終了しました（クレジットは返還されます）`);
    }
    await sleep(intervalMs);
  }
  throw new Error(`[${shot.id}] ${timeoutMs / 1000}s 待っても完了しませんでした (request_id=${requestId})`);
}

async function download(shot, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`[${shot.id}] ダウンロード失敗 HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const out = join(clipsDir, `${shot.id}.mp4`);
  writeFileSync(out, buf);
  console.log(`[${shot.id}] 保存: ${out} (${(buf.length / 1e6).toFixed(1)} MB)`);
  return out;
}

if (dryRun) {
  for (const s of shots) {
    console.log(`--- ${s.id}  ${s.start}s–${s.end}s  request duration=${s.duration}s`);
    if (!s.image_url) {
      console.log(`[1/2] POST ${BASE}/${s.imageModel || cfg.imageModel}`);
      console.log(JSON.stringify(stillPayload(s), null, 2));
    }
    console.log(`[2/2] POST ${BASE}/${s.model || cfg.model}`);
    console.log(JSON.stringify(videoPayload(s, s.image_url || '<1段目で得た画像URL>'), null, 2));
  }
  process.exit(0);
}

/* 1 カットぶんを通しで処理する。カット間は並行。 */
async function runShot(shot) {
  const clip = join(clipsDir, `${shot.id}.mp4`);
  if (existsSync(clip) && !args.includes('--force')) {
    console.log(`[${shot.id}] 既にクリップがあるのでスキップ（--force で再生成）`);
    return { id: shot.id, file: clip, reused: true };
  }

  let imageUrl = shot.image_url;
  if (!imageUrl) {
    const im = shot.imageModel || cfg.imageModel;
    const q = await submit(shot, im, stillPayload(shot));
    console.log(`[${shot.id}] 静止画 queued request_id=${q.request_id}`);
    const done = await poll(shot, q.request_id);
    imageUrl = done.images?.[0]?.url;
    if (!imageUrl) {
      throw new Error(`[${shot.id}] 静止画は完了しましたが images[0].url がありません: ` +
                      JSON.stringify(done).slice(0, 400));
    }
    console.log(`[${shot.id}] 静止画 OK`);
  }

  const vm = shot.model || cfg.model;
  const q2 = await submit(shot, vm, videoPayload(shot, imageUrl));
  console.log(`[${shot.id}] 動画 queued request_id=${q2.request_id}`);
  const done2 = await poll(shot, q2.request_id);
  const videoUrl = done2.video?.url;
  if (!videoUrl) {
    throw new Error(`[${shot.id}] 動画は完了しましたが video.url がありません: ` +
                    JSON.stringify(done2).slice(0, 400));
  }
  const file = await download(shot, videoUrl);
  return { id: shot.id, file, imageUrl, videoRequestId: q2.request_id, sourceUrl: videoUrl };
}

const results = await Promise.allSettled(shots.map(runShot));
const manifest = [];
const failed = [];
results.forEach((r, i) => {
  if (r.status === 'fulfilled') manifest.push(r.value);
  else failed.push(`${shots[i].id}: ${r.reason.message}`);
});

writeFileSync(join(clipsDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
if (failed.length) {
  console.error('\n失敗したカット:\n' + failed.map(f => '  - ' + f).join('\n'));
  console.error('成功分は out/clips/ に残っています。修正して再実行すれば未生成分だけ流れます。');
  process.exit(1);
}
console.log('\n全カット完了。次: node assemble.mjs');
