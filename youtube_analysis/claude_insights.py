"""Claude API による所見・タイトル案の生成（オプション）

ANTHROPIC_API_KEY が設定されている場合のみ使用される。
"""
import json

from .config import Config

MODEL = "claude-opus-4-8"

PROMPT = """あなたは YouTube チャンネル戦略のプロです。
以下は YouTube Data API から収集した動画データの統計分析結果（JSON）です。

{data}

この分析結果をもとに、日本語で以下を出力してください:

## Claude の所見
- データから読み取れる、伸びる動画の傾向（3〜5点。数値を根拠に）

## 次に作るべき動画のタイトル案（10本）
- 上位動画のタイトルパターン・キーワードを踏まえた具体案
- 各タイトルに一言で狙いを添える

## 改善アクション
- 投稿時間・動画の長さ・タイトル付けについて、今日から実行できる具体策を3点
"""


def generate_insights(result: dict) -> str | None:
    """分析結果を Claude に渡して所見セクションの Markdown を返す

    API キー未設定・エラー時は None を返す（レポート生成自体は継続する）。
    """
    if not Config.ANTHROPIC_API_KEY:
        return None

    import anthropic

    # トークン節約のため動画詳細は上位・下位のみ、タイトルと数値だけ渡す
    compact = {
        k: v
        for k, v in result.items()
        if k not in ("top_videos", "bottom_videos")
    }
    compact["top_videos"] = [
        {"title": v["title"], "views": v["views"], "views_per_day": v["views_per_day"]}
        for v in result.get("top_videos", [])
    ]
    compact["bottom_videos"] = [
        {"title": v["title"], "views": v["views"], "views_per_day": v["views_per_day"]}
        for v in result.get("bottom_videos", [])
    ]

    client = anthropic.Anthropic(api_key=Config.ANTHROPIC_API_KEY)
    try:
        with client.messages.stream(
            model=MODEL,
            max_tokens=16000,
            thinking={"type": "adaptive"},
            messages=[{
                "role": "user",
                "content": PROMPT.format(data=json.dumps(compact, ensure_ascii=False)),
            }],
        ) as stream:
            message = stream.get_final_message()
    except anthropic.RateLimitError:
        print("[WARN] Claude API がレート制限中のため所見生成をスキップします")
        return None
    except anthropic.APIStatusError as e:
        print(f"[WARN] Claude API エラー ({e.status_code}) のため所見生成をスキップします")
        return None
    except anthropic.APIConnectionError:
        print("[WARN] Claude API に接続できないため所見生成をスキップします")
        return None

    text = "".join(b.text for b in message.content if b.type == "text")
    return text.strip() or None


SCRIPT_PROMPT = """あなたは YouTube 動画の放送作家です。
以下はこれから作る動画のタイトルと、参考となるジャンル分析データ（伸びている動画の傾向）です。

# 動画タイトル
{title}

# ジャンル分析データ (JSON)
{data}

分析データの傾向（伸びている動画の長さ・タイトルパターン・キーワード）を踏まえて、
この動画の台本を日本語で書いてください。構成:

## 台本: {title}

### 冒頭フック (最初の15秒)
- 視聴者が離脱しない掴みのセリフ（そのまま読める形で）

### 本編
- セクションごとに見出し + 話す内容のセリフ
- 分析データで推奨される動画の長さに収まる分量にする

### エンディング
- チャンネル登録・次の動画への誘導

### サムネイル文言案 (3案)
"""


def generate_script(title: str, result: dict) -> str | None:
    """分析結果を踏まえた動画台本を Claude で生成する

    API キー未設定・エラー時は None を返す。
    """
    if not Config.ANTHROPIC_API_KEY:
        print("[INFO] ANTHROPIC_API_KEY 未設定のため台本生成はスキップします")
        return None

    import anthropic

    compact = {
        "duration_stats": result.get("duration_stats", []),
        "title_features": result.get("title_features", []),
        "title_length": result.get("title_length", {}),
        "distinctive_words": result.get("distinctive_words", []),
        "top_titles": [v["title"] for v in result.get("top_videos", [])],
    }

    client = anthropic.Anthropic(api_key=Config.ANTHROPIC_API_KEY)
    try:
        with client.messages.stream(
            model=MODEL,
            max_tokens=32000,
            thinking={"type": "adaptive"},
            messages=[{
                "role": "user",
                "content": SCRIPT_PROMPT.format(
                    title=title, data=json.dumps(compact, ensure_ascii=False)
                ),
            }],
        ) as stream:
            message = stream.get_final_message()
    except anthropic.RateLimitError:
        print("[WARN] Claude API がレート制限中のため台本生成をスキップします")
        return None
    except anthropic.APIStatusError as e:
        print(f"[WARN] Claude API エラー ({e.status_code}) のため台本生成をスキップします")
        return None
    except anthropic.APIConnectionError:
        print("[WARN] Claude API に接続できないため台本生成をスキップします")
        return None

    text = "".join(b.text for b in message.content if b.type == "text")
    return text.strip() or None
