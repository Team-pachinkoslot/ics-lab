# ICS Lab システム要件定義書 v1.0

**文書種別:** 要件定義書・システム基本設計・初期構築指示書  
**プロジェクト:** ICS Lab（社会インフラ防御シミュレーター）  
**作成日:** 2026-11-02  
**実装対象:** フェーズ1：Next.js共通基盤・画面・モックAPIの初期構築  
**目的:** 本書をAIコーディング支援ツールに渡し、再現可能な初期リポジトリを作成する。

## 0. 最初に確認すべきこと

### 0.1 結論と実装範囲

本プロジェクトは「浄水場」「変電設備」「鉄道運行管理」の3シナリオを個別に実装した後、統合Webアプリで管理・実行する教育用システムである。今回は**システム基本設計からNext.jsの開発環境構築、基本画面、共通データモデル、モックAPI、検証まで**を実装する。

**今回実装する:** Next.js起動環境、共通UI、3シナリオの紹介・詳細ページ、共通TypeScript型、ローカルの模擬データ、ヘルスチェックAPI、シナリオ一覧/詳細API、将来の仮想環境連携用インターフェース、テスト・README。

**今回実装しない:** Kali Linux VMの実起動、Proxmox API接続、OpenPLC・Pythonの設備シミュレーション、実環境へのアクセス、実攻撃の自動実行、認証基盤、PostgreSQL、WebSocket、SOCログ収集、自動採点、一般公開。未実装機能を動作するように見せない。

### 0.2 設計上の優先順位

1. 初回の `npm run dev` でWebアプリが正常表示される。
2. 3シナリオが正しい固有ID・データ・画面で表示される。
3. 画面とAPIが同じデータソースを参照し、後から差し替えられる。
4. 将来のKali/Proxmox接続部分が画面・教材のコードから分離される。
5. 危険なVM操作や未実装の攻撃操作を初期画面から実行しない。

### 0.3 前提・決定事項・保留事項

| 区分 | 項目 | 指定内容 |
|---|---|---|
| 決定 | 開発言語 | TypeScript（strict） |
| 決定 | Web | Next.js App Router + React + Tailwind CSS |
| 決定 | パッケージ管理 | npm、package-lock.jsonをGitで管理 |
| 決定 | Node.jsの推奨環境 | Node.js 24 LTS（.nvmrcに24を記載）。公式の最小要件20.9以上は満たすが、サポート終了系は採用しない |
| 決定 | 開発OS | macOS / Linux、WindowsはWSLを許容 |
| 決定 | 初期データ | リポジトリ内のTypeScript定数。DBは未使用 |
| 決定 | 初期動作モード | `LAB_RUNTIME_MODE=disabled`（VM操作は不可） |
| 決定 | 公開範囲 | 開発者PCのローカル利用。認証実装前のインターネット公開は禁止 |
| 保留 | ProxmoxのIP・認証 | 仮想基盤導入フェーズで決定 |
| 保留 | Kali VMテンプレート/必要台数 | 仮想基盤導入フェーズで決定 |
| 保留 | 学習者認証・DB・採点方式 | 後続フェーズで詳細設計 |
| 保留 | 実際のPLC/ICSプロトコル | 模擬環境の隔離・安全性を確認してから決定 |

## 1. 目的・対象利用者

### 1.1 目的

社会インフラに起こりうる異常を、安全な閉域シミュレーション内で調査・防御・復旧する演習プラットフォームを実現する。将来、ブラウザからKali Linuxの演習用VMに接続できる構成へ発展させる。

### 1.2 想定ユーザー

- **受講者（将来）:** 演習を選び、仮想環境で調査し、結果を確認する。
- **演習管理者（将来）:** 演習、受講者、環境、結果を管理する。
- **開発者（今回）:** 3シナリオの画面・モックAPIをローカルで確認する。

今回のフェーズでは認証・ユーザー保存は実装しない。「受講者・管理者」は将来のロール設計であり、ログイン可能であると表示しない。

## 2. シナリオ要件

