# 新カラム追加手順

既存セクションに「ドリンク本数」のような新フィールドを追加するときの5ステップ。

## 触る場所は5つだけ

```
1. POS migration  →  2. 公開ビュー  →  3. types.ts  →  4. queries  →  5. セクション
```

## 例: キャストごとに「ニックネーム」を追加する

### 1. POS migration（必要なら）
`pos-app/supabase/migrations/YYYYMMDD_cast_nickname.sql`
```sql
ALTER TABLE cast_public_profiles ADD COLUMN nickname text;
```

### 2. 公開ビュー更新
**重要**: 機密列を漏らさない。SELECT は明示列だけ。

```sql
CREATE OR REPLACE VIEW public_today_attendance_view AS
SELECT
  cpp.slug,
  cpp.display_name,
  cpp.display_age,
  cpp.nickname,            -- ← 追加
  cpp.photo_url,
  a.clock_in,
  a.is_active
FROM attendances a
JOIN cast_public_profiles cpp ON cpp.cast_id = a.cast_id
JOIN casts c ON c.id = a.cast_id
WHERE a.work_date = CURRENT_DATE
  AND a.is_active = true
  AND cpp.is_public = true
  AND c.deleted_at IS NULL
  AND c.status = '在籍';
```

ビューの `SELECT *` は使わない（列を増やしたら全部anonに流れる）。

### 3. `src/lib/types.ts` に追加
```ts
export type TodayAttendance = {
  slug: string
  display_name: string
  display_age: number | null
  nickname: string | null    // ← 追加
  photo_url: string | null
  clock_in: string | null
  is_active: boolean
}
```

### 4. クエリは無変更でOK（ビューが新列を返すので自動で取れる）
ただし型エラーが出たら `as TodayAttendance[]` のキャストが効いているか確認。

### 5. セクションで表示
```tsx
{cast.nickname && (
  <p className="text-xs" style={{ color: COLOR.muted }}>
    ({cast.nickname})
  </p>
)}
```

## 機密列を扱うときの注意

- POSの `casts` テーブルには本名・時給・誕生日が入っている
- それらを公開ビューに**絶対に**含めない
- 不安なときは `security-reviewer` エージェントに監査依頼
- anon ロールで `SELECT 機密列 FROM casts` が permission denied になることを必ず確認:
  ```sql
  SET LOCAL ROLE anon;
  SELECT name FROM casts LIMIT 1;  -- これは permission denied であるべき
  ```
