"""youtube_analysis のユニットテスト

実行: python -m unittest discover tests -v
（ネットワーク・API キー不要）
"""
import json
import unittest
from pathlib import Path

from youtube_analysis.analyze import analyze
from youtube_analysis.fetch import parse_duration
from youtube_analysis.report import build_report

SAMPLE = json.loads(
    (Path(__file__).parent.parent / "youtube_analysis" / "sample_data.json").read_text(
        encoding="utf-8"
    )
)


class TestParseDuration(unittest.TestCase):
    def test_full(self):
        self.assertEqual(parse_duration("PT1H2M3S"), 3723)

    def test_minutes_only(self):
        self.assertEqual(parse_duration("PT10M"), 600)

    def test_seconds_only(self):
        self.assertEqual(parse_duration("PT45S"), 45)

    def test_with_days(self):
        self.assertEqual(parse_duration("P1DT1H"), 90000)

    def test_empty_and_invalid(self):
        self.assertEqual(parse_duration(""), 0)
        self.assertEqual(parse_duration(None), 0)
        self.assertEqual(parse_duration("garbage"), 0)


class TestAnalyze(unittest.TestCase):
    def test_empty(self):
        self.assertEqual(analyze([]), {"video_count": 0})

    def test_sample_counts(self):
        result = analyze(SAMPLE)
        self.assertEqual(result["video_count"], len(SAMPLE))
        self.assertEqual(len(result["top_videos"]), 10)
        self.assertEqual(len(result["bottom_videos"]), 5)

    def test_top_videos_sorted(self):
        result = analyze(SAMPLE)
        vpds = [v["views_per_day"] for v in result["top_videos"]]
        self.assertEqual(vpds, sorted(vpds, reverse=True))

    def test_duration_buckets_cover_all(self):
        result = analyze(SAMPLE)
        self.assertEqual(
            sum(d["count"] for d in result["duration_stats"]), len(SAMPLE)
        )

    def test_weekday_buckets_cover_all(self):
        result = analyze(SAMPLE)
        self.assertEqual(
            sum(d["count"] for d in result["weekday_stats"]), len(SAMPLE)
        )

    def test_single_video(self):
        result = analyze(SAMPLE[:1])
        self.assertEqual(result["video_count"], 1)
        self.assertEqual(len(result["top_videos"]), 1)

    def test_feature_rates_between_0_and_1(self):
        result = analyze(SAMPLE)
        for f in result["title_features"]:
            self.assertGreaterEqual(f["top"], 0)
            self.assertLessEqual(f["top"], 1)
            self.assertGreaterEqual(f["bottom"], 0)
            self.assertLessEqual(f["bottom"], 1)


class TestReport(unittest.TestCase):
    def test_empty_report(self):
        report = build_report("テスト", {"video_count": 0})
        self.assertIn("分析対象の動画が見つかりませんでした", report)

    def test_sample_report_sections(self):
        report = build_report("テスト", analyze(SAMPLE))
        for section in [
            "## サマリー",
            "## 伸びている動画 TOP10",
            "## 動画の長さ別パフォーマンス",
            "## 投稿曜日別パフォーマンス",
            "## タイトル分析",
        ]:
            self.assertIn(section, report)

    def test_channel_info_section(self):
        report = build_report(
            "テスト",
            analyze(SAMPLE),
            {"title": "デモch", "subscribers": 1234, "video_count": 56},
        )
        self.assertIn("## チャンネル概要", report)
        self.assertIn("1,234", report)


if __name__ == "__main__":
    unittest.main()
