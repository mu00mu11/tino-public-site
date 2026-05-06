# デザイントークン早見表

スタイルの真ソースは `src/lib/tokens.ts`。直書きCSSは禁止。

## 色

| 用途 | キー | 値 |
|------|------|-----|
| 背景 | `COLOR.bg` | `#ffffff` |
| 文字 | `COLOR.fg` | `#0a0a0a` |
| 補足文字 | `COLOR.muted` | `#6b7280` |
| 罫線（細） | `COLOR.line` | `#e5e7eb` |
| 罫線（太・table border） | `COLOR.border` | `#000000` |
| アクセント（紺・ロゴTINO色） | `COLOR.accent` | `#1b2244` |
| 警告/赤（ロゴ Girl's Bar） | `COLOR.danger` | `#c8102e` |
| カレンダー営業外セル背景 | `COLOR.noBusiness` | `rgb(220,220,220)` |
| フッター背景 | `COLOR.copyrightBg` | `#000000` |

```tsx
// NG
<div style={{ color: '#6b7280' }} />

// OK
import { COLOR } from '@/lib/tokens'
<div style={{ color: COLOR.muted }} />
```

## フォントサイズ

| キー | px相当 | Tailwind |
|------|------|------|
| `FONT.xs` | 10 | `text-[10px]` |
| `FONT.sm` | 12 | `text-xs` |
| `FONT.base` | 14 | `text-sm` |
| `FONT.md` | 16 | `text-base` |
| `FONT.lg` | 18 | `text-lg` |
| `FONT.xl` | 20 | `text-xl` |

## トラッキング（字間）

| キー | Tailwind |
|------|------|
| `FONT.tracking.wide` | `tracking-[0.2em]` |
| `FONT.tracking.extraWide` | `tracking-[0.3em]` |

## 余白

| キー | 用途 |
|------|------|
| `SPACE.pageX` | `px-3 sm:px-4` ページ外側余白 |
| `SPACE.sectionY` | `py-4 sm:py-8` セクション縦余白 |
| `SPACE.cardGap` | `gap-2 sm:gap-3` カード間隔 |

## レイアウト幅

| キー | 値 |
|------|------|
| `LAYOUT.pageMaxW` | `max-w-[1100px]` ページ全体上限 |
| `LAYOUT.contentMaxW` | `max-w-[600px]` ナローセクション |
| `LAYOUT.castGrid` | レスポンシブグリッド (2/3/4/5列) |
| `LAYOUT.calendarMaxW` | カレンダー上限 |
| `LAYOUT.floorMapMaxW` | 椅子↔猫上限 |

## ブレイクポイント（Tailwind）

| キー | px |
|------|------|
| `BREAK.sm` | 640 |
| `BREAK.md` | 768 |
| `BREAK.lg` | 1024 |
| `BREAK.xl` | 1280 |

## 追加するときのルール

- 新しい色や寸法が必要になったら、まず `tokens.ts` に追加
- グローバルに使う値だけ追加（1箇所でしか使わないなら追加しない）
- 同じ用途の色/サイズが複数になりそうなら、グルーピング (`COLOR.cast.bg` 等) を検討
