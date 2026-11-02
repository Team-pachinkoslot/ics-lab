<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ICS Lab フェーズ1

- 日本語UI、TypeScript strict、Next.js App Router、npmを維持する。Node.jsは24 LTS。
- 要件の原本は `docs/ICS_Lab_Requirements_v1.0.md`。今回の実装範囲はフェーズ1のみ。
- シナリオは `src/lib/labs/catalog.ts` を唯一のデータソースとし、画面/APIは `queries.ts` を共有する。固定ID・slug・正式名称を変更しない。
- 全演習は `coming_soon`。開始ボタンは無効化し、稼働中のVM・学習実績を捏造しない。
- `DisabledRuntimeProvider` の全操作は `RUNTIME_NOT_CONFIGURED` で拒否する。実接続・VM操作・攻撃ツール・外部IPスキャンを追加しない。
- 認証・DB・OpenPLC・WebSocket・採点・監視は対象外。秘密情報はクライアントに渡さない。
- `.env.local` はGit管理外、`.env.example` は管理対象。開発サーバーはループバックに限定し、公開しない。
- 変更後は `npm run lint`、`npm run typecheck`、`npm run build`、`npm test` を実行。サーバー起動後は `npm run test:smoke` も実行し、実行結果と未検証を分けて報告する。
- レスポンシブ表示は375px・1440pxで確認する。リンク・見出し・キーボードフォーカスを維持する。
