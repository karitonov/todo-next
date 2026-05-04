# TODOアプリ開発ガイドライン

このプロジェクトは、@SPECIFICATION.mdに基づいて開発されるシンプルなTODOアプリケーションです。

> **重要**: Next.js 16を使用しています。APIや規約がトレーニングデータと異なる場合があります。`node_modules/next/dist/docs/`のガイドを参照してください。詳細は@AGENTS.mdを参照。

## プロジェクト概要

- **アプリ名**: TODO App
- **種別**: 個人利用向けWebアプリケーション
- **主要機能**: タスク管理、期限設定、ローカル保存
- **デプロイ先**: GitHub Pages (`/todo-next` basePath)

## 技術スタック

- Next.js 16 (App Router、静的エクスポート)
- Tailwind CSS v4
- TypeScript
- ローカルストレージ

## 開発ルール

### コーディング規約

1. **TypeScript**
   - 厳密な型定義を使用
   - `any`型の使用は避ける
   - インターフェースは`interface`を使用

2. **コンポーネント設計**
   - 関数コンポーネントを使用
   - カスタムフックで状態管理ロジックを分離
   - 小さく再利用可能なコンポーネントに分割

3. **ファイル構成**
   ```
   ├── app/
   │   ├── page.tsx
   │   ├── layout.tsx
   │   └── globals.css
   ├── components/
   │   ├── TaskList.tsx
   │   ├── TaskItem.tsx
   │   ├── TaskForm.tsx
   │   └── TaskFilter.tsx
   ├── hooks/
   │   └── useTodos.ts
   ├── types/
   │   └── task.ts
   └── utils/
       ├── constants.ts
       ├── storage.ts
       └── migration.ts
   ```

4. **命名規則**
   - コンポーネント: PascalCase
   - 関数・変数: camelCase
   - 定数: UPPER_SNAKE_CASE
   - ファイル名: コンポーネントはPascalCase、その他はcamelCase

### データ管理

1. **タスクデータ構造**（@SPECIFICATION.mdに準拠）
   ```typescript
   interface Task {
     id: string;
     title: string;
     completed: boolean;
     dueDate?: string;
     createdAt: string;
     updatedAt: string;
   }
   ```

2. **ローカルストレージ**
   - キー名: `todos`
   - JSON形式で保存
   - 読み込み/保存時にエラーハンドリング

### UI/UX実装指針

1. **デザイン原則**
   - シンプルで直感的なUI
   - レスポンシブ対応必須
   - アクセシビリティを考慮

2. **期限表示の色分け**
   - 期限切れ: `text-red-500`
   - 本日期限: `text-orange-500`
   - 期限内: デフォルトカラー

3. **完了済みタスク**
   - 取り消し線: `line-through`
   - グレーアウト: `opacity-50`

### Tailwind CSS v4 注意事項

- `globals.css`は`@import "tailwindcss"`を使用（v3の`@tailwind`ディレクティブは使用しない）
- `postcss.config.mjs`で`@tailwindcss/postcss`プラグインを使用
- `tailwind.config.js`は不要（v4ではCSS-firstの設定）

### テスト方針

1. **自動テスト（Vitest + Testing Library）**
   - `npm test` でテスト実行
   - `npm run test:coverage` でカバレッジ確認

2. **手動テスト項目**
   - タスクの追加・編集・削除
   - 期限設定と警告表示
   - レスポンシブ表示
   - ローカルストレージの永続性

### コミットメッセージ規約

```
feat: 新機能追加
fix: バグ修正
style: UIスタイル変更
refactor: リファクタリング
docs: ドキュメント更新
test: テスト追加・修正
```

### 注意事項

1. **除外機能**（@SPECIFICATION.md参照）
   - ユーザー認証、クラウド同期、カテゴリ分けなどは実装しない
   - スコープを守り、シンプルさを保つ

2. **パフォーマンス**
   - 不要な再レンダリングを避ける
   - `memo`・`useCallback`・`useMemo`を適切に使用

3. **エラーハンドリング**
   - ローカルストレージアクセス時のエラー処理
   - サーバーサイド（`typeof window`）チェック

このガイドラインに従って、@SPECIFICATION.mdの要件を満たす高品質なTODOアプリを開発してください。
