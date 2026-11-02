export function SiteFooter({ appName }: { appName: string }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p><strong>{appName}</strong><span>社会インフラの安全を、学びから。</span></p>
        <p>フェーズ1 · 開発プレビュー<span className="footer-divider" aria-hidden="true">/</span>VM未接続</p>
      </div>
    </footer>
  );
}
