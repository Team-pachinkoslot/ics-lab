import type { Metadata } from "next";
import Link from "next/link";
import { RuntimeNotice } from "@/components/runtime-notice";
import { getLabs, getLabNumber } from "@/lib/labs/queries";
import { statusLabels } from "@/lib/labs/types";

export const metadata: Metadata = { title: "ダッシュボード" };

export default function DashboardPage() {
  return (
    <div className="container page-stack">
      <header className="page-heading"><p className="eyebrow">開発プレビュー</p><h1>ダッシュボード</h1><p>フェーズ1で確認できる機能と、今後の開発予定をご案内します。</p></header>
      <RuntimeNotice />
      <div className="dashboard-grid">
        <section className="panel history-panel"><span className="empty-icon" aria-hidden="true">≡</span><h2>学習履歴は未実装</h2><p>受講者ごとの履歴・スコア・進捗の保存は、<br className="desktop-break" />後続フェーズで対応します。</p><Link className="button button-primary" href="/labs">演習内容を確認する <span aria-hidden="true">→</span></Link></section>
        <section className="panel"><p className="eyebrow">現在の構成</p><h2>開発状況</h2><dl className="status-list"><div><dt>画面・共通カタログ</dt><dd>確認可能</dd></div><div><dt>VMランタイム</dt><dd>未接続</dd></div><div><dt>認証・データベース</dt><dd>未実装</dd></div><div><dt>採点・リアルタイム監視</dt><dd>未実装</dd></div></dl></section>
      </div>
      <section className="panel" aria-labelledby="planned-labs"><div className="section-heading"><h2 id="planned-labs">演習の準備状況</h2><span className="muted">シナリオ紹介を公開中</span></div><ul className="lab-rows">{getLabs().map((lab) => <li key={lab.id}><span className="row-number">LAB {getLabNumber(lab.id)}</span><Link href={`/labs/${lab.slug}`}>{lab.title}<span aria-hidden="true"> ↗</span></Link><span className="status-badge">{statusLabels[lab.status]}</span></li>)}</ul></section>
    </div>
  );
}
