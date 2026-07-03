import type { DailyPrice } from '../types/market'

export interface MarketDataProvider {
  fetchDailyData(
    tsCode: string,
    startDate: string,
    endDate: string,
  ): Promise<DailyPrice[]>
}
