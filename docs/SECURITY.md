# セキュリティ運用ルール（最重要）

POS Supabase は **公開サイト（anon キー）と内部POS（authenticated キー）が同じプロジェクトを共有** している。
うっかりミスで本名・電話・住所が anon に漏れる事故を防ぐため、以下を守ること。

## 三層防御の現状

| 層 | 内容 | 効果 |
|---|---|---|
| 1. RLS (Row Level Security) | 既存テーブルは authenticated のみ SELECT 可 | 行単位で遮断 |
| 2. テーブル単位 GRANT/REVOKE | 23 PII関連テーブルから anon SELECT を REVOKE | テーブル単位で遮断 |
| 3. 列単位 GRANT | `casts`/`attendances` は安全列のみ GRANT、機密列は自動拒否 | 列単位で遮断 |
| 4. 公開ビュー | anon は 5本の `public_*_view` だけ SELECT | 表示列を最小化 |

## 「今後POSに本名・電話・住所カラム/テーブルを追加する」想定

### ケースA: 既存 `casts` に新カラム追加（例: address, tel, kana_name）

**自動的に anon から見えない**（列単位GRANT設計のおかげ）。

- `casts` は table-level SELECT が anon REVOKE 済み
- 安全列のみ列単位 GRANT
- 新カラムは GRANT に含まれないため自動拒否
- 公開ビューに含めない限り絶対漏れない

**追加作業: なし**（自動で安全）

### ケースB: 新テーブル追加（例: `cast_personal_info`）

⚠️ **デフォルトで anon に SELECT/INSERT/UPDATE/DELETE 全部GRANTされる**（Supabaseデフォルト挙動・修正不可）

migration の **最後に必ず以下を書く**:

```sql
CREATE TABLE cast_personal_info (
  cast_id uuid PRIMARY KEY REFERENCES casts(id),
  real_name text,
  phone text,
  address text
);
ALTER TABLE cast_personal_info ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON cast_personal_info FROM anon, authenticated;
-- POS本体で必要なら authenticated に明示的に GRANT
GRANT SELECT, INSERT, UPDATE, DELETE ON cast_personal_info TO authenticated;
```

**忘れたら本名・電話・住所が anon キーで全世界に公開される**。

## migration出す前のチェックリスト（必須）

新テーブル/新カラムを含む migration を作ったら **必ず** :

1. [ ] テーブル新設なら `REVOKE ALL FROM anon, authenticated` してから authenticated に必要な権限だけ GRANT
2. [ ] 機密列を含む列を anon が読まないか、`SET LOCAL ROLE anon; SELECT 機密列 FROM テーブル;` で permission denied 確認
3. [ ] 公開ビューに新列を追加する場合、`security-reviewer` エージェント呼んで監査
4. [ ] 既存ビューに新列追加するときは `SELECT *` で取らない（列を必ず明示）

## ALTER DEFAULT PRIVILEGES 適用済 (2026-05-07)

**`postgres` role 自身のデフォルト権限**は MCP からも変更可能だった (前は `FOR ROLE postgres/supabase_admin` を含めていたため失敗していた)。

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon;
```

migration履歴: `pos-app/supabase/migrations/20260508_block_anon_default_grants.sql`

実証済み: 新テーブル `_verify_default_acl_block` に「山田太郎・豊島区南大塚3-53-3・090-9999-9999」を入れたが anon で **permission denied** だった (テーブル削除済)。

## 公開ビュー編集の禁則

- ❌ `SELECT *` で書く（カラム追加時に意図せず機密が流れる）
- ❌ `casts` から `name`/`hourly_wage`/`birthday`/`drink_back_rate`/`nomination_back_rate`/`deduction_rate`/`commute_fee`/`referral`/`remarks`/`id_verified_at` を SELECT に含める
- ❌ `bills` から `total`/`guest_name`/`tantou_name`/`adjust_amount` を SELECT に含める
- ❌ `payments`/`manual_expenses`/`bank_transactions` を JOIN/SELECT する
- ✅ 列を1個ずつ明示
- ✅ 編集後は `security-reviewer` 必須

## 漏洩時の対応

万一 anon キー経由で機密が漏れたら：
1. 即座に anon キーをローテート（Supabase Dashboard）
2. Vercel 環境変数を新キーに更新・再デプロイ
3. 漏洩経路の特定（pg_stat_statements 等）
4. 対象キャストへの謝罪
