# ガソリン割引キャンペーン 30秒動画

LP のキャンペーン内容を 30 秒の縦横 16:9 動画（1920×1080 / 30fps / H.264）に仕立てるための
レンダリング一式。**文言・数値・配色はコードに埋め込まず `content.json` だけで差し替える**構成。

## 構成

| ファイル | 役割 |
| --- | --- |
| `content.json` | 文言・数値・ブランドカラー・各シーンの尺。**編集するのは基本ここだけ** |
| `scene.html` | 6 シーンのレイアウトとモーション（CSS アニメーション） |
| `render.mjs` | フレームを決定論的にシークしてキャプチャし、ffmpeg へパイプして MP4 化 |
| `out/` | 出力先（git 管理外） |

## 使い方

```bash
cd projects/gasoline_movie

# 構図確認：指定した秒数のフレームだけ PNG で書き出す（速い）
node render.mjs --preview 1.8,7.2,13.6,18.4,23.6,28.4

# 本番：30秒の MP4 を out/ に書き出す
node render.mjs
```

環境変数 `OUT` で出力先、`FFMPEG` で ffmpeg のパスを上書きできる。

## 仕組み

モーションはすべて CSS アニメーションで、`animation-delay` に**タイムライン上の絶対秒**を入れて
`animation-fill-mode: both` で固定している。レンダラは各フレームで

```js
document.getAnimations().forEach(a => { a.pause(); a.currentTime = t * 1000 })
```

を実行するため、**フレームは時刻 t の純粋関数**になり、実時間のゆらぎに影響されず再現性がある。
カンマ区切りが必要な数値カウントだけは `window.__tick(t)` 側で描画している（これも t の純関数）。

キャプチャした PNG はディスクに置かず、そのまま ffmpeg の stdin にパイプしている。

## シーン構成（既定 30.0 秒）

| # | キー | 尺 | 内容 |
| --- | --- | --- | --- |
| 1 | `hook` | 0.0–5.2s | 課題提起。ガソリン単価のゲージとコピー |
| 2 | `problem` | 5.0–9.8s | 年間差額のカウントアップ |
| 3 | `reveal` | 9.6–16.0s | カード名と割引額のリード、カード券面 |
| 4 | `benefits` | 15.8–22.0s | 選ばれる理由 3 枚 |
| 5 | `steps` | 21.8–26.2s | 申し込み 3 ステップ |
| 6 | `cta` | 26.0–30.0s | ロゴ・CTA・URL・受付期間・注意書き |

尺を変えるときは `content.json` の各シーンの `start` / `end` と `video.duration` を合わせて直す。
シーン同士は 0.2 秒ほど重ねてクロスフェードさせている。

## LP から埋める項目

`content.json` の `〈…〉` と `◯` はすべて仮置き。実データが入るまで `draft: true` にしてあり、
その間は画面右上に `SAMPLE / 文言・数値は仮` のバッジが焼き込まれる。
**実データを入れたら `draft` を `false` にしてバッジを外すこと。**

埋めるべき項目:

- `brand.name` / `brand.serviceName` / `brand.logoMark` / `brand.url`
- `brand.colors` … LP の CSS から拾ったブランドカラー
- `scenes.hook.priceFrom` … 訴求に使うガソリン単価
- `scenes.problem.lead` / `amount` … 年間差額の試算とその前提
- `scenes.reveal.discountValue` / `discountUnit` … 割引額（例: 「10」「円/L」）
- `scenes.benefits.items[]` … 割引・年会費・申込のしやすさなど 3 点
- `scenes.steps.items[]` … 申し込みフロー
- `scenes.cta.period` / `disclaimer` … 受付期間と注意書き

数値・割引条件・対象店舗・年会費は**必ず LP の記載と突き合わせてから**入れる。
広告表記になるため、注意書き（`scenes.cta.disclaimer`）は削らずに載せる前提で組んである。

## 制作環境の前提

- Chromium は Playwright 同梱のものを使う（`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`）
- ffmpeg は H.264 エンコーダが要る。同梱の Playwright 版は VP8/WebM しか持たないため、
  `pip install imageio-ffmpeg` で入る静的ビルドを既定パスにしている
- 日本語フォントは環境同梱の IPAGothic。外部フォントは取得できない前提

## 音声

現状は互換性確保のための無音トラック（AAC）のみ。BGM / ナレーションを載せる場合は
音源を用意したうえで `render.mjs` の ffmpeg 引数の `anullsrc` を差し替える。
