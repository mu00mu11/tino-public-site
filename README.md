# tino-public-site

大塚ガールズバー TINO の公式公開サイト。

## スタック
- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Supabase (anonキー、`public_*_view` 経由のみ読み取り)

## セキュリティ前提
- POSと同じSupabaseプロジェクトを使うが、anonキーから機密列(本名・給与・誕生日・売上額)は物理遮断済み
- `casts` テーブルにはカラム単位GRANTで安全列のみ公開
- 5本の `public_*_view` 経由でのみデータ取得

## 開発
```bash
cp .env.example .env.local
# 値を埋める
npm install
npm run dev
```

`http://localhost:3000` で確認。

## デプロイ
Vercel にPushで自動デプロイ。

環境変数:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
