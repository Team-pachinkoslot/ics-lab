import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME?.trim() || "ICS Lab";

export const metadata: Metadata = {
  title: { default: `${appName} | 社会インフラ防御シミュレーター`, template: `%s | ${appName}` },
  description: "浄水場・変電設備・鉄道運行管理の調査・防御・復旧を学ぶ、ICS Labの開発プレビュー。演習は準備中です。",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <a href="#main-content" className="skip-link">本文へ移動</a>
        <SiteHeader appName={appName} />
        <main id="main-content" className="site-main" tabIndex={-1}>{children}</main>
        <SiteFooter appName={appName} />
      </body>
    </html>
  );
}
