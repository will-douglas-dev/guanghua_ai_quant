export interface Company {
  name: string
  ts_code: string
  category: string
  tags: string[]
}

export interface DailyPrice {
  ts_code: string
  trade_date: string
  open: number
  high: number
  low: number
  close: number
  pre_close: number
  change: number
  pct_chg: number
  vol: number
  amount: number
}

export interface CompanyMetrics {
  ts_code: string
  name: string
  latest_close: number
  latest_pct_chg: number
  latest_change: number
  latest_amount: number
  latest_volume: number
  return_5d: number
  return_10d: number
  return_20d: number
  return_60d: number
  return_1y: number
  ma20: number
  ma60: number
  ma120: number
  high_1y: number
  low_1y: number
  drawdown_from_high: number
  rebound_from_low: number
  volatility_20d: number
  trend_label: string
  stage_comment: string
}
