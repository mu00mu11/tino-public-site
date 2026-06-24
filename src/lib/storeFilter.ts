/**
 * マルチ店舗DB対応の店フィルタ（後方互換）。
 *
 * `NEXT_PUBLIC_STORE_CODE` が設定されていれば公開ビューを自店(store_code)に絞る。
 * 未設定（現行＝単一店DB jiaqcz）では素通し＝従来動作そのまま。
 *   - 単一店DBの公開ビューには store_code 列が無いので、未設定時は `.eq` を呼ばない（=壊れない）。
 *   - マルチDB(bddmvodk)へ切替える際は、接続先URL/ANON_KEY をマルチDBに向け、
 *     `NEXT_PUBLIC_STORE_CODE=tino` を足すだけで店絞りが有効化される。
 *
 * 使い方:
 *   let q = supabase.from('public_xxx_view').select('...')
 *   if (STORE_CODE) q = q.eq('store_code', STORE_CODE)
 */
export const STORE_CODE = process.env.NEXT_PUBLIC_STORE_CODE || undefined
