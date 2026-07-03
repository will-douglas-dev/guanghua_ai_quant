import { AUTO_PARTS_COMPANIES } from '../config/companies'
import type { DailyPrice } from '../types/market'

const generateSeries = (tsCode: string): DailyPrice[] => {
  const result: DailyPrice[] = []
  let basePrice = 30 + Math.random() * 100

  for (let i = 365; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const move = (Math.random() - 0.5) * 0.05
    const close = basePrice * (1 + move)
    const open = close * (1 + (Math.random() - 0.5) * 0.02)
    const high = Math.max(open, close) * (1 + Math.random() * 0.03)
    const low = Math.min(open, close) * (1 - Math.random() * 0.03)

    result.push({
      ts_code: tsCode,
      trade_date: date.toISOString().slice(0, 10),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      pre_close: Number(basePrice.toFixed(2)),
      change: Number((close - basePrice).toFixed(2)),
      pct_chg: Number((((close - basePrice) / basePrice) * 100).toFixed(2)),
      vol: Number((Math.random() * 300000).toFixed(0)),
      amount: Number((Math.random() * 500000000).toFixed(0)),
    })

    basePrice = close
  }

  return result
}

export const mockMarketData = AUTO_PARTS_COMPANIES.reduce<Record<string, DailyPrice[]>>(
  (accumulator, company) => {
    accumulator[company.ts_code] = generateSeries(company.ts_code)
    return accumulator
  },
  {},
)
