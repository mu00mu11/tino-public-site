/**
 * tino-original.ts
 * --------------------------------------------------------------------
 * 大塚ガールズバーTINO 公式既存サイト `https://tino.night-entertainment.jp/`
 * を 2026-05-07 にPlaywright + WebFetchで完全解析した結果の機械可読版。
 *
 * 旧サイトはjQuery 1.4.2 + 静的HTML + table。当公開サイトは
 * 「ロゴ・椅子↔猫・キャスト一覧・カレンダー・電話/Maps・コピーライト」
 * という縦1ページ構造を踏襲しつつ、現代風 (Tailwind/Next.js) で再構築。
 *
 * このファイルは「設計の真ソース」。新規ページ追加・拡張・移植時は
 * この定数を参照すること。
 * --------------------------------------------------------------------
 */

// ====================================================================
// メタデータ
// ====================================================================

export const TINO_ORIGINAL_META = {
  source_url: 'https://tino.night-entertainment.jp/',
  analyzed_at: '2026-05-07',
  cms: 'static HTML (likely PHP-rendered)',
  js_lib: 'jQuery 1.4.2 (Mixed Content blocked → JS dead in modern browsers)',
  google_analytics: 'G-VCGXEQKT0W',
  cache_buster_query: '?330',
  responsive_strategy: 'width:100vw + table natural scaling',
  navigation: 'none (single page)',
  detail_pages: 'none',
  social_links: 'none',
  contact_form: 'none',
} as const

// ====================================================================
// デザイントークン（実測値）
// ====================================================================

export const TINO_ORIGINAL_TOKENS = {
  colors: {
    background: '#FFFFFF',
    foreground: '#000000',
    border: '#000000',
    hr: 'rgb(128,128,128)',
    link: '#0000EE',
    button_bg: '#F0F0F0',
    calendar_no_business: 'rgb(220,220,220)',
    copyright_bg: '#000000',
    copyright_fg: '#FFFFFF',
    rank6_friday_gradient:
      'linear-gradient(45deg, #B67B03 0%, #DAAF08 45%, #FEE9A0 70%, #DAAF08 85%, #B67B03 90% 100%)',
    rank7_best_gradient:
      'linear-gradient(180deg, rgba(255,97,97,1), rgba(233,178,45,1) 20%, rgba(192,202,75,1) 34%, rgba(53,179,56,1) 58%, rgba(86,110,243,1) 79%, rgba(154,39,238,1))',
  },
  typography: {
    font_family:
      "'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ Pro W3', メイリオ, Meiryo, 'ＭＳ Ｐゴシック', sans-serif",
    base_size_px: 16,
    letter_spacing: 'normal',
    line_height: 'normal',
    bold_weight: 700,
  },
  spacing: {
    table_margin_y_px: 15,
    cell_padding_px: '3px 8px',
    border_radius_px: 0,
    box_shadow: 'none',
  },
  sizes: {
    logo_w_px: 300,
    logo_h_px: 147,
    cast_photo_px: 100,
    seat_icon_w_px: 25,
    seat_icon_h_px: 50,
    seat_icon_natural_w_px: 441,
    seat_icon_natural_h_px: 1049,
    calendar_emoji_px: 30,
    calendar_emoji_natural: { result0: [83, 83], result_others: [52, 50] as [number, number] },
  },
} as const

// ====================================================================
// ページ構造（縦1列・section定義）
// ====================================================================

export const TINO_ORIGINAL_SECTIONS = [
  { id: 'logo', tag: 'div', desc: '中央配置 tino.png 300x147 紺TINO + 赤Girl\'s Bar 筆記体' },
  { id: 'reload_button', tag: 'button', desc: '更新するボタン onclick=window.location.reload()' },
  { id: 'seat_status', tag: 'div.status', desc: '椅子↔猫アイコン10個 横1列 flex' },
  { id: 'cast_table', tag: 'table', desc: 'キャスト一覧 縦1列table 写真100x100 + 名前/年齢/出勤帯/ドリンク数/ショット数' },
  { id: 'calendar', tag: 'table[]', desc: '月別table 降順9ヶ月分 各セルに日付+result?.png+客数' },
  { id: 'links', tag: 'div', desc: '店舗の位置を確認するリンク + 店舗に電話するリンク' },
  { id: 'copyright', tag: 'div.copyright', desc: '黒背景白文字 © 大塚ガールズバーTINO All Rights Reserved.' },
] as const

// ====================================================================
// 椅子↔猫の状態管理
// ====================================================================

export const TINO_ORIGINAL_SEAT = {
  total_count: 10,
  occupied_image: 'img/on.png',     // 猫
  empty_image: 'img/off.png',        // 椅子
  state_format: 'binary array length=10, e.g. [1,0,0,1,1,0,0,0,1,0]',
  observed_state_2026_05_07: [1, 0, 0, 1, 1, 0, 0, 0, 1, 0],
  update_mechanism: 'manual reload only (jQuery dead)',
  realtime: false,
} as const

// ====================================================================
// カレンダー6段階アイコン
// ====================================================================

