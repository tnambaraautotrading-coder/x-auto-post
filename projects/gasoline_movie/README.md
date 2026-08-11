# ガソリン割引キャンペーン 30秒動画

30 秒 / 16:9（1920×1080 / 30fps / H.264）のキャンペーン動画。
**映像素材は Higgsfield の Seedance で生成し、日本語テロップはコードで合成する**構成。

AI 動画モデルは日本語の文字を正しく描けないため、文字をモデルに描かせず、
Seedance には「文字のない実写素材」だけを作らせて、コピー・数値・CTA は
ブラウザで描画した透過レイヤーとして重ねている。

文言・数値・配色はコードに埋め込まず `content.json` だけで差し替える。

## 構成

| ファイル | 役割 |
| --- | --- |
| `content.json` | 文言・数値・ブランドカラー・各シーンの尺。**編集するのは基本ここだけ** |
| `shots.json` | Seedance に投げる素材カットのプロンプトと、30 秒上の配置 |
| `scene.html` | 6 シーンのテロップのレイアウトとモーション（CSS アニメーション） |
| `seedance.mjs` | Higgsfield API でカットを生成して `out/clips/` に落とす |
| `render.mjs` | テロップをフレーム単位で描画。単体で MP4 も、透過 PNG 連番も出せる |
| `assemble.mjs` | Seedance のクリップ＋透過テロップを合成して 30 秒 MP4 にする |
| `out/` | 出力先（git 管理外） |

## 使い方

### 1. Higgsfield の認証情報を用意する

cloud.higgsfield.ai で API キーを発行し、環境変数に入れる。

```bash
export HF_API_KEY=...
export HF_API_SECRET=...
```

認証は `Authorization: Key {api_key}:{api_key_secret}` 形式。

### 2. 素材カットを生成する

```bash
cd projects/gasoline_movie

node seedance.mjs --dry-run   # 投げる内容だけ確認（キー不要）
node seedance.mjs             # 6 カットを生成して out/clips/ に保存
node seedance.mjs --only s3_reveal --force   # 特定カットだけ作り直す
```

非同期キューなので、投入 → ポーリング → 完了後にダウンロード、まで自動で行う。
既にクリップがある場合はスキップされる（`--force` で再生成）。

### 3. テロップを重ねて書き出す

```bash
node assemble.mjs
```

`out/gasoline_campaign_30s_seedance.mp4` ができる。

### 補助コマンド

```bash
# テロップの構図確認：指定した秒数のフレームだけ PNG で書き出す（速い）
node render.mjs --preview 1.8,7.2,13.6,18.4,23.6,28.4

# Seedance を使わず、テロップ＋グラデーション背景だけで 30 秒 MP4 を作る
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

## 合成の仕組み

`assemble.mjs` は `shots.json` の `start` / `end` に従って各クリップを切り出し、
1920×1080 にスケール＆センタークロップしたうえで `xfade` で繋ぐ。
繋ぎ目の尺は `transition`（既定 0.5 秒）で、各カットは
「タイムライン上の占有尺 + transition」だけの長さを必要とする。
足りない場合は `shots.json` の `duration` を伸ばして再生成する（起動時に検証してエラーにする）。

その上に `render.mjs --overlay` が吐いた透過 PNG 連番を `overlay` フィルタで重ねる。
テロップ側は `overlay-mode` で背景・グレインを落とし、下地の可読性確保のために
上下方向のグラデーションと text-shadow だけを残している。

## シーン構成（既定 30.0 秒）

| # | キー | 尺 | 内容 |
| --- | --- | --- | --- |
| 1 | `hook` | 0.0–5.2s | 課題提起。ガソリン単価のゲージとコピー / 給油ノズルの寄り |
| 2 | `problem` | 5.0–9.8s | 年間差額のカウントアップ / 夕暮れの走行シーン |
| 3 | `reveal` | 9.6–16.0s | カード名と割引額のリード / カードの寄り |
| 4 | `benefits` | 15.8–22.0s | 選ばれる理由 3 枚 / 明るいSSの全景 |
| 5 | `steps` | 21.8–26.2s | 申し込み 3 ステップ / スマホ操作 |
| 6 | `cta` | 26.0–30.0s | ロゴ・CTA・URL・受付期間・注意書き / ゴールデンアワーの走行 |

`content.json` のシーン境界（テロップ）と `shots.json` の `start`/`end`（素材）は
役割が違うので別管理。テロップ側は隣接シーンを 0.2 秒ほど重ねてクロスフェードさせ、
素材側は `transition` の分だけ重ねている。

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

## 未確定事項

1. **キャンペーンLPの内容が未取得。** LP のホストがネットワークのエグレスポリシーで
   拒否されているため、`content.json` の `〈…〉` と `◯` はすべて仮値。
   実データを入れたら `draft` を `false` にして SAMPLE バッジを外す。
2. **Higgsfield の API キーが未設定。** `HF_API_KEY` / `HF_API_SECRET` が無いと
   `seedance.mjs` は素材を生成できない（エンドポイント自体には到達可能で、
   未認証だと 401 `Invalid credentials` が返る状態まで確認済み）。

## 制作環境の前提

- Chromium は Playwright 同梱のものを使う（`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`）
- ffmpeg は H.264 エンコーダが要る。同梱の Playwright 版は VP8/WebM しか持たないため、
  `pip install imageio-ffmpeg` で入る静的ビルドを既定パスにしている
- 日本語フォントは環境同梱の IPAGothic。外部フォントは取得できない前提

## 音声

現状は互換性確保のための無音トラック（AAC）のみ。BGM / ナレーションを載せる場合は
音源を用意したうえで `render.mjs` の ffmpeg 引数の `anullsrc` を差し替える。
