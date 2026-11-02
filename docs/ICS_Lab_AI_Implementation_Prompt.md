# AIコーディング依頼：ICS Lab フェーズ1（Next.js初期構築）

添付の `ICS_Lab_Requirements_v1.0.md` を唯一の実装要件として読み、**今回の範囲だけ**を動くソースコードとして実装してください。

## 目的

Node.js 24 LTS / Next.js App Router + TypeScript + Tailwind CSSで、3シナリオ（浄水場、変電設備、鉄道運行管理）の画面・共通カタログ・モックAPIを持つ開発用アプリを構築すること。

## 優先順位

1. Node.js 24 LTSを前提とし、`create-next-app@latest` によるプロジェクト生成、必要な依存関係のインストール。`.nvmrc` は `24` とする。
2. 3ラボの固定ID・slugを持つ型安全な単一データソース。
3. `/`、`/labs`、`/labs/[slug]`、`/dashboard` の画面。
4. `GET /api/health`、`GET /api/labs`、`GET /api/labs/[slug]`。
5. VMランタイムの型定義と `DisabledRuntimeProvider` のみ（実接続なし）。
6. README、`.env.example`、`AGENTS.md`、npm scripts、テスト・ビルド検証。

## 禁止事項

- ProxmoxやKali Linuxの実接続、VM起動、攻撃ツールの自動実行は今回実装しない。
- PostgreSQL・認証・OpenPLC・WebSocket・採点機能を追加しない。
- 未実装機能を動作するように見せない。開始ボタンは表示しないか無効化し「準備中」と明記する。
- 複数の重複したラボデータを作らない。シナリオID・slug・名称は変更しない。
- 実行していないコマンドを「検証済み」と報告しない。

## 作業方法

- まず要件を読み、作業を短いステップに分解してください。
- 各ステップでファイルを生成・更新し、実行環境がある場合はコマンドを実行してください。
- 既存ファイルがある場合は内容を確認し、無関係の変更を避けてください。
- 本件はまずローカル動作を優先します。外部公開・外部システムへの接続・実設備への通信は行わないでください。
- 公式Next.js仕様に従い、App Router・Route Handler・現在のESLint CLIを使ってください。
- 最後に `npm run lint`、`npm run typecheck`、`npm run build`、`npm test` を実行し、結果を明記してください。
- エラーが発生したら原因と修正内容を報告し、再検証してください。

## 最終提出

動作するプロジェクト全ファイル、起動手順、作成・変更ファイル一覧、テスト結果、未実装一覧、次フェーズでProxmox/Kaliを接続する際の引き継ぎポイントを出力してください。
