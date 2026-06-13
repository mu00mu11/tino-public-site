# Sho入力待ち情報リスト

## ステータス
**2026-05-07 入力ほぼ揃った → Phase 0完了・Phase 1着手中**

## 揃ったもの（2026-05-07追加）
- 店舗: TINO（POSが既にTINO専用システム＝公開サイトもTINOの集客URL）
- 公式ロゴ: `logo/logo.jpg`（紺TINO＋赤Girl's Bar 筆記体）※Sho提供
- 猫アイコン: `seat-icons/cat-occupied.jpg`（客いる席）※Sho提供
- 椅子アイコン: `seat-icons/chair-empty.jpg`（空席）※Sho提供
- 運営会社: 合同会社 M.I.L.S
- 電話番号: 070-8565-7142
- 既存サイト: `tino.night-entertainment.jp` （実物解析済み）
- 設計方針確定: **完コピが基本＋拡張容易な構成**
- 目的: 集客 + 常連応援 + キャストモチベ
- 将来機能（タブ/詳細/SNS/ランキング）: **現段階では作らない**（site.show_future_features=false）
- ブランディング方向性（白基調＋黒文字＋ヒラギノ＋ロゴ紺/赤）
- 機能ON/OFFポリシー（ランキング非表示・過去実績非露出・ドリンク/ショット数非露出）
- 設計方針: store_id分岐は作らない（POS=TINO専用のため）

## 揃えるもの

### 店舗基本情報
- [x] 正式店舗名（TINO / Girl's Bar TINO）
- [x] 運営会社名（合同会社 M.I.L.S）
- [x] 住所: 〒170-0005 東京都豊島区南大塚3-53-3 万葉ビル
- [x] Maps URL: https://maps.app.goo.gl/LQ5HEhaRiWxTTj2YA
- [x] 電話: 070-8565-7142
- [x] 営業時間: **表示しない**（Sho判断）
- [x] 定休日: 表示なし（営業時間と同じ扱い）

### SNS
- [ ] Instagram URL（後追いOK・Sho入手予定）
- [ ] X / TikTok / LINE / YouTube（後追いOK）

### 画像素材
- [x] 店舗ロゴ（logo/logo.jpg ✅Sho提供済）
- [x] 椅子↔猫アイコン（seat-icons/ ✅Sho提供済）
- [ ] キャスト写真（cast-photos/[slug].jpg・**後追い可**・null時 logo.jpg代替）

### 開発環境
- [x] GitHubリポ名: `mu00mu11/tino-public-site`（Claudeが自分で作成）
- [x] Vercelプロジェクト名: `tino-public-site`（同上）
- [x] 本番ドメイン: 初期は `tino-public-site.vercel.app`（Phase 5で独自ドメイン候補提示）

### フロアマップ
- [x] POS DBスキーマ確認済（`tables`テーブル無し・`bills.table_no` int で管理）
- [ ] 総卓数: POSのbills.table_no実値からClaudeが推測 (Sho確認後にseed)
- [ ] 各卓位置: 暫定で椅子↔猫10席を均等配置 → Sho確認後に微調整

## 進め方
1. 上記情報が揃ったらinfo.json/seats.jsonを埋める
2. ClaudeがGitHubリポ作成・Vercel初期化・サイト構築開始
3. Phase 0〜5実装

## 関連ドキュメント
- 解析サマリ: `../../../../memos/20260507/tino-analysis/SUMMARY.md`
- DB拡張案: `./DB_EXTENSION_PLAN.md`
- 構造説明: `./README.md`
