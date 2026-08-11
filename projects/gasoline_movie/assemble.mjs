/**
 * Seedance のクリップ（out/clips/）に日本語テロップを重ねて 30 秒の MP4 にする。
 *
 *   node assemble.mjs
 *   node assemble.mjs --keep-overlay   # 中間の透過 PNG を消さない
 *   node assemble.mjs --reuse-overlay  # 既存の透過 PNG を再利用（テロップ再描画を省く）
 *
 * 流れ:
 *   1. shots.json の start/end に合わせて各クリップを尺どおりに切り出す
 *   2. 1920x1080 にスケール＆センタークロップして xfade で繋ぐ
 *   3. render.mjs --overlay が吐いた透過 PNG 連番を上に overlay で合成
 *   4. H.264 + 無音 AAC で書き出し
 */
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const FFMPEG = process.env.FFMPEG
  || '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';

const args = process.argv.slice(2);
const keepOverlay = args.includes('--keep-overlay');
const reuseOverlay = args.includes('--reuse-overlay');

const cfg = JSON.parse(readFileSync(join(HERE, 'shots.json'), 'utf8'));
const content = JSON.parse(readFileSync(join(HERE, 'content.json'), 'utf8'));
const { width, height, fps, duration } = content.video;
const T = cfg.transition ?? 0.5;

const clipsDir = join(HERE, 'out', 'clips');
const overlayDir = join(HERE, 'out', 'overlay');
const OUT = process.env.OUT || join(HERE, 'out', 'gasoline_campaign_30s_seedance.mp4');
mkdirSync(dirname(OUT), { recursive: true });

/* --------- クリップの存在と尺を検証する --------- */
function probeDuration(file) {
  const r = spawnSync(FFMPEG, ['-hide_banner', '-i', file], { encoding: 'utf8' });
  const m = /Duration:\s*(\d+):(\d+):(\d+\.?\d*)/.exec(r.stderr || '');
  if (!m) throw new Error(`${file} の尺を取得できませんでした`);
  return (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]);
}

const shots = cfg.shots;
const missing = shots.filter(s => !existsSync(join(clipsDir, `${s.id}.mp4`)));
if (missing.length) {
  console.error('クリップが未生成です: ' + missing.map(s => s.id).join(', '));
  console.error('先に  HF_API_KEY=... HF_API_SECRET=... node seedance.mjs  を実行してください。');
  process.exit(2);
}

/* seg = タイムライン上の占有尺 + 次カットとの xfade 分（最後のカットは重ねない） */
const segs = shots.map((s, i) => (s.end - s.start) + (i < shots.length - 1 ? T : 0));
shots.forEach((s, i) => {
  const have = probeDuration(join(clipsDir, `${s.id}.mp4`));
  if (have + 0.05 < segs[i]) {
    throw new Error(
      `[${s.id}] クリップが短すぎます: ${have.toFixed(2)}s しかないのに ${segs[i].toFixed(2)}s 必要。` +
      ` shots.json の duration を伸ばして再生成してください。`);
  }
});

const totalAfterXfade = segs.reduce((a, b) => a + b, 0) - (shots.length - 1) * T;
if (Math.abs(totalAfterXfade - duration) > 0.05) {
  console.warn(`警告: xfade 後の尺 ${totalAfterXfade.toFixed(2)}s が ` +
               `content.json の ${duration}s と一致しません。shots.json の start/end を見直してください。`);
}

/* --------- テロップの透過 PNG を用意する --------- */
if (!reuseOverlay || !existsSync(join(overlayDir, '00001.png'))) {
  console.log('テロップを透過 PNG で書き出し中...');
  const r = spawnSync(process.execPath, [join(HERE, 'render.mjs'), '--overlay', overlayDir],
    { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('オーバーレイの書き出しに失敗しました');
}

/* --------- ffmpeg フィルタグラフを組む --------- */
const inputs = [];
shots.forEach(s => { inputs.push('-i', join(clipsDir, `${s.id}.mp4`)); });
inputs.push('-framerate', String(fps), '-i', join(overlayDir, '%05d.png'));
const OV = shots.length; // オーバーレイ入力のインデックス

const parts = [];
shots.forEach((s, i) => {
  parts.push(
    `[${i}:v]trim=0:${segs[i].toFixed(3)},setpts=PTS-STARTPTS,fps=${fps},` +
    `scale=${width}:${height}:force_original_aspect_ratio=increase,` +
    `crop=${width}:${height},setsar=1[v${i}]`);
});

let chain = 'v0', L = segs[0];
for (let i = 1; i < shots.length; i++) {
  const off = (L - T).toFixed(3);
  const out = `x${i}`;
  parts.push(`[${chain}][v${i}]xfade=transition=fade:duration=${T}:offset=${off}[${out}]`);
  chain = out;
  L = L + segs[i] - T;
}
parts.push(`[${chain}][${OV}:v]overlay=0:0:format=auto:shortest=0[vout]`);

const ff = spawn(FFMPEG, [
  '-y',
  ...inputs,
  '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
  '-filter_complex', parts.join(';'),
  '-map', '[vout]', '-map', `${OV + 1}:a`,
  '-t', String(duration),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
  '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.2',
  '-movflags', '+faststart',
  '-c:a', 'aac', '-b:a', '128k',
  OUT,
], { stdio: ['ignore', 'inherit', 'inherit'] });

const code = await new Promise(res => ff.on('close', res));
if (code !== 0) throw new Error(`ffmpeg が exit ${code} で失敗しました`);

if (!keepOverlay) { rmSync(overlayDir, { recursive: true, force: true }); }
console.log('written:', OUT);
