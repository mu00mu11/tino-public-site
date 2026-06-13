# public-site-data — 公開サイト用 店舗情報・素材

POSと連携する公開Webサイト（tino風 集客＆キャストモチベ）の**店舗情報・画像素材**を集約。

## 設計方針
- **1店舗前提**でシンプルに（store_id・multi-storeフォルダ構造を作らない）
- POS本体（pos-app）の同階層に配置 → サブモジュール経由で公開サイトリポから参照可能
- 将来多店舗化する時に再構造化（その時に store_id ベースに変える）

## 構造

```
pos-app/public-site-data/
├ README.md            ← このファイル
├ TBD.md               ← Sho入力待ちチェックリスト
├ DB_EXTENSION_PLAN.md ← POS DB拡張案
├ info.json            ← 店舗情報（住所・電話・SNS・サイト設定）
├ logo/                ← 店舗ロゴ画像
├ cast-photos/         ← キャスト個別写真（slug.jpg）
├ seat-icons/          ← 猫アイコン・椅子アイコン（Sho提供素材配置済）
│  ├ cat-occupied.jpg
│  └ chair-empty.jpg
├ floor-map/
│  ├ seats.json        ← 卓座標定義
│  └ background.png    ← (任意) フロアマップ背景画像
└ _reference/          ← 参考事例（実装ヒント・直接利用不可）
   └ tino/
      ├ tino-logo.jpg
      ├ cat-original.jpg
      ├ chair-original.jpg
      └ SOURCE.md
```

## info.json スキーマ

| フィールド | 型 | 説明 |
|---|---|---|
| `name_jp` | string | 店舗名（日本語） |
| `name_en` | string \| null | 店舗名（英語・任意） |
| `operator` | string | 運営会社名 |
| `genre` | string | 業態 |
| `address.postal` | string | 郵便番号 |
| `address.full` | string | 住所フル |
| `address.lat`, `address.lng` | number \| null | 緯度経度 |
| `address.maps_url` | string | Google Maps URL |
| `contact.tel` | string | 電話番号（表示用） |
| `contact.tel_link` | string | tel: リンク用 |
| `hours.open` / `close` | string | 営業時間 (HH:MM) |
| `hours.weekly_holiday` | string[] | 定休日 |
| `sns.{instagram,x,tiktok,line,youtube}` | string \| null | SNS URL |
| `branding.logo_file` | string | ロゴ画像ファイル相対パス |
| `branding.primary_color` | string | 主色（HEX） |
| `branding.accent_color` | string | アクセント色 |
| `branding.text_color` | string | 文字色 |
| `branding.font_family` | string | フォントスタック |
| `site.public_visible` | boolean | サイト全体公開ON/OFF |
| `site.show_calendar` | boolean | カレンダー表示 |
| `site.show_calendar_past` | boolean | 過去実績を客に見せるか |
| `site.show_drink_count` | boolean | キャストのドリンク数を客に見せるか |
| `site.show_shot_count` | boolean | 同上ショット数 |
| `site.show_ranking` | boolean | ランキング表示 |
| `site.domain` | string \| null | 本番ドメイン |
| `site.vercel_project` | string \| null | Vercelプロジェクト名 |
| `site.github_repo` | string \| null | GitHubリポ名 |
| `seat_icons.occupied` | string | 客いる席アイコン（猫） |
| `seat_icons.empty` | string | 空席アイコン（椅子） |

## seats.json スキーマ

```json
{
  "canvas": {
    "width": 800,        // フロアマップcanvasサイズ(px)
    "height": 600,
    "background_image": "background.png",  // 任意
    "unit": "px"
  },
  "seats": [
    {
      "id": "T1",        // 店内ユニーク
      "label": "卓1",     // 客向け表示名
      "x": 100,          // canvas左上=0,0 起点のpx
      "y": 100,
      "capacity": 2,     // 席容量(参考)
      "type": "table",   // table | counter | sofa | private_room
      "pos_table_id": null  // POS tablesテーブルの主キー
    }
  ]
}
```

## POS連携の仕組み

```
POS (pos-app) ──→ Supabase ──→ 公開ビュー（ろ過）──→ 公開サイト（別Vercel）
                                                       ↑ 起動時に読み込み
                                                       └ public-site-data/
```

- **DB（Supabase）**: 動的データ（出勤・卓状態・キャスト写真URL・SNSリンク）
- **このフォルダ**: 静的データ（フロア座標・店名・住所・素材）

## なぜPOS内？
公開サイトはPOSの「窓」として機能するため、POSと同リポで管理した方が：
- 関連リソースが1箇所にまとまる
- 公開サイトリポからGitサブモジュールで参照可能
- POS UI改修時に公開サイト連動部分の影響範囲が分かりやすい

## 関連リソース
- POS本体: `..` (pos-app/)
- 解析サマリ: `../../../../memos/20260507/tino-analysis/SUMMARY.md`
- DB拡張案: `./DB_EXTENSION_PLAN.md`
- 公開サイト構築リポ（予定）: 別Vercelプロジェクトとして新規作成