| 項目 | LAB 01 | LAB 02 | LAB 03 |
|---|---|---|---|
| ID | `water-01` | `power-01` | `rail-01` |
| URLスラッグ | `water-treatment` | `power-substation` | `railway-operations` |
| 正式名称 | 浄水場へのサイバー攻撃 | 変電設備の異常対応 | 鉄道運行管理システム |
| 難易度 | 初級 / `beginner` | 中級 / `intermediate` | 上級 / `advanced` |
| 将来の仮想設備 | タンク・ポンプ・バルブ・センサー | 変電設備・開閉器・計測値 | 仮想列車・運行情報・ダイヤ |
| 学習目標 | 異常値の特定、安全停止、復旧 | 不正操作の発見、封じ込め | 運行情報不整合の検知、安全な運行判断 |
| 今回の状態 | `coming_soon` | `coming_soon` | `coming_soon` |

### 2.1 LAB 01：浄水場へのサイバー攻撃

説明：水位・水圧・ポンプ・バルブに関する異常を調査し、模擬設備を安全な状態に戻すことを目標とする。将来の指標は水位、流量、ポンプ稼働状態、警告情報。初期フェーズでは説明・学習目標・予定機能のみを表示する。

### 2.2 LAB 02：変電設備の異常対応

説明：仮想設備で発生した不正操作イベントや状態変化を、操作履歴・監視データから調査する。将来の指標は電圧、電流、開閉器状態、操作ログ。初期フェーズでは実際の送電・遮断制御は行わない。

### 2.3 LAB 03：鉄道運行管理システム

説明：模擬運行情報・列車位置・ダイヤの不整合を検知し、安全確認できない場合は運行を保留する判断を学ぶ。将来の指標は列車ID、模擬位置、時刻表との差、運行状態。実在鉄道の保安装置や指令システムとは接続しない。

## 3. 機能要件（フェーズ1で必須）

| ID | 機能 | 必須仕様・完了条件 |
|---|---|---|
| FR-01 | 共通レイアウト | 全ページにヘッダー、ナビ、フッター。サービス名を表示 |
| FR-02 | トップページ `/` | ICS Labの概要、3分野の説明、演習一覧への導線 |
| FR-03 | 演習一覧 `/labs` | LAB 01〜03を3件表示。名称・難易度・概要・準備中を明記 |
| FR-04 | 演習詳細 `/labs/[slug]` | slugで対象を判定。学習目標・対象設備・注意事項を表示 |
| FR-05 | 未定義slug | 存在しないslugは404ページへ移動 |
| FR-06 | ダッシュボード `/dashboard` | 「開発プレビュー」と「学習履歴は未実装」を表示。架空の実績を作らない |
| FR-07 | `GET /api/health` | プロセス稼働、VM未接続状態をJSONで返却 |
| FR-08 | `GET /api/labs` | 共通カタログから3件のJSONを返却 |
| FR-09 | `GET /api/labs/[slug]` | 既知slugは1件返却、未知slugはJSONの404 |
| FR-10 | 一元的データ管理 | 画面とAPIが同じ `labCatalog` と型定義を使用 |
| FR-11 | 仮想環境境界 | `LabRuntimeProvider` 型と未接続実装を用意。VMの実操作はしない |
| FR-12 | 開発環境整備 | README・.env.example・Git設定・npm scriptsを用意 |
| FR-13 | 基本検証 | 型チェック、ESLint、ビルド、APIと画面の動作確認 |

### 3.1 UI仕様

- 表示言語は日本語。識別子・API・コードは英語とする。
- デザインは読みやすい管理画面型。色や演出は控えめとし、シナリオ別に簡潔なアイコンを使う。
- トップから演習一覧・詳細へ迷わず移動できること。
- 「演習開始」は非活性（または表示しない）にし、「VM接続は次フェーズで対応」と明記する。
- スマートフォン幅375px程度、PC幅1440px程度でレイアウト崩れがないこと。
- キーボード操作・見出し階層・ラベル・色のコントラストに配慮する。

### 3.2 フェーズ1で実装しない画面・機能

ログイン、ユーザー別学習履歴、リアルタイム監視、Kali操作画面、仮想設備の稼働制御、VM起動ボタン、採点、管理者用設定画面は未実装。説明用の「将来実装予定」表示は許可するが、動作するように偽装しない。

