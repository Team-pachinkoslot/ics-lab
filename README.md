# ICS Lab — フェーズ1

社会インフラ防御シミュレーターのローカル開発用アプリです。浄水場・変電設備・鉄道運行管理のシナリオ紹介、共通カタログ、モックAPIを実装しています。すべての演習は準備中で、VM接続・実設備への通信は行いません。

## 起動

```bash
cd /Users/iorihayakawa/Downloads/ICS-Lab
nvm install
nvm use
npm ci
# 任意。未作成でも既定の表示名と未接続状態で起動できます
cp .env.example .env.local
npm run dev
```

`http://localhost:3000`（または `http://127.0.0.1:3000`）を開きます。終了は `Ctrl+C`。npmのdev/startは `127.0.0.1` に限定して待ち受けます。認証を実装するまでインターネット公開しないでください。

nvmを使わない場合もNode.js 24を用意してください。依存関係は `package-lock.json` を使用して `npm ci` で再現します。

```bash
npm run build
npm start
```

ビルド後のローカル動作も確認できます。devと同時に使う場合は `npm run start -- --port 3001` とします。

## 実装範囲

| 画面 | 内容 |
| --- | --- |
| `/` | 概要、学習のアプローチ、3シナリオ、演習一覧への導線 |
| `/labs` | 3シナリオの名称・難易度・概要・準備中表示 |
| `/labs/water-treatment` | 浄水場へのサイバー攻撃（water-01 / 初級） |
| `/labs/power-substation` | 変電設備の異常対応（power-01 / 中級） |
| `/labs/railway-operations` | 鉄道運行管理システム（rail-01 / 上級） |
| `/dashboard` | 開発プレビュー・学習履歴未実装・現在の開発状況 |
| 未知のURL・slug | 共通の404画面 |

各詳細画面には学習目標、予定設備、注意事項を掲載しています。演習開始ボタンはdisabledで、イベントハンドラーや起動APIはありません。学習時間30/45/60分は仮設定です。全ページで共通ヘッダー・ナビ・フッターを使用し、日本語の見出し、スキップリンク、フォーカス表示、現在ページの案内を備えます。

## API

| GET | 応答 |
| --- | --- |
| `/api/health` | `status: ok`、`service: ics-lab-web`、`runtime: not_configured`、応答時UTC ISO8601のtimestamp |
| `/api/labs` | `{ data: Lab[], meta: { total: 3 } }` |
| `/api/labs/[slug]` | `{ data: Lab }`。未知slugはHTTP 404、`error.code: LAB_NOT_FOUND` |

ヘルスチェックのokはWebプロセスの稼働だけを表します。VM・ICS環境の稼働確認ではありません。時刻を固定・キャッシュしないよう、動的Route Handlerと `Cache-Control: no-store` を指定しています。

```bash
curl -i localhost:3000/api/health
curl -i localhost:3000/api/labs
curl -i localhost:3000/api/labs/water-treatment
curl -i localhost:3000/api/labs/unknown
```

## データとランタイムの境界

```text
Server Components / Route Handlers
                 ↓
        lib/labs/queries.ts
                 ↓
        lib/labs/catalog.ts  ← 唯一のシナリオデータ

lib/runtime/types.ts        ← 将来のProvider契約
lib/runtime/disabled-provider.ts ← 今回唯一の実装（未接続）
```

画面は自分自身のHTTP APIへアクセスせず、カタログ取得関数を直接呼びます。ラボのID・slug・難易度・状態は共通のTypeScript型で管理しています。

`DisabledRuntimeProvider` のstart/getStatus/stop/resetはすべて `RuntimeNotConfiguredError`（code: `RUNTIME_NOT_CONFIGURED`）で拒否します。仮セッションや成功応答は返しません。画面・APIはVM操作を呼び出しません。

## 環境変数

