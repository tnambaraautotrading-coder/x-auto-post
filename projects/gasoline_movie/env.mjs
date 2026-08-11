/**
 * 実行環境ごとに違う Chromium と ffmpeg の在り処を吸収する。
 * クラウドのコンテナでも手元の Mac / Linux でも同じスクリプトが動くようにするため。
 */
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

/* Playwright は npm でローカルに入れた場合と、環境にグローバル導入されている
   場合がある。まず通常の解決を試し、駄目なら既知のグローバルパスを見る。 */
const GLOBAL_PLAYWRIGHT = [
  '/opt/node22/lib/node_modules/playwright/index.mjs',
  '/usr/lib/node_modules/playwright/index.mjs',
  '/usr/local/lib/node_modules/playwright/index.mjs',
];

export async function loadChromium() {
  try {
    return (await import('playwright')).chromium;
  } catch { /* ローカルに無いだけなので次を試す */ }
  for (const p of GLOBAL_PLAYWRIGHT) {
    if (existsSync(p)) return (await import(p)).chromium;
  }
  throw new Error(
    'Playwright が見つかりません。projects/gasoline_movie で `npm install` を実行してください。');
}

/* ffmpeg は H.264 (libx264) が使えるものが要る。Playwright 同梱のものは
   VP8/WebM しか持たないので使わない。 */
const BUNDLED_FFMPEG = [
  '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2',
];

export function resolveFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  for (const p of BUNDLED_FFMPEG) if (existsSync(p)) return p;
  try {
    return execFileSync('sh', ['-c', 'command -v ffmpeg'], { encoding: 'utf8' }).trim() || 'ffmpeg';
  } catch {
    throw new Error(
      'ffmpeg が見つかりません。libx264 が有効なビルドを入れてください。\n' +
      '  macOS: brew install ffmpeg\n' +
      '  その他: pip install imageio-ffmpeg （FFMPEG 環境変数でパス指定も可）');
  }
}