## 4. システム基本設計

### 4.1 全体アーキテクチャ

```text
[開発者ブラウザ]
        |
        v
[Next.js App Router / UI]
  |                  |
  v                  v
[ローカルLab Catalog] [Next.js Route Handlers]
  |                  |
  +------ 同じLab型/データ ---+
        |
        v
[LabRuntimeProvider インターフェース]
        |
        +-- Phase 1: DisabledRuntimeProvider（接続なし）
        |
        +-- Future: ProxmoxRuntimeProvider（認証付きサーバー内）
                                |
                          [Proxmox / Kali VM]
                                |
                      [隔離ICS模擬環境 3シナリオ]
```

今回の実装は上図の **Next.js・共通データ・API・DisabledRuntimeProvider** まで。Proxmox/Kali/ICSは設計上の将来接続先である。

### 4.2 設計原則

- **単一データソース:** カタログ情報は `src/lib/labs/catalog.ts` のみで管理。
- **型安全:** Lab / LabStatus / Difficulty / RuntimeStateなどを共通定義する。
- **疎結合:** ReactコンポーネントからProxmox APIやシェルを直接呼ばない。
- **サーバー境界:** 将来のVM操作と秘密情報はサーバー側にのみ置く。
- **フェイルクローズ:** ランタイム未接続時は起動不可を明確に返す。
- **複製性:** `npm ci` で同じ依存関係をインストールできる。

### 4.3 使用技術・バージョン方針

| レイヤー | 技術 | 今回の扱い |
|---|---|---|
| Web/UI | Next.js（App Router）, React, TypeScript | 必須 |
| CSS | Tailwind CSS | 必須 |
| 静的品質 | ESLint, TypeScript strict | 必須 |
| パッケージ | Node.js 24 LTS（Next.js公式の最低要件は20.9以上）, npm | 必須。チームでLTS系を固定 |
| 基本テスト | Vitest（または同等の軽量テスト） | 推奨。少なくとも主要カタログ検証を実装 |
| ストレージ | TypeScript配列/オブジェクト | 今回必須 |
| DB | PostgreSQL | 後続フェーズ |
| 仮想基盤 | Proxmox VE | 後続フェーズ |
| 演習端末 | Kali Linux VM, noVNC/Guacamole | 後続フェーズ |
| 設備モデル | Python, OpenPLC | 後続フェーズ |

バージョンを根拠なく固定しない。`create-next-app@latest` を実行した時点の互換版を `package-lock.json` で固定し、READMEにNode/npm/Next.jsの実際のバージョンを記録する。

### 4.4 推奨ディレクトリ構成

```text
ics-lab/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── labs/page.tsx
│   │   ├── labs/[slug]/page.tsx
│   │   └── api/
│   │       ├── health/route.ts
│   │       ├── labs/route.ts
│   │       └── labs/[slug]/route.ts
│   ├── components/
│   │   ├── layout/site-header.tsx
│   │   ├── layout/site-footer.tsx
│   │   └── labs/lab-card.tsx
│   └── lib/
│       ├── labs/types.ts
│       ├── labs/catalog.ts
│       ├── labs/queries.ts
│       └── runtime/
│           ├── types.ts
│           └── disabled-provider.ts
├── tests/
│   └── lab-catalog.test.ts
├── .env.example
├── .gitignore
├── .nvmrc
├── AGENTS.md
├── README.md
├── package.json
└── package-lock.json
```

必要に応じてコンポーネント/テストを追加してよいが、同じ責務のファイルを増やさず、App Router構成を優先する。

### 4.5 共通データモデル

`src/lib/labs/types.ts` に少なくとも以下を定義する。IDとslugは固定し、列挙値の表記ゆれを防ぐ。

```ts
export type LabId = 'water-01' | 'power-01' | 'rail-01';
export type LabSlug = 'water-treatment' | 'power-substation' | 'railway-operations';
export type LabDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type LabStatus = 'coming_soon' | 'available' | 'maintenance';

export interface Lab {
  id: LabId;
  slug: LabSlug;
  title: string;
  description: string;
  difficulty: LabDifficulty;
  status: LabStatus;
  objectives: string[];
  assets: string[];      // 将来の模擬設備の名称
  estimatedMinutes: number;
}
```

