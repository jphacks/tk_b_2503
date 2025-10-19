# Coding Agent Guidelines

## 目次

- [基本原則](#基本原則)
- [開発コマンド](#開発コマンド)
- [アーキテクチャ](#アーキテクチャ)
- [コーディングガイドライン](#コーディングガイドライン)

## 基本原則

- 常に日本語でコミュニケーションを行ってください。すべてのコミットメッセージ、コメント、エラーメッセージ、ユーザーとのやり取りは日本語で行ってください。
- ファイルの削除を行う場合は、必ず実行前に以下を報告し、明示的なユーザー承認を得てください。
  - 対象ファイルのリスト
  - 実行する変更の詳細説明
  - 影響範囲の説明
- 不明な点がある場合は常に質問し、推測で進めてはなりません。
- 実装後の必須作業として、以下のコマンドを実行してください。
  - `pnpm run typecheck && pnpm run lint:fix`
  - 型エラーやリンターのエラーが出た場合は、コミット前に必ず修正してください。
  - エラーを解消するために`eslint.config.mjs`や`tsconfig.json`を変更してはなりません。

## 開発コマンド

### 基本コマンド

- `pnpm run dev` - 開発サーバーを起動
- `pnpm run build` - 本番アプリケーションをビルド
- `pnpm run start` - 本番サーバーを開始
- `pnpm run typecheck` - TypeScript で型チェック

## アーキテクチャ

### 技術スタック

- **言語**: TypeScript
- **フレームワーク**: Next.js 15 with App Router
- **スタイリング**: CSS Modules
- **コード品質**: ESlint, Prettier, Stylelint
- **Git hooks**: Lefthook
- **コンポーネント管理**: Storybook
- **デプロイ**: Vercel
- **データベース**: Turso DB (SQLite)
- **ORM**: Drizzle

詳細な仕様は[docs/spec.md](docs/spec.md)を参照してください。

### プロジェクト構造

```bash
src/
├── app/                    # Next.js App Router
│   ├── api/               # APIルーティング
│   ├── (public)/          # ログイン前のページ
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/          # ログイン後のページ
│   │   ├── {pathname}/
│   │   │   ├── _libs/     # サーバーサイドでデータを取得する関数
│   │   │   ├── _components/
│   │   │   │   └── {name}
│   │   │   │       ├── {name}.tsx
│   │   │   │       ├── {name}.module.css
│   │   │   │       ├── {name}.spec.tsx
│   │   │   │       ├── {name}.stories.tsx
│   │   │   │       ├── action.ts
│   │   │   │       └── index.ts
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── globals.css           # グローバルスタイル
│   ├── layout.tsx            # ルートレイアウト
│   └── page.tsx              # ホームページ
├── components/{name}/         # 汎用的に使用するコンポーネント
│    ├─ {name}.tsx          # 機能固有のコンポーネント
│    ├─ {name}.module.css   # 機能固有のスタイル
│    ├─ {name}.spec.tsx     # 機能固有のユニットテスト
│    ├─ {name}.stories.tsx  # 機能固有のストーリー
│    └─ index.ts            # 機能固有のインデックスファイル
├── libs/                   # グローバルユーティリティ関数
│    └─ drizzle/            # Drizzleの設定
├── types/                  # グローバル型定義
└── hooks/                  # グローバルカスタムフック
```

- コンポーネントの名前はUpperCamelCaseで命名し、ディレクトリ名はkebab-caseで命名してください。
- 汎用的に使用するコンポーネントのみ`components/`に追加してください。単一のページでしか使用しないコンポーネントは各ページコンポーネントと同階層にある`_components/`に追加してください。

## コーディングガイドライン

## `any`の禁止

- いかなる理由があっても`any`を使用してはなりません。

### 型アサーションの禁止

- 型アサーションは禁止です。
- 型アサーションを使用する場合は、明確な理由をコメントアウトとして記述してください。

### `interface`の禁止

- 型定義に`interface`を使用してはなりません。`type`を使用してください。

### クライアントコンポーネントを最小限に

- クライアントコンポーネントは最小限にし、サーバーコンポーネントでデータ取得を行い、propsで子コンポーネントに渡してください。
- ページコンポーネントをクライアントコンポーネントにしてはいけません。`page.tsx`や`layout.tsx`はサーバーコンポーネントにしてください。

### useEffectの禁止

- 初期データを取得するためにuseEffectを使用してはなりません。
- データ取得はpage.tsxでサーバーコンポーネントとして実装し、propsで子コンポーネントに渡してください。
- ブラウザAPIアクセスやイベントリスナー登録など、真に必要な場合のみuseEffectを使用を許可します。この場合は明確な理由をコメントアウトとして記述すべきです。

### Server Actions

- **API Routesは原則として使用禁止とします**
- Server Actionsは使用するコンポーネントと同階層に`action.ts`ファイルを作成し、その中に実装してください。
- 一つのactionに対して一つのファイルを作成してください。

### windowオブジェクトの禁止

- 原則としてwindowオブジェクトを使用してはいけません。
- ページ遷移は`next/navigation`の`useRouter`を使用してください。

### ローディング表示

- APIリクエストを行う際は`useTransition`を使用してローディング表示を行ってください。
- ボタンを連打できないように`disabled`を設定してください。

### CSS Modules

- クラス名はlowerCamelCaseで命名してください。
- 物理的プロパティではなく論理的プロパティを使用してください。
  - 例: `padding-top` -> `padding-block-start`
- `globals.css`にあるCSS Variablesを使用してください。それぞれのモジュールファイルで独自の色を定義してはいけません。

### Zodスキーマの命名規則

- Zodスキーマの変数名はUpperCamelCaseで定義してください。
  - 例: `const CreatePostSchema = z.object({...})`

### 未使用のコードの削除

- `pnpm dlx knip`を実行して未使用のコードを削除してください。

### 環境変数の使用

- 環境変数は`#/clients/env`で定義してください。利用時はこのファイルをインポートし、環境変数を使用してください。
- `process.env`は使用してはいけません。