export const TINO_ORIGINAL_CALENDAR = {
  view_mode: '過去9ヶ月降順 (例: 2025-12 → 2025-04)',
  cell_content: '日付 + result?.png 30x30 + 客数N人',
  result_levels: 6,
  result_filenames: [
    'img/result0.png',  // 営業実績ゼロ/不振 灰しょぼん（natural 83x83・他と異なる）
    'img/result1.png',  // 不振 水色しょぼん
    'img/result2.png',  // 普通- 黄色スマイル
    'img/result3.png',  // 普通+ 黄緑笑顔
    'img/result4.png',  // 好調 ピンク薄笑顔
    'img/result5.png',  // 大好調 ピンク満面
  ],
  rank_classes: {
    friday: 'rank6 (金色グラデ・金曜日特別)',
    best_day_of_month: 'rank7 (虹色グラデ・月最高客数)',
  },
  no_business_cell: 'background rgb(220,220,220) 日付のみ表示',
} as const

// ====================================================================
// キャスト一覧（実物の表示形式）
// ====================================================================

export const TINO_ORIGINAL_CAST_ROW = {
  layout: 'table tr 1行=1キャスト',
  photo_td: '<td><img style="width:100px; height:100px;" src="img/{slug}.png?330"></td>',
  info_td: '<td><b>{name}</b> ({age?})<br>{schedule}<br>ドリンク：{drink}<br>ショット：{shot}</td>',
  default_photo: 'img/cast.png?330 (TINOロゴプレースホルダ)',
  // 観測データ (実キャスト名/出勤情報) はソース外管理: memos/20260507/tino-analysis/
} as const

// ====================================================================
// 店舗情報・コンタクト
// ====================================================================

export const TINO_ORIGINAL_CONTACT = {
  store_name: '大塚ガールズバーTINO',
  operator: '合同会社 M.I.L.S',
  tel: '070-8565-7142',
  tel_link: 'tel:07085657142',
  maps_url: 'https://maps.app.goo.gl/LQ5HEhaRiWxTTj2YA',
  address: '〒170-0005 東京都豊島区南大塚3-53-3 万葉ビル',
  copyright_text: '© 大塚ガールズバーTINO All Rights Reserved.',
  hours_displayed_on_site: false,
} as const

// ====================================================================
// 既存実装の欠陥（再現しないこと）
// ====================================================================

export const TINO_ORIGINAL_DEFECTS = [
  'jQuery 1.4.2 をHTTP参照 → Mixed Content でJSロジック全死',
  'favicon.ico 404',
  'viewport に initial-scale 指定なし',
  'キャスト写真がプレースホルダ (5名中4名が cast.png)',
  'カレンダー過去9ヶ月固定 (未来月送り無し)',
  '本人画像なくても出勤者として表示',
  'Mixed Content で本来のフロアマップが描画されていない',
] as const

// ====================================================================
// 新サイト方針（実物との差分）
// ====================================================================

export const TINO_NEW_SITE_DECISIONS = {
  base: '完コピ＋現代化（白背景死守・table廃止しTailwindグリッド）',
  carry_over: [
    'ロゴ + 椅子↔猫10席 + キャスト一覧 + カレンダー + 電話/Maps + コピーライト',
    'カレンダー6段階アイコン (result0〜5.png をそのまま流用)',
    '椅子↔猫アイコン (on.png/off.png をそのまま流用)',
    'ヒラギノ角ゴ単一フォント',
    '白背景・黒文字',
  ],
  changes: [
    'jQuery 廃止 → React Server Components + Client polling 5秒',
    'カレンダー 過去9ヶ月 → 当月のみ',
    'キャスト写真 任意 → ない場合 logo.jpg 代替',
    'キャスト一覧 全件 → 本日出勤のみ',
    'リアルタイム更新 (5秒polling)',
    '営業時間 表示しない (Sho判断)',
    'POS連動 (本日出勤・椅子↔猫・カレンダー客数)',
  ],
  not_implemented_yet: [
    'キャスト個別詳細ページ /cast/[slug]',
    'シフト表 7日間×時間帯',
    'SNS連携',
    'ランキング',
    '管理画面 (/owner) HP表示ON/OFF・閾値編集',
  ],
} as const

// ====================================================================
// 現在のSupabase公開ビュー (5本)
// ====================================================================

export const TINO_PUBLIC_VIEWS = [
  {
    name: 'public_casts_view',
    columns: ['cast_id', 'slug', 'display_name', 'display_age', 'bio', 'photo_url', 'sns_instagram', 'sns_x', 'sns_tiktok', 'sort_order'],
    purpose: '公開キャスト一覧 (PII遮断)',
  },
  {
    name: 'public_floor_status_view',
    columns: ['seat_id', 'label', 'x', 'y', 'type', 'capacity', 'sort_order', 'is_occupied'],
    purpose: '卓占有状況 (boolean only)',
  },
  {
    name: 'public_today_attendance_view',
    columns: ['slug', 'display_name', 'display_age', 'photo_url', 'clock_in', 'is_active'],
    purpose: '本日出勤キャスト',
  },
  {
    name: 'public_daily_stats_view',
    columns: ['business_date', 'guest_count'],
    purpose: '日次集計 (客数のみ・売上額遮断)',
  },
  {
    name: 'public_site_config_view',
    columns: ['is_published', 'calendar_thresholds', 'show_drink_count', 'show_shot_count'],
    purpose: '管理スイッチ (HP表示ON/OFF・閾値)',
  },
] as const
