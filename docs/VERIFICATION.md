# フェーズ1 検証記録

実施日：2026-11-02（日本時間）。対象：`/Users/iorihayakawa/Downloads/ICS-Lab`。Node.js 24.21.0 / npm 11.19.0 / macOS。

## コマンド結果

| コマンド | 結果 | 確認内容 |
| --- | --- | --- |
| `npx create-next-app@latest … --ts --tailwind --eslint --app --src-dir --import-alias '@/*' --use-npm` | PASS | Next.js 16.4.3 / React 19.3.0で生成。大文字の作業フォルダ名とnpm名を分けるため一時領域のics-labで生成し、既存の空フォルダへ配置 |
| `npm ci` | PASS | lockfileから再インストール。依存の警告は下記参照 |
| `npm run dev` | PASS | `127.0.0.1:3000` でReady。再インストール後も再起動確認 |
| `npm run lint` | PASS | ESLint CLI、エラー・警告なし |
| `npm run typecheck` | PASS | `next typegen && tsc --noEmit`、strict設定 |
| `npm run build` | PASS | Turbopackでコンパイル・型チェック・静的ページ生成成功 |
| `npm test` | PASS | 3ファイル・18件成功 |
| `npm run test:smoke` | PASS | devサーバーへのHTTP検証 |
| `npm run start -- --port 3001` | PASS | 最終ビルドをループバックで起動 |
| `SMOKE_BASE_URL=http://127.0.0.1:3001 npm run test:smoke` | PASS | 最終ビルド後のサーバーへのHTTP検証 |
| `npm audit --omit=dev` | PASS | 本番依存の脆弱性0件 |
| `npm audit` | WARN | 開発依存を含むmoderate 16件、high/critical 0件 |
| `git check-ignore .env.local .env.example` | PASS | `.env.local` のみ除外。exampleは管理可能 |
| 原本とdocsコピーを`cmp`で比較 | PASS | 指定された2文書とも変更なし |

最終の品質確認は `npm run lint && npm run typecheck && npm run build && npm test` を連続実行してすべて終了コード0でした。Vitestの設定ファイルはESM用の `.mts` に揃え、当初の設定読込警告を解消しています。

## 実サーバーのHTTP検証

dev・ビルド後の両方で次を検証しました。

- `/`、`/labs`、`/dashboard`：HTTP 200、共通ヘッダー/ナビ/フッター、日本語設定、カタログ導線。
- 3つの詳細：HTTP 200、APIと一致する名称・全学習目標・全予定設備、準備中、disabled開始ボタン。
- `/labs/unknown`：HTTP 404と専用の404画面。`/unknown`もHTTP 404。
- `/api/health`：HTTP 200、`status=ok`、`service=ics-lab-web`、`runtime=not_configured`、現在UTC時刻。
- `/api/labs`：HTTP 200、total=3、正しい3ID、全件coming_soon。
- 3つの詳細API：HTTP 200、一覧APIと同じLabデータ。
- `/api/labs/unknown`：HTTP 404、JSONの `LAB_NOT_FOUND`。
- `POST /api/labs`：HTTP 405。
- `/api/runtime/start`：HTTP 404。起動操作APIは未作成。

ヘルスチェックの `Cache-Control: no-store` と応答時刻の更新、Providerの全4操作の拒否はVitestでも検証しています。

## 実ブラウザの画面検証

Chromeでトップページの表示・見出し・3ラボの情報を実画面確認しました。Chrome操作中の競合とタイムアウトがあったため、幅検証はSafariに切り替えました。

ビルド後のローカルサーバーに対し、一時的な同一オリジンのiframe検証ページを使用しました。iframe自体の幅を375pxまたは1440pxに設定し、各ページの `innerWidth`、`documentElement.clientWidth`、`documentElement.scrollWidth`、h1数、詳細のdisabledボタンを計測しました。実機スマートフォンでの確認ではありません。

| 画面 | 375px | 1440px |
| --- | --- | --- |
| `/` | PASS | PASS |
| `/labs` | PASS | PASS |
| `/labs/water-treatment` | PASS | PASS |
| `/labs/power-substation` | PASS | PASS |
| `/labs/railway-operations` | PASS | PASS |
| `/dashboard` | PASS | PASS |
| `/labs/unknown` | PASS | PASS |

全14パターンでviewport幅とclientWidth/scrollWidthが一致し、h1は1件でした。3詳細の開始ボタンはすべてdisabledでした。Safariの検証ページに全件PASSが表示されることを確認しました。

375pxではナビゲーションとカードが縦方向に収まり、トップから一覧へのリンクを実クリックして一覧への遷移も確認しました。モバイルの見出し末尾だけが折り返される表示を修正し、最終ビルドで再検証しています。1440pxでは2列のトップ案内と3列のラボカードを使用します。

再確認する場合は、ブラウザのレスポンシブ表示で上記URLを375px・1440pxに設定し、一覧→詳細→一覧に戻る導線、ダッシュボード、404を確認してください。一時検証ページは納品アプリから除去しています。

## アクセシビリティ・境界の確認

- 実ブラウザのアクセシビリティツリーで日本語の見出し階層・ナビゲーション・リンク名・disabled状態を確認。
- 日本語lang、スキップリンク、現在ページのaria-current、リンク/ボタンのfocus-visibleを実装。
- アプリのソースには実設備の接続先、シェル呼出し、VM操作API、攻撃ツール、認証情報、型チェック回避、anyを追加していないことを確認。
- HTTPスモーク以外にfetchはなく、Server Componentsは共通取得関数を直接使用。
- `lsof` で待ち受け先が `127.0.0.1:3000` / `127.0.0.1:3001` であることを確認。
- スクリーンリーダーでの読み上げ、実機タッチ操作、網羅的なキーボード操作・自動コントラスト監査は未実施。

## 既知の制約・修正した問題

1. 初回の一時生成先の親フォルダが存在せず、create-next-appが書込不可を返しました。親フォルダを作成して再実行し、正常生成しました。
2. Vitest設定の初回 `.ts` は将来のESM読込に関する警告を返しました。`.mts` に変更後、再実行は警告なし・全18件PASSでした。
3. npmの生成依存にESLint 9のサポート終了警告と開発依存のmoderate 16件があります。主にESLint/minimatch関連の推移依存で、本番依存は0件です。破壊的な `npm audit fix --force` は実行していません。
4. npm 11.19.0は任意依存fseventsのinstall-script許可に関する警告を表示します。追加許可なしでnpm ci・dev・build・testは成功しています。
5. 全シナリオは準備中。演習・VM・設備制御・認証・履歴・採点は対象外で、動作確認の対象にもしていません。

外部公開、Gitのpush、Proxmox/Kali/実設備への接続は行っていません。
