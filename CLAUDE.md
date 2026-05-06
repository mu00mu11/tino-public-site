# tino-public-site 編集ルール

@AGENTS.md

## アーキテクチャ

```
src/
├── app/page.tsx              # セクションを並べるだけ（ロジック禁止）
├── components/
│   ├── sections/             # 1セクション = 1ファイル（縦ブロック）
│   └── ui/                   # 再利用パーツ（atoms）
├── lib/
│   ├── supabase.ts           # クライアント
│   ├── queries/              # データ層（公開ビューSELECT）
│   ├── types.ts              # ビューと1:1の型
│   ├── tokens.ts             # デザイントークン真ソース
│   ├── thresholds.ts
│   ├── info.ts               # 店舗情報
│   └── tino-original.ts      # 旧サイト解析データ
└── docs/
    ├── ADDING_SECTIONS.md
    ├── ADDING_FIELDS.md
    └── DESIGN_TOKENS.md
```

## やってはいけないこと

- ❌ `app/page.tsx` にロジック書く（セクション import & 並べるだけ）
- ❌ スタイルリテラル直書き（必ず `tokens.ts` 経由）
- ❌ `'use client'` 不必要付与（state/effect 無いなら不要）
- ❌ セクション間で互いに import（独立を保つ）
- ❌ ビューに `SELECT *` 使う（カラムを必ず明示列挙・機密漏洩防止）
- ❌ `casts` / `bills` / `payments` 等POS本体テーブルに anon で直アクセス

## やること

- ✅ 新セクション追加 → `docs/ADDING_SECTIONS.md`
- ✅ 新カラム追加 → `docs/ADDING_FIELDS.md`
- ✅ 色/フォント/余白 → `docs/DESIGN_TOKENS.md`
- ✅ 機密列を扱うDB変更後 → `security-reviewer` で監査
- ✅ `.env.local` に NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY のみ
  - service_role key は絶対置かない

## データソース

POS本番Supabase (`claudpos-tokyo` / `jiaqczrudvkixbqpwqkj`) の **公開ビュー**経由:

| ビュー | 用途 |
|------|------|
| `public_floor_status_view` | 椅子↔猫10席状態 |
| `public_today_attendance_view` | 本日出勤キャスト + ドリンク/ショット本数 |
| `public_today_cast_orders_view` | キャスト別本日注文集計（直近20時間） |
| `public_casts_view` | 公開キャスト一覧 |
| `public_daily_stats_view` | カレンダー日次客数 |
| `public_site_config_view` | HP表示ON/OFF・閾値設定 |

機密列（本名・時給・誕生日・売上額）は anon にカラム単位 REVOKE 済み。

## デプロイ

`main` ブランチに push すると Vercel が自動デプロイ。本番URL: `https://tino-public-site.vercel.app/`
