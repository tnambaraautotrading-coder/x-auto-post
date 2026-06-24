import "./sakurazaka-deck.css";
import { sakurazakaAssets as assets } from "./sakurazaka-assets";

type SlideKind =
  | "cover"
  | "problem"
  | "solution"
  | "visual"
  | "cast"
  | "record"
  | "format"
  | "audience"
  | "difference"
  | "revenue"
  | "benefit"
  | "roadmap"
  | "risk"
  | "ask"
  | "faq"
  | "closing";

export interface SakurazakaDeckProps {
  variant?: "deck" | SlideKind;
}

const slides: SlideKind[] = [
  "cover",
  "problem",
  "solution",
  "visual",
  "cast",
  "record",
  "format",
  "audience",
  "difference",
  "revenue",
  "benefit",
  "roadmap",
  "risk",
  "ask",
  "faq",
  "closing"
];

function Chrome({ index, label }: { index: number; label: string }) {
  return (
    <>
      <div className="sz-kicker">SAKURAZAKA TIGER PROJECT</div>
      <div className="sz-corner">{label}</div>
      <div className="sz-footer">番組企画書 / SPONSOR PITCH DECK / 2026.06 / CONFIDENTIAL</div>
      <div className="sz-page">{String(index).padStart(2, "0")} / 16</div>
    </>
  );
}

function SlideShell({
  index,
  label,
  children,
  className = ""
}: {
  index: number;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`sz-slide ${className}`} aria-label={`桜坂企画書 slide ${index}`}>
      <Chrome index={index} label={label} />
      {children}
    </section>
  );
}

function Cover() {
  return (
    <section className="sz-slide sz-cover" aria-label="桜坂の経営者 cover">
      <img className="sz-cover__image" src={assets.heroCover} alt="桜坂のカウンターに立つ出演者" />
      <div className="sz-cover__shade" />
      <div className="sz-kicker">SAKURAZAKA TIGER PROJECT</div>
      <div className="sz-cover__copy">
        <p className="sz-subtitle">A DOCUMENTARY BAR PROGRAM</p>
        <h1>桜坂の<br />経営者</h1>
        <p className="sz-roman">SAKURAZAKA no KEIEISHA</p>
        <p className="sz-lead">夜のカウンターから、経営の知恵を。</p>
        <div className="sz-cover__meta">
          <span>沖縄・那覇 桜坂</span>
          <span>経営者対話番組</span>
          <span>Season 1</span>
        </div>
      </div>
      <div className="sz-footer">SPONSOR PITCH DECK / v2 / 2026.06 / CONFIDENTIAL</div>
    </section>
  );
}

