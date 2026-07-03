import type { DailyPrice } from '../types/market'
import type { MarketDataProvider } from './marketDataProvider'

export class TushareMcpProvider implements MarketDataProvider {
  async fetchDailyData(
    tsCode: string,
    startDate: string,
    endDate: string,
  ): Promise<DailyPrice[]> {
    console.warn('Tushare MCP provider 尚未连接真实 MCP 服务', {
      tsCode,
      startDate,
      endDate,
    })

    return []
  }
}
