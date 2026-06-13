# POS DB拡張案（公開サイト連携用）— 実スキーマ確定版

POS本体はTINO専用なので **store_id分岐コードは作らない**。
公開サイトは追加テーブル2つ＋公開ビュー4つだけで動く。

## 前提（2026-05-07 実DB確認済）
- POS本番Supabase: `claudpos-tokyo` (project_id: `jiaqczrudvkixbqpwqkj`)
- POS = TINO専用システム（multi-store構造を作らない）
- **`tables` テーブルは存在しない** → `bills.table_no` (int4) のみで卓管理
- `attendances` の打刻時刻は `clock_in` / `clock_out` (text型「20:30」等)
- `bills` に `business_date` カラムは無い → 集計は `started_at::date` で行う

## 既存テーブル（参照のみ・実カラム）

### casts (124行・rls有)
**機密**: name(本名), hourly_wage, drink_back_rate, nomination_back_rate, deduction_rate, commute_fee, commute_fee_excluded, birthday, referral, remarks, id_verified_at
**公開可**: id, status, sort_order, always_visible, is_main, short_code, deleted_at(NULL判定)

### attendances (2218行・rls有)
**実カラム**: id, cast_id, work_date, is_active, clock_in (text), clock_out (text), is_confirmed, break_minutes, hourly_wage_override, is_reattendance
**機密**: hourly_wage_override, break_minutes, is_reattendance
**公開可**: cast_id, work_date, is_active, clock_in, clock_out

### bills (2555行・rls有)
**機密**: total, guest_name, tantou_name, kyousan_name, voided_*, due_date, adjust_amount, adjust_reason
**公開可**: id, table_no, status, started_at, closed_at, deleted_at, voided（boolean判定のみ）, guest_count

### shift_schedules (16行)
**公開可**: cast_id, work_date, start_time, end_time, is_last（明日以降の出勤予定表示に使える）

### payments / order_items / manual_expenses
**全て機密**（売上額・発注内容・経費）→ 集計のみビュー経由で公開

## 新規追加（最小構成）

### 1. cast_public_profiles テーブル
キャスト本名・住所・給与等を漏らさないため、**公開用プロフィールを別テーブル**に切る。

```sql
CREATE TABLE IF NOT EXISTS cast_public_profiles (
  cast_id uuid PRIMARY KEY REFERENCES casts(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,                    -- URL用（例 'mei-ka'）
  display_name text NOT NULL,                   -- 公開表示名（本名と分離）
  display_age int,                              -- 公開年齢（任意・null可）
  bio text,                                     -- 自己紹介
  photo_url text,                               -- Supabase Storage URL
  sns_instagram text,
  sns_x text,
  sns_tiktok text,
  is_public boolean DEFAULT false,
  sort_order int DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_cast_public_profiles_public ON cast_public_profiles (is_public, sort_order);
```

### 2. floor_seats テーブル
フロアマップの卓座標。POS側に `tables` テーブルが無いので、**`bills.table_no` (int4) と紐付ける**。

```sql
CREATE TABLE IF NOT EXISTS floor_seats (
  id text PRIMARY KEY,                          -- 'T1','T2','C1' 等
  table_no int,                                 -- bills.table_no と一致（NULL可=飾り席）
  label text NOT NULL,                          -- 客向け表示名
  x int NOT NULL,                               -- canvas px座標
  y int NOT NULL,
  capacity int DEFAULT 2,
  type text DEFAULT 'table',                    -- table/counter/sofa/private_room
  is_visible boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_floor_seats_visible ON floor_seats (is_visible, sort_order);
```

### 3. public_site_settings テーブル（管理スイッチ用）
Phase 4でPOS Admin (/owner) からHP表示ON/OFF・閾値編集する。

```sql
CREATE TABLE IF NOT EXISTS public_site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id=1),    -- シングルトン
  is_published boolean DEFAULT false,           -- HP全体表示ON/OFF
  calendar_thresholds jsonb DEFAULT
    '{"r0":0,"r1":3,"r2":6,"r3":10,"r4":15,"r5":20}',  -- 客数しきい値（result0〜5）
  show_drink_count boolean DEFAULT false,
  show_shot_count boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);
INSERT INTO public_site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
```

## 公開ビュー（ろ過層・anonキー専用・ホワイトリストSELECT）