`src/lib/labs/catalog.ts` に上記3件を定義する。今回の `status` はすべて `coming_soon` とし、実際に稼働可能になるまでは `available` にしない。推奨学習時間は仮設定（例：LAB 01=30分、LAB 02=45分、LAB 03=60分）として扱う。

### 4.6 将来のVMランタイム境界（型のみ）

```ts
export type RuntimeState =
  | 'idle' | 'provisioning' | 'running' | 'stopping' | 'stopped' | 'failed';

export interface RuntimeSession {
  sessionId: string;
  labId: string;
  state: RuntimeState;
}

export interface LabRuntimeProvider {
  start(labId: string): Promise<RuntimeSession>;
  getStatus(sessionId: string): Promise<RuntimeSession>;
  stop(sessionId: string): Promise<void>;
  reset(sessionId: string): Promise<void>;
}
```

今回の `DisabledRuntimeProvider` は各操作で `RUNTIME_NOT_CONFIGURED` を通知するだけとし、成功レスポンスや仮のセッションを返さない。起動・停止などのAPIルートは今回作成しなくてもよい。UIからVM操作を発火させないこと。

## 5. 初期API設計

| Method | Path | 正常応答 | 例外 |
|---|---|---|---|
| GET | `/api/health` | 200 / Web稼働・ランタイム未接続 | 想定外エラー時500 |
| GET | `/api/labs` | 200 / 3件一覧 | 想定外エラー時500 |
| GET | `/api/labs/[slug]` | 200 / 対応する1件 | 不正slugは404 |

### 5.1 `GET /api/health`

```json
{
  "status": "ok",
  "service": "ics-lab-web",
  "runtime": "not_configured",
  "timestamp": "2026-11-02T00:00:00.000Z"
}
```

`timestamp` は応答時のUTC ISO8601を返す。固定時刻のサンプルをそのまま返さない。このAPIの `ok` はWebプロセス稼働のみを示し、KaliやICS環境の正常稼働を意味しない。

### 5.2 `GET /api/labs`

```json
{
  "data": [
    { "id": "water-01", "slug": "water-treatment", "title": "浄水場へのサイバー攻撃", "description": "...", "difficulty": "beginner", "status": "coming_soon", "objectives": ["..."], "assets": ["..."], "estimatedMinutes": 30 },
    { "id": "power-01", "slug": "power-substation", "title": "変電設備の異常対応", "description": "...", "difficulty": "intermediate", "status": "coming_soon", "objectives": ["..."], "assets": ["..."], "estimatedMinutes": 45 },
    { "id": "rail-01", "slug": "railway-operations", "title": "鉄道運行管理システム", "description": "...", "difficulty": "advanced", "status": "coming_soon", "objectives": ["..."], "assets": ["..."], "estimatedMinutes": 60 }
  ],
  "meta": { "total": 3 }
}
```

上記の `...` は説明用であり、実装時は実際の日本語文言・配列に置き換える。

### 5.3 `GET /api/labs/[slug]`

成功時：`{ "data": <Lab> }` を返す。存在しないslugはHTTP 404で以下を返す。

```json
{ "error": { "code": "LAB_NOT_FOUND", "message": "指定された演習が見つかりません。" } }
```

画面用のデータ取得は、Server Componentから自分自身のHTTP APIへ再リクエストせず、共有の `queries.ts` などの関数を直接使用してよい。APIは外部連携・検証用の独立した入口として提供する。

## 6. 非機能要件・セキュリティ要件

| ID | 要件 | 判定基準 |
|---|---|---|
| NF-01 | 起動 | `npm ci` → `npm run dev` でローカル起動 |
| NF-02 | 品質 | `npm run lint`・`npm run typecheck`・`npm run build` が成功 |
| NF-03 | 画面 | Chrome/Safari等の現行ブラウザで表示し、375px〜1440px幅で破綻しない |
| NF-04 | アクセシビリティ | 適切な見出し、リンク名、キーボード移動、コントラスト |
| NF-05 | 安全 | 仮想環境へのコマンド実行なし。外部の実在設備へのアクセスなし |
| NF-06 | 秘密情報 | `.env.local` はGit管理外。クライアントへ秘密情報を送らない |
| NF-07 | 障害処理 | 不明slugは404。APIは明確なエラーコード・HTTPステータスを返す |
| NF-08 | 状態表示 | 未実装機能を「準備中」と表示。実績・採点・VMの稼働状況を捏造しない |
| NF-09 | 拡張性 | 新シナリオはカタログ登録から追加でき、実行環境はProvider差し替え方式 |
| NF-10 | 開発運用 | READMEでセットアップと確認方法を第三者が再現できる |

