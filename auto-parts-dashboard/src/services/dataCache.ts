import type { DailyPrice } from '../types/market'

const STORAGE_KEY = 'auto-parts-market-cache'

export interface CacheState {
  lastUpdated: string
  coverageStart: string
  coverageEnd: string
  totalCompanies: number
}

export const saveMarketData = (data: Record<string, DailyPrice[]>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const loadMarketData = (): Record<string, DailyPrice[]> | null => {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  return JSON.parse(raw)
}

export const getCacheState = (
  data: Record<string, DailyPrice[]>,
): CacheState => {
  const allRows = Object.values(data).flat()

  const dates = allRows.map((item) => item.trade_date).sort()

  return {
    lastUpdated: new Date().toLocaleString(),
    coverageStart: dates[0],
    coverageEnd: dates[dates.length - 1],
    totalCompanies: Object.keys(data).length,
  }
}
