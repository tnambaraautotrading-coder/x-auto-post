import "./post-card.css";

export type PostCardTone = "executive" | "signal" | "urgent";

export interface PostCardProps {
  accountName?: string;
  handle?: string;
  headline?: string;
  body?: string;
  timestamp?: string;
  metricLabel?: string;
  metricValue?: string;
  tone?: PostCardTone;
}

const toneLabels: Record<PostCardTone, string> = {
  executive: "Executive Memo",
  signal: "Market Signal",
  urgent: "Priority"
};

export function PostCard({
  accountName = "南原 竜樹",
  handle = "@nambaratatsuki",
  headline = "経営判断は、数字より先に現場の違和感へ出る",
  body = "15年続く事業と8年で止まる事業を見比べると、差は商品力だけではありません。人の配置、任せ方、撤退の早さ。相談を受ける時、僕は最初にそこを見ます。",
  timestamp = "Today 19:00",
  metricLabel = "Target",
  metricValue = "Consulting Lead",
  tone = "executive"
}: PostCardProps) {
  return (
    <article className={`post-card post-card--${tone}`} aria-label="X post design card">
      <header className="post-card__top">
        <div className="post-card__avatar" aria-hidden="true">南</div>
        <div>
          <p className="post-card__name">{accountName}</p>
          <p className="post-card__handle">{handle}</p>
        </div>
        <span className="post-card__badge">{toneLabels[tone]}</span>
      </header>

      <div className="post-card__rule" />

      <section className="post-card__content">
        <p className="post-card__headline">{headline}</p>
        <p className="post-card__body">{body}</p>
      </section>

      <footer className="post-card__footer">
        <span>{timestamp}</span>
        <span className="post-card__metric">
          <strong>{metricLabel}</strong>
          {metricValue}
        </span>
      </footer>
    </article>
  );
}