### 6.1 次フェーズ以降の必須安全設計（今回は設計のみ）

- Kali・ICS模擬設備はインターネットおよび実在の制御設備と隔離し、ネットワーク出口を明示的に制御する。
- 受講者ごとにVM・ネットワーク・セッションを分離する。開発用Proxmox管理権限を受講者に渡さない。
- Proxmox APIの資格情報はサーバー側に保持し、最小権限で操作する。
- 起動/停止/初期化を認可された操作に限定し、監査ログとクォータ・タイムアウト・強制回収を実装する。
- VM利用を開始する前に、認証・CSRF対策（構成に応じて）、入力検証、リソース上限、外部通信の遮断をレビューする。

## 7. 環境構築手順（AIへの初期実装指示）

### 7.1 前提

開発用のNode.jsは**24 LTS**を標準とし、`.nvmrc` に `24` と記載する。Next.js公式の最小要件は20.9以上だが、既にサポート終了となったNode.js系列は採用しない。`node -v` と `npm -v` を確認する。ローカルの開発ディレクトリには不要な既存ファイルがないことを確認する。

### 7.2 プロジェクト作成

```bash
node -v
npm -v
npx create-next-app@latest ics-lab --ts --tailwind --eslint --app --src-dir --import-alias '@/*' --use-npm
cd ics-lab
npm run dev
```

CLIの質問が出た場合は、TypeScript=Yes、ESLint、Tailwind=Yes、App Router=Yes、srcディレクトリ=Yes、エイリアス=`@/*` を選ぶ。依存関係・設定を予告なく変更するオプションは選択しない。完了後 `http://localhost:3000` にアクセスする。Next.jsのバージョンは生成時に確認してREADMEへ記録する。

### 7.3 `.env.example`

```dotenv
# 開発用の公開表示名。秘密情報を含めない
NEXT_PUBLIC_APP_NAME=ICS Lab
# フェーズ1は必ずdisabled。実際のVM操作を禁止
LAB_RUNTIME_MODE=disabled
```

`.env.example` はコミット可、`.env.local` はコミット禁止。初期実装ではProxmoxトークンなどの秘密値を要求しない。

### 7.4 npm scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

上記は `package.json` のscripts部分の要求である。依存関係を削除したり、ファイル全体を上書きせず、必要なテスト依存を追加する。Vitestを利用する場合は設定ファイルも追加する。ESLintは `next lint` ではなくESLint CLIを利用する。

### 7.5 実装順序

1. Next.js初期作成と起動を確認する。
2. 共通Lab型・カタログ3件・取得関数を作成する。
3. ヘッダー・フッター・トップ・一覧・詳細・ダッシュボードを実装する。
4. `/api/health`、`/api/labs`、`/api/labs/[slug]` を実装する。
5. `LabRuntimeProvider` インターフェースとDisabled実装を追加する。
6. 不明slug/レスポンシブ/アクセシビリティ/エラーを確認する。
7. lint/typecheck/build/testを実行し、READMEに実行結果と既知制約を記載する。

## 8. 受け入れテスト（Definition of Done）

