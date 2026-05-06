# 新セクション追加手順

縦に並ぶブロックを1個増やすだけなら、5ステップで完了。

## 例：「お知らせ」セクションを追加する

### 1. データソースを決める
- 既存の公開ビュー (`public_*_view`) を使う or 新ビュー追加
- 新ビュー追加時は `pos-app/supabase/migrations/` に migration を書き `apply_migration` する
- anon にカラム漏洩がないか必ず `SET LOCAL ROLE anon; SELECT ...` で検証

### 2. 型を `src/lib/types.ts` に追加
ビューと1:1の TypeScript型。
```ts
export type PublicNotice = {
  id: string
  title: string
  body: string
  posted_at: string
}
```

### 3. クエリを `src/lib/queries/notices.ts` に追加
```ts
import { supabase } from '@/lib/supabase'
import type { PublicNotice } from '@/lib/types'

export async function fetchNotices(): Promise<PublicNotice[]> {
  const { data } = await supabase
    .from('public_notices_view')
    .select('*')
    .order('posted_at', { ascending: false })
  return (data ?? []) as PublicNotice[]
}
```

### 4. セクションを `src/components/sections/NoticeSection.tsx` に作る
```tsx
import { SectionHeading } from '@/components/ui/SectionHeading'
import { COLOR, LAYOUT } from '@/lib/tokens'
import type { PublicNotice } from '@/lib/types'

export function NoticeSection({ notices }: { notices: PublicNotice[] }) {
  if (notices.length === 0) return null
  return (
    <section className="px-3 py-5">
      <div className={`mx-auto w-full ${LAYOUT.contentMaxW}`}>
        <SectionHeading>NEWS</SectionHeading>
        <ul className="space-y-2">
          {notices.map(n => (
            <li key={n.id} style={{ borderColor: COLOR.line }} className="border-b py-2">
              <p className="text-xs" style={{ color: COLOR.muted }}>{n.posted_at}</p>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm">{n.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

### 5. `src/app/page.tsx` で並べる位置に置く
```tsx
import { NoticeSection } from '@/components/sections/NoticeSection'
import { fetchNotices } from '@/lib/queries/notices'

const [seats, today, stats, config, notices] = await Promise.all([
  fetchFloorStatus(),
  fetchTodayAttendance(),
  fetchDailyStats(),
  fetchSiteConfig(),
  fetchNotices(),  // 追加
])
// ...
<NoticeSection notices={notices} />  // 並べたい位置に追加
```

## やってはいけないこと

- ❌ `app/page.tsx` にロジックや fetch を直接書く（薄く保つ）
- ❌ セクション内で `style={{ color: '#xxx' }}` のようにリテラル色を書く（必ず `tokens.ts` 経由）
- ❌ セクションから別セクションのコンポーネントをimportする（独立を保つ）
- ❌ `'use client'` を不必要に付ける（client polling/state が無いなら不要）
