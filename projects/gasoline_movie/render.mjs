/**
 * scene.html を 1 フレームずつ決定論的にシークしてキャプチャし、
 * PNG をパイプで ffmpeg に流し込んで MP4 (H.264) を書き出す。
 *
 *   node render.mjs                    # 本番レンダリング
 *   node render.mjs --preview 0.6,7,12 # 指定秒のフレームだけ PNG で確認
 *
 * 環境変数:
 *   FFMPEG  … ffmpeg バイナリのパス（未指定なら imageio-ffmpeg 同梱版）
 *   OUT     … 出力ファイル名
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const FFMPEG = process.env.FFMPEG
  || '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';

const content = JSON.parse(readFileSync(join(HERE, 'content.json'), 'utf8'));
const htmlSrc = readFileSync(join(HERE, 'scene.html'), 'utf8');
const TOKEN = '/*__CONTENT_JSON__*/ null';
if (!htmlSrc.includes(TOKEN)) throw new Error('scene.html にコンテンツ差し込みトークンが見つかりません');
const html = htmlSrc.replace(TOKEN, JSON.stringify(content));
const { width, height, fps, duration } = content.video;

const args = process.argv.slice(2);
const previewIdx = args.indexOf('--preview');
const previewTimes = previewIdx >= 0 ? args[previewIdx + 1].split(',').map(Number) : null;
const overlayIdx = args.indexOf('--overlay');
/* --overlay <dir> … 背景なしのテロップだけを連番透過 PNG で書き出す
   （Seedance の実写クリップに重ねる用。assemble.mjs から呼ばれる）      */
const overlayDir = overlayIdx >= 0 ? (args[overlayIdx + 1] || join(HERE, 'out', 'overlay')) : null;
const OUT = process.env.OUT || join(HERE, 'out', 'gasoline_campaign_30s.mp4');

async function openPage(browser) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  page.on('pageerror', e => console.error('page error:', e.message));
  const doc = overlayDir ? '<script>window.__OVERLAY__=true</script>' + html : html;
  await page.setContent(doc, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true);
  await page.evaluate(() => document.fonts.ready);
  return page;
}

const browser = await chromium.launch({
  args: [
    '--force-color-profile=srgb',
    '--disable-lcd-text',
    '--font-render-hinting=none',
    '--hide-scrollbars',
    '--disable-frame-rate-limit',
  ],
});

/* ---------------- プレビュー（静止画で構図を確認する用） ---------------- */
if (previewTimes) {
  const page = await openPage(browser);
  const dir = join(HERE, 'out', 'preview');
  mkdirSync(dir, { recursive: true });
  for (const t of previewTimes) {
    await page.evaluate(tt => window.__seek(tt), t);
    const buf = await page.screenshot({ type: 'png' });
    const f = join(dir, `t${String(t).replace('.', '_')}.png`);
    writeFileSync(f, buf);
    console.log('preview', t + 's ->', f);
  }
  await browser.close();
  process.exit(0);
}

/* ------------- オーバーレイ（透過 PNG 連番）書き出し ------------- */
if (overlayDir) {
  const page = await openPage(browser);
  mkdirSync(overlayDir, { recursive: true });
  const n = Math.round(duration * fps);
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    await page.evaluate(tt => window.__seek(tt), i / fps);
    const buf = await page.screenshot({ type: 'png', omitBackground: true });
    writeFileSync(join(overlayDir, String(i + 1).padStart(5, '0') + '.png'), buf);
    if (i % 60 === 0 || i === n - 1) {
      process.stdout.write(`\roverlay ${i + 1}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }
  process.stdout.write('\n');
  await browser.close();
  console.log('overlay frames:', overlayDir);
  process.exit(0);
}

/* ------------------------------ 本番 ------------------------------ */
const total = Math.round(duration * fps);
mkdirSync(dirname(OUT), { recursive: true });

const ff = spawn(FFMPEG, [
  '-y',
  '-f', 'image2pipe', '-vcodec', 'png', '-r', String(fps), '-i', 'pipe:0',
  '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
  '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.2',
  '-movflags', '+faststart',
  '-c:a', 'aac', '-b:a', '128k',
  '-shortest',
  OUT,
], { stdio: ['pipe', 'inherit', 'pipe'] });

let ffErr = '';
ff.stderr.on('data', d => { ffErr += d.toString(); });
const ffDone = new Promise((res, rej) => {
  ff.on('close', code => (code === 0 ? res() : rej(new Error(`ffmpeg exit ${code}\n${ffErr.slice(-4000)}`))));
});

/* 書き込みエラーはここで一度だけ拾う（フレームごとに listener を足さない） */
let stdinErr = null;
ff.stdin.on('error', e => { stdinErr = e; });

const write = buf => new Promise((res, rej) => {
  if (stdinErr) return rej(stdinErr);
  if (ff.stdin.write(buf)) return res();
  ff.stdin.once('drain', res);
});

const page = await openPage(browser);
const t0 = Date.now();
for (let i = 0; i < total; i++) {
  const t = i / fps;
  await page.evaluate(tt => window.__seek(tt), t);
  await write(await page.screenshot({ type: 'png' }));
  if (i % 60 === 0 || i === total - 1) {
    const pct = Math.round(((i + 1) / total) * 100);
    const el = ((Date.now() - t0) / 1000).toFixed(0);
    process.stdout.write(`\rframe ${i + 1}/${total}  ${pct}%  ${el}s`);
  }
}
process.stdout.write('\n');

ff.stdin.end();
await ffDone;
await browser.close();
console.log('written:', OUT);
