import { AUTO_PARTS_COMPANIES } from '../config/companies'
import { mockMarketData } from './mockProvider'
import { loadMarketData, saveMarketData } from './dataCache'

export interface UpdateResult {
  updated: boolean
  message: string
}

export const initializeData = () => {
  const existing = loadMarketData()

  if (existing) {
    return existing
  }

  saveMarketData(mockMarketData)

  return mockMarketData
}

export const updateLatestData = async (): Promise<UpdateResult> => {
  const current = loadMarketData() ?? initializeData()

  AUTO_PARTS_COMPANIES.forEach((company) => {
    const series = current[company.ts_code]
    const latest = series[series.length - 1]

    const latestDate = new Date(latest.trade_date)
    latestDate.setDate(latestDate.getDate() + 1)

    const move = (Math.random() - 0.5) * 0.04
    const close = latest.close * (1 + move)

    series.push({
      ts_code: company.ts_code,
      trade_date: latestDate.toISOString().slice(0, 10),
      open: latest.close,
      high: close * 1.02,
      low: close * 0.98,
      close,
      pre_close: latest.close,
      change: close - latest.close,
      pct_chg: ((close - latest.close) / latest.close) * 100,
      vol: Math.random() * 300000,
      amount: Math.random() * 500000000,
    })
  })

  saveMarketData(current)

  return {
    updated: true,
    message: 'Mock 数据更新完成',
  }
}