| 変数 | 既定値 | 意味 |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_NAME` | `ICS Lab` | 公開してよい表示名。クライアントに渡されます |
| `LAB_RUNTIME_MODE` | `disabled` | フェーズ1はdisabledのみ。変更しても接続機能は存在せず、常に未接続 |

`.env.example` はGit管理対象、`.env.local` を含む他の `.env*` は管理対象外です。Proxmoxトークン等の秘密値は要求しません。外部フォント・画像・CDNを使用しないため、アプリ画面表示のための外部リクエストは不要です。

## 検証

```bash
npm run lint
npm run typecheck
npm run build
npm test
# 別ターミナルで npm run dev を起動してから
npm run test:smoke
# ビルド後のサーバーを3001で起動した場合
SMOKE_BASE_URL=http://127.0.0.1:3001 npm run test:smoke
```

`typecheck` は `next typegen` でRoute型を生成してから `tsc --noEmit` を実行します。クリーンインストール直後にも実行できます。ESLint CLIを直接使用し、Next.jsビルドとは独立して検査します。

2026-11-02の実行結果：npm ci / dev / lint / typecheck / build / testはPASS。Vitestは3ファイル・18件が成功。devとビルド後の両方でHTTPスモークテストが成功しました。詳細・画面検証の範囲は [検証記録](docs/VERIFICATION.md) を参照してください。

テストではカタログの固定値・重複・準備中状態、全APIのJSON契約、未知slug、応答時刻の更新、ランタイム全操作の拒否を確認します。HTTPスモークは全画面・全API・共通レイアウト・disabledボタン・404・405・VM操作APIが存在しないことを実サーバーで検査します。スモークテストの接続先もループバックに制限しています。

## 実行環境

`create-next-app@latest` の実行時に選ばれた互換版をlockfileで固定しました。生成時にReact Compiler、Cache Components、agent feedbackは有効化していません。

| 項目 | 実際のバージョン |
| --- | --- |
| Node.js | 24.21.0 |
| npm | 11.19.0 |
| create-next-app / Next.js | 16.4.3 |
| React / React DOM | 19.3.0 |
| TypeScript | 5.9.3（strict） |
| Tailwind CSS | 4.3.3 |
| ESLint | 9.39.5（生成CLIの選択版） |
| Vitest | 5.0.5 |

`npm audit --omit=dev` は0件です。開発依存を含む `npm audit` は16件のmoderate（ESLint関連の推移依存）を報告しています。ESLint 9のサポート終了警告もあります。Next.jsの雛形で選ばれた組み合わせを維持し、強制的なメジャー更新や依存上書きは行っていません。互換性を検証しながら開発ツールの更新を検討してください。

## 作成・変更した主要ファイル

| ファイル | 責務 |
| --- | --- |
| `src/lib/labs/types.ts` | Lab型・日本語表示ラベル |
| `src/lib/labs/catalog.ts` | 唯一のシナリオ定義3件 |
| `src/lib/labs/queries.ts` | 一覧・slug検索・表示番号 |
| `src/lib/runtime/types.ts` | 状態・セッション・Provider型 |
| `src/lib/runtime/disabled-provider.ts` | 全操作を拒否する未接続Provider |
| `src/app/layout.tsx` | 共通レイアウト・日本語・metadata |
| `src/app/page.tsx` | トップページ |
| `src/app/labs/page.tsx` | 演習一覧 |
| `src/app/labs/[slug]/page.tsx` | 詳細・未知slug処理・metadata |
| `src/app/dashboard/page.tsx` | 履歴未実装のダッシュボード |
| `src/app/not-found.tsx` | 404 |
| `src/app/globals.css`、`src/app/icon.svg` | レスポンシブスタイル・サービスアイコン |
| `src/app/api/health/route.ts` | 動的ヘルスチェック |
| `src/app/api/labs/route.ts`、`src/app/api/labs/[slug]/route.ts` | 一覧・詳細API |
| `src/components/layout/*` | ヘッダー・フッター |
| `src/components/labs/*`、`src/components/runtime-notice.tsx` | カード・シナリオアイコン・未接続案内 |
| `tests/*.test.ts`、`vitest.config.mts` | 単体・API契約テスト |
| `scripts/smoke.mjs` | 実サーバーのHTTP検証 |
| `package.json`、`package-lock.json` | 依存・スクリプト・Node要件 |
| `tsconfig.json`、`eslint.config.mjs`、`next.config.ts` | 生成CLIの設定を基礎に使用 |
| `.nvmrc`、`.env.example`、`.gitignore` | 開発環境・Git除外 |
| `AGENTS.md`、`README.md`、`docs/VERIFICATION.md` | 開発規約・起動手順・検証記録 |
| `docs/ICS_Lab_*.md` | 指定された原本のコピー（内容は変更なし） |

空の作業フォルダに初期作成しています。Gitリポジトリはmainブランチで初期化しました。コミット・リモート登録・pushは行っていません。Next.jsの生成アセットはサービス専用アイコンに置き換えています。

## 未実装（仕様どおりの対象外）

Proxmox接続、Kali VM起動・操作、noVNC/Guacamole、OpenPLC/Python設備モデル、認証・認可、PostgreSQL、WebSocket、リアルタイム監視・SOCログ、学習履歴、採点、管理者設定、一般公開。

## 次フェーズへの引き継ぎ

1. 認証・認可、入力検証、必要に応じたCSRF対策を先に設計する。
2. Proxmox/Kali/ICS模擬設備をインターネットと実設備から隔離し、出口制御・受講者別ネットワークを検証する。
3. サーバー側だけで資格情報を保持し、最小権限の `ProxmoxRuntimeProvider` を今回のProvider契約に沿って実装する。Reactから直接APIやシェルを呼ばない。
4. 起動・停止・初期化には所有権確認、監査ログ、クォータ、タイムアウト、失敗処理、強制回収を設ける。
5. セッション/設備の実際の動作と隔離が確認できるまで、カタログをavailableに変更せず開始ボタンも有効化しない。
6. 新シナリオは共通型のID/slugを拡張し、唯一のカタログに登録する。検証用の期待値も更新する。設備モデル・採点等は後続フェーズで追加する。

## 仕様・公式資料

- [要件定義書 v1.0](docs/ICS_Lab_Requirements_v1.0.md)
- [実装依頼書](docs/ICS_Lab_AI_Implementation_Prompt.md)
- [Next.js Installation](https://nextjs.org/docs/app/getting-started/installation)
- [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
- [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

生成された `AGENTS.md` に従い、インストール済み `node_modules/next/dist/docs/` のRoute Handler・not-found仕様も確認しています。