```sql
-- ① 公開キャスト一覧（本名・給与・電話等は除外）
CREATE OR REPLACE VIEW public_casts_view AS
SELECT
  cpp.cast_id,
  cpp.slug,
  cpp.display_name,
  cpp.display_age,
  cpp.bio,
  cpp.photo_url,
  cpp.sns_instagram,
  cpp.sns_x,
  cpp.sns_tiktok,
  cpp.sort_order
FROM cast_public_profiles cpp
JOIN casts c ON c.id = cpp.cast_id
WHERE cpp.is_public = true
  AND c.deleted_at IS NULL
  AND c.status = '在籍';

-- ② 卓状態（猫=客いる／椅子=空席）
-- bills.status='open' AND closed_at IS NULL AND deleted_at IS NULL AND voided=false
CREATE OR REPLACE VIEW public_floor_status_view AS
SELECT
  fs.id AS seat_id,
  fs.label,
  fs.x,
  fs.y,
  fs.type,
  fs.capacity,
  fs.sort_order,
  COALESCE(EXISTS (
    SELECT 1 FROM bills b
    WHERE b.table_no = fs.table_no
      AND b.status = 'open'
      AND b.closed_at IS NULL
      AND b.deleted_at IS NULL
      AND COALESCE(b.voided, false) = false
  ), false) AS is_occupied
FROM floor_seats fs
WHERE fs.is_visible = true;

-- ③ 本日出勤キャスト（attendances + cast_public_profiles 結合）
CREATE OR REPLACE VIEW public_today_attendance_view AS
SELECT
  cpp.slug,
  cpp.display_name,
  cpp.display_age,
  cpp.photo_url,
  a.clock_in,
  a.clock_out,
  a.is_active
FROM attendances a
JOIN cast_public_profiles cpp ON cpp.cast_id = a.cast_id
JOIN casts c ON c.id = a.cast_id
WHERE a.work_date = CURRENT_DATE
  AND a.is_active = true
  AND cpp.is_public = true
  AND c.deleted_at IS NULL
  AND c.status = '在籍';

-- ④ 月次集計（カレンダー用・客数のみ・売上額は出さない）
-- closed_at が日本時刻の営業日に属するように JST(+09:00) で評価
CREATE OR REPLACE VIEW public_daily_stats_view AS
SELECT
  (b.started_at AT TIME ZONE 'Asia/Tokyo')::date AS business_date,
  COUNT(DISTINCT b.id) AS bill_count,
  SUM(COALESCE(b.guest_count, 1)) AS guest_count
FROM bills b
WHERE b.closed_at IS NOT NULL
  AND b.deleted_at IS NULL
  AND COALESCE(b.voided, false) = false
GROUP BY (b.started_at AT TIME ZONE 'Asia/Tokyo')::date;

-- ⑤ 公開サイト設定（HP表示ON/OFF・カレンダー閾値）
CREATE OR REPLACE VIEW public_site_config_view AS
SELECT
  is_published,
  calendar_thresholds,
  show_drink_count,
  show_shot_count
FROM public_site_settings
WHERE id = 1;
```

## RLS / 権限（最小権限）

```sql
-- 新規テーブルにRLSを有効化（policyなし=anonアクセス全拒否）
ALTER TABLE cast_public_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE floor_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_site_settings ENABLE ROW LEVEL SECURITY;

-- 本体テーブルへのanon直アクセスを明示的に拒否
REVOKE ALL ON cast_public_profiles, floor_seats, public_site_settings FROM anon;

-- ビューに対してのみanonへSELECT許可
GRANT SELECT ON
  public_casts_view,
  public_floor_status_view,
  public_today_attendance_view,
  public_daily_stats_view,
  public_site_config_view
TO anon;

-- authenticated/service_role はビューも本体テーブルもPOS側で使うので別管理
```

## Realtime publication（椅子↔猫リアルタイム反映）

```sql
-- 椅子↔猫を即時反映するため bills の変更を購読対象に
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE bills;
  EXCEPTION WHEN duplicate_object THEN
    -- 既に追加済み
    NULL;
  END;
END $$;
-- ※ ビュー自体はrealtime非対応。公開サイト側でbills変化をsubscribe→ビュー再fetch
-- ※ 初期実装はpolling 5秒でリリース、Realtime移行は負荷を見て判断
```

## migration ファイル配置

```
pos-app/supabase/migrations/20260508_public_site_views.sql
```
1ファイルにまとめる：
1. テーブル3個 CREATE
2. ビュー5本 CREATE
3. RLS有効化・REVOKE・GRANT
4. Realtime publication追加
5. シングルトン INSERT (public_site_settings)

## 実装順序
1. **Phase 1-A**: migration SQL作成（このドキュメントのSQL一式）
2. **Phase 1-B**: security-reviewer 事前監査（必須）
3. **Phase 1-C**: `apply_migration` ローカル適用テスト → anonでビュー4本SELECT成功・本体テーブル直叩き403確認

## リスク
- **HIGH**: ビューSELECT列の見落とし→機密漏洩。ホワイトリスト方式 + security-reviewer 必須
- **HIGH**: `bills.status='open' AND closed_at IS NULL` で「現在席埋まってる」判定。POS側で清算前の中間状態が longer-lived かどうかは bill_audit_log で実確認推奨（Phase 5 e2e）
- **MEDIUM**: timezone処理。`started_at` (timestamptz) → JSTで日付集計
- **MEDIUM**: Realtime購読の同接100上限。初期は polling 5秒
- **LOW**: slug衝突（unique制約あり・UI側でも弾く）

## TBD（実装で判明したら埋める）
- bills.status の値ドメイン（'open'のみ確認・他に 'paid' 'pending' 等あるか実データ確認）
- attendances の clock_in が text型のため、出勤時刻ソートはアプリ側で実施
- shift_schedules を「明日以降の出勤予定」公開に使うか（今回は本日出勤のみで進める）

## 削減した設計（前案からの差分）
| 削除した項目 | 理由 |
|---|---|
| `floor_seats.pos_table_id uuid` | tablesテーブル不在のため `table_no int` に変更 |
| `attendances.business_date/start_time/end_time` 想定 | 実カラムは `work_date/clock_in/clock_out` |
| `bills.business_date` 想定 | 実存しない。`started_at::date AT TIME ZONE 'Asia/Tokyo'` で代替 |
| `stores` テーブル列追加 | POS=TINO専用なので info.json で持てば十分 |
| `store_id` カラム全般 | 1店舗前提・分岐ロジック不要 |