function Problem() {
  return (
    <SlideShell index={2} label="PROBLEM">
      <h2>経営者番組は、もう成立しない。</h2>
      <p className="sz-en">Why the old format no longer works.</p>
      <div className="sz-three">
        {[
          ["出演する側", "メリットが見えにくい番組は、経営者ブランドを傷つける可能性がある。"],
          ["受ける側", "本音が出ない場では、視聴者の学びも熱量も生まれない。"],
          ["見る側", "勝者と敗者の構図だけでは、今の視聴者には届きにくい。"]
        ].map(([title, body]) => (
          <article className="sz-panel" key={title}>
            <p className="sz-panel__label">THE PROBLEM</p>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </SlideShell>
  );
}

function Solution() {
  return (
    <SlideShell index={3} label="SOLUTION">
      <h2>お金ではなく、経営の知恵を。</h2>
      <p className="sz-en">From investment to insight.</p>
      <div className="sz-split">
        <div>
          <p className="sz-big-copy">沖縄・那覇 桜坂のカウンターで、<br />伸び悩む若手経営者と<br />伝説の経営者陣が、夜、対話する。</p>
          <p className="sz-body">結末は「出資 or 不出資」ではなく、ゲストが持ち帰る「3つの宿題」と「3ヶ月後の再来店」。</p>
        </div>
        <aside className="sz-factbox">
          <p>FORMAT AT A GLANCE</p>
          <dl>
            <div><dt>尺</dt><dd>30分 / 60分</dd></div>
            <div><dt>配信</dt><dd>YouTube / ABEMA / TVer</dd></div>
            <div><dt>場所</dt><dd>沖縄・那覇 桜坂</dd></div>
            <div><dt>構成</dt><dd>全12話 / シーズン1</dd></div>
          </dl>
        </aside>
      </div>
    </SlideShell>
  );
}

function Visual() {
  return (
    <SlideShell index={4} label="CONCEPT VISUAL" className="sz-visual">
      <img src={assets.hero169} alt="番組キービジュアル" />
      <div className="sz-visual__caption">
        <h2>夜のカウンターから、経営の知恵を。</h2>
        <p>経験 × 展開可能性 × 実店舗ロケ × 実話性</p>
      </div>
    </SlideShell>
  );
}

function Cast() {
  const cast = [
    ["南原竜樹", "メインホスト", "質問の鋭さと厳しさを担当", assets.nambara],
    ["尾崎ゆり", "カウンターマスター", "場を温め、本音を引き出す役", assets.ozaki],
    ["安田久", "ゲスト虎", "店舗ビジネスの実践論担当", assets.yasuda]
  ];
  return (
    <SlideShell index={5} label="CAST">
      <h2>3人の経営者が、夜のカウンターに立つ。</h2>
      <p className="sz-en">Three veteran founders, one counter.</p>
      <div className="sz-cast">
        {cast.map(([name, role, copy, image]) => (
          <article className="sz-cast-card" key={name}>
            <img src={image} alt={`${name} portrait`} />
            <span>{role}</span>
            <h3>{name}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </SlideShell>
  );
}

function Record() {
  return (
    <SlideShell index={6} label="TRACK RECORD">
      <h2>ホスト陣が累積で築いた信頼。</h2>
      <p className="sz-en">Combined track record of the cast.</p>
      <div className="sz-metrics">
        {[
          ["3", "人", "ホスト候補"],
          ["90+", "年", "累計経営経験"],
          ["数百", "社", "相談・指導してきた経営者"],
          ["500万", "回+", "YouTube / SNS 累計接触"]
        ].map(([num, unit, label]) => (
          <div className="sz-metric" key={label}>
            <strong>{num}</strong><span>{unit}</span><p>{label}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

function Format() {
  return (
    <SlideShell index={7} label="EPISODE FORMAT">
      <h2>1話の流れは、確立されている。</h2>
      <p className="sz-en">Episode structure: 30 minutes.</p>
      <div className="sz-timeline">
        {[
          ["OP", "夜景・桜坂入口"],
          ["今夜の客", "事業紹介VTR"],
          ["前半相談", "悩みの深掘り"],
          ["虎登場", "別視点の投入"],
          ["後半相談", "打ち手と合意点"],
          ["ED", "3つの宿題"]
        ].map(([time, label]) => (
          <div className="sz-time" key={label}>
            <b>{time}</b><span>{label}</span>
          </div>
        ))}
      </div>
      <div className="sz-hooks">
        <p>3ヶ月後の再来店</p>
        <p>沖縄ロケ夜</p>
        <p>カウンター質問箱</p>
      </div>
    </SlideShell>
  );
}

function Audience() {
  return (
    <SlideShell index={8} label="AUDIENCE">
      <h2>視聴層は、まさにスポンサーの顧客。</h2>
      <p className="sz-en">Audience overlaps with B2B buyer.</p>
      <div className="sz-split">
        <div>
          <p className="sz-big-copy">経営者・幹部・起業希望者</p>
          <p className="sz-body">30〜55歳 / 事業者予備軍〜中小経営 / 年商3〜15億円帯。意思決定者へ自然に届く、スポンサーにとって濃い視聴者層。</p>
        </div>
        <aside className="sz-numberbox">
          <span>REACH FORECAST / PER EPISODE</span>
          <strong>30万-80万</strong>
          <p>YouTube 1話あたり想定</p>
        </aside>
      </div>
    </SlideShell>
  );
}

function Difference() {
  return (
    <SlideShell index={9} label="DIFFERENTIATION">
      <h2>既存番組との違い。</h2>
      <table className="sz-table">
        <tbody>
          {[
            ["場所", "スタジオ", "沖縄・桜坂のリアル店舗"],
            ["目的", "投資・資金提供", "経営の知恵・打ち手提示"],
            ["結末", "出資 / 不出資", "3つの宿題と再来店"],
            ["空気", "緊張感", "本音と対話"],
            ["収益導線", "番組広告", "番組 + コンサル + イベント"]
          ].map(([a, b, c]) => (
            <tr key={a}><th>{a}</th><td>{b}</td><td>{c}</td></tr>
          ))}
        </tbody>
      </table>
    </SlideShell>
  );
}

function Revenue() {
  return (
    <SlideShell index={10} label="REVENUE">
      <h2>スポンサー、5レイヤーの参画機会。</h2>
      <div className="sz-five">
        {["冠スポンサー", "プライム", "サポーティング", "沖縄県内", "コンサル連携"].map((item, i) => (
          <div className="sz-layer" key={item}>
            <span>階層 {i + 1}</span>
            <h3>{item}</h3>
            <p>番組内露出、ロゴ掲出、ショート活用、イベント導線を設計。</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

function Benefit() {
  return (
    <SlideShell index={11} label="SPONSOR BENEFITS">
      <h2>スポンサーが、得るもの。</h2>
      <p className="sz-support">単なる番組露出ではなく、経営者層との接点・信頼移転・二次利用までを一体で設計します。</p>
      <div className="sz-benefits">
        {[
          ["01", "経営者層へのダイレクト訴求", "意思決定者に届く文脈で、自然にブランドを置ける。"],
          ["02", "ブランド信頼の向上", "経験あるホスト陣と同じ場に立つことで信頼を補強。"],
          ["03", "ゲスト経営者との接点", "相談・収録・イベントを通じた事業接点を設計。"],
          ["04", "コンテンツ二次利用", "ショート動画、営業資料、採用広報へ再活用可能。"]
        ].map(([no, text, detail]) => (
          <article key={no}><b>{no}</b><h3>{text}</h3><p>{detail}</p></article>
        ))}
      </div>
    </SlideShell>
  );
}

function Roadmap() {
  return (
    <SlideShell index={12} label="TIMELINE">
      <h2>ロードマップ。</h2>
      <div className="sz-roadmap">
        {[
          ["2026.07", "パイロット撮影"],
          ["2026.08", "編集 / MA"],
          ["2026.09", "シーズン1開始"],
          ["2026.12", "シーズン1終了"],
          ["2027.01", "シーズン2 / BS展開"]
        ].map(([date, task]) => (
          <div className="sz-road" key={date}><b>{date}</b><span>{task}</span></div>
        ))}
      </div>
    </SlideShell>
  );
}

function Risk() {
  return (
    <SlideShell index={13} label="RISK">
      <h2>リスクは、すでに織り込み済み。</h2>
      <div className="sz-risk-list">
        {[
          ["出演者スケジュール", "輪番制で欠席リスク低減"],
          ["経営機密の扱い", "公開可/要伏字/NGを事前確認"],
          ["アルコール/健康", "ノンアル選択肢を用意"],
          ["沖縄移動コスト", "月1まとめ撮りで圧縮"]
        ].map(([risk, action]) => (
          <div className="sz-risk" key={risk}><span>{risk}</span><b>{action}</b></div>
        ))}
      </div>
    </SlideShell>
  );
}

function Ask() {
  return (
    <SlideShell index={14} label="THE ASK">
      <h2>ご検討いただきたい、3つの参画形態。</h2>
      <div className="sz-three">
        {[
          ["共同制作パートナー", "番組のコンセプト設計から関与したい企業向け"],
          ["シーズン1スポンサー", "3ヶ月12話の露出パッケージ"],
          ["ゲスト企業として参加", "自社の経営課題を番組で相談"]
        ].map(([title, body]) => (
          <article className="sz-panel" key={title}><h3>{title}</h3><p>{body}</p></article>
        ))}
      </div>
    </SlideShell>
  );
}

function Faq() {
  return (
    <SlideShell index={15} label="APPENDIX">
      <h2>想定されるご質問。</h2>
      <div className="sz-faq">
        {[
          ["単発検証は可能ですか？", "可能です。初回はパイロット1本で検証できます。"],
          ["出演交渉は完了していますか？", "本企画書は出演確認用素材です。"],
          ["通常番組との差別化は？", "桜坂という場所性と、経営宿題の再来店構造です。"],
          ["最低契約期間は？", "シーズン1を推奨しますが、試験展開も可能です。"]
        ].map(([q, a]) => (
          <article key={q}><b>Q.</b><h3>{q}</h3><p>A. {a}</p></article>
        ))}
      </div>
    </SlideShell>
  );
}

function Closing() {
  return (
    <section className="sz-slide sz-closing" aria-label="桜坂の経営者 closing">
      <img src={assets.hero169} alt="桜坂の経営者キービジュアル" />
      <div className="sz-closing__shade" />
      <div className="sz-closing__copy">
        <p>CONTACT / CALL TO ACTION</p>
        <h2>桜坂の経営者</h2>
        <span>夜のカウンターから、経営の知恵を。</span>
      </div>
    </section>
  );
}

function renderSlide(kind: SlideKind) {
  switch (kind) {
    case "cover": return <Cover />;
    case "problem": return <Problem />;
    case "solution": return <Solution />;
    case "visual": return <Visual />;
    case "cast": return <Cast />;
    case "record": return <Record />;
    case "format": return <Format />;
    case "audience": return <Audience />;
    case "difference": return <Difference />;
    case "revenue": return <Revenue />;
    case "benefit": return <Benefit />;
    case "roadmap": return <Roadmap />;
    case "risk": return <Risk />;
    case "ask": return <Ask />;
    case "faq": return <Faq />;
    case "closing": return <Closing />;
  }
}

export function SakurazakaDeck({ variant = "deck" }: SakurazakaDeckProps) {
  if (variant !== "deck") {
    return <div className="sz-stage sz-stage--single">{renderSlide(variant)}</div>;
  }

  return (
    <main className="sz-stage sz-stage--overview" aria-label="桜坂の経営者 Claude Design deck">
      {slides.map((slide) => <div className="sz-slide-frame" key={slide}>{renderSlide(slide)}</div>)}
    </main>
  );
}