| ID | テスト手順 | 合格条件 |
|---|---|---|
| AT-01 | `npm ci`、`npm run dev` | エラーなく起動し`localhost:3000`で表示 |
| AT-02 | `/`を開く | ICS Lab概要と3シナリオへの導線を表示 |
| AT-03 | `/labs`を開く | 指定した3シナリオを重複なく表示 |
| AT-04 | 3つの`/labs/[slug]`を開く | 正しい名称・学習目標・準備中を表示 |
| AT-05 | `/labs/unknown`を開く | 404画面になる |
| AT-06 | `/dashboard`を開く | 開発プレビューと履歴未実装の案内を表示 |
| AT-07 | `curl -i localhost:3000/api/health` | HTTP 200、runtime=`not_configured` |
| AT-08 | `curl -i localhost:3000/api/labs` | HTTP 200、total=3、3件すべて準備中 |
| AT-09 | `curl -i localhost:3000/api/labs/water-treatment` | HTTP 200、id=`water-01` |
| AT-10 | `curl -i localhost:3000/api/labs/unknown` | HTTP 404、code=`LAB_NOT_FOUND` |
| AT-11 | `npm run lint && npm run typecheck && npm run build && npm test` | すべて成功 |
| AT-12 | 画面を375pxと1440pxで確認 | 横はみ出し・表示崩れ・操作不能がない |
| AT-13 | リポジトリ構造と環境変数を確認 | `.env.local`が追跡対象外、秘密値・VM起動実装なし |

**合格時の納品物:** 動作するNext.jsリポジトリ、README、`.env.example`、`AGENTS.md`、主要ファイル一覧、検証コマンド結果、未実装・次フェーズ項目一覧。

## 9. AIコーディング時の制約・報告形式

### 9.1 必須ルール

- 本書を優先仕様とし、不要な追加パッケージや大規模構成変更を行わない。
- 3つのシナリオID・slug・日本語名称を変更しない。
- `any`、型チェック回避、ダミーの成功判定、存在しないAPI/VMを実装済みと表示することを避ける。
- Kali起動、実在設備へのアクセス、外部IPスキャン、攻撃自動化は作らない。
- 変更したファイルと実行した検証コマンドを最終報告する。
- コマンドを実行できないAI環境の場合は、実行済みと主張せず、未検証と明示する。
- 解釈に迷う追加機能は今回の対象外とし、別タスクとして提案する。

### 9.2 AIの最終報告テンプレート

```text
実装完了項目:
- ...

作成・変更した主要ファイル:
- ...

実行したコマンドと結果:
- npm run lint: PASS / FAIL / NOT RUN
- npm run typecheck: PASS / FAIL / NOT RUN
- npm run build: PASS / FAIL / NOT RUN
- npm test: PASS / FAIL / NOT RUN

未実装（仕様どおりの対象外）:
- Proxmox / Kali VM / ICS設備モデル / 認証 / DB / 採点

次フェーズへの引き継ぎ:
- ...
```

## 10. フェーズ2以降への引き継ぎ（今回作業対象外）

| フェーズ | 追加予定機能 | 先行条件 |
|---|---|---|
| Phase 2 | Proxmox・Kali VMの隔離環境、起動/停止/初期化 | 認証・認可・安全設計・隔離検証 |
| Phase 3 | 浄水場のPython設備モデル・PLC連携・HMI | 単体制御・安全状態の試験 |
| Phase 4 | 変電設備・鉄道運行シミュレーターの個別実装 | 共通イベント仕様・データモデル確定 |
| Phase 5 | 共通SOC監視、演習採点、学習履歴、3ラボ統合 | 各ラボの単体テスト完了 |
| Phase 6 | 複合インフラ障害演習、AI教官など | 分離・評価の妥当性確認 |

**追加設計案（今回実装しない）:** 将来、各ラボに `LabScenarioAdapter` を設け、模擬設備の計測値・イベント・防御操作・評価結果を同じAPI契約で提供する。これにより3チームの並行開発後も統合しやすくする。

## 11. 参考情報

- Next.js公式：Installation / create-next-app / Route Handlers  
  https://nextjs.org/docs/app/getting-started/installation  
  https://nextjs.org/docs/app/api-reference/cli/create-next-app  
  https://nextjs.org/docs/app/getting-started/route-handlers
- Node.js公式リリース一覧（Node.js 24 LTS）：https://nodejs.org/en/about/previous-releases
- 企画参考資料：『実践的サイバーセキュリティ人材の育成』『社会インフラにおけるサイバーセキュリティ課題の全体像（総論として）』。教育方式・制御系リスクに関する参考であり、本書の技術・API仕様は本プロジェクトの新規設計とする。
