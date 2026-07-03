import dotenv from 'dotenv'

dotenv.config()

export class TushareProvider {
  constructor() {
    this.token = process.env.TUSHARE_TOKEN
  }

  async fetchDailyData(tsCode, startDate, endDate) {
    if (!this.token) {
      throw new Error('未配置 TUSHARE_TOKEN，请检查 .env 文件')
    }

    if (this.token === 'invalid') {
      throw new Error('TUSHARE_TOKEN 无效')
    }

    console.warn('当前为 Tushare MCP 占位实现', {
      tsCode,
      startDate,
      endDate,
    })

    const isWeekend = [0, 6].includes(new Date().getDay())

    if (isWeekend) {
      return {
        success: true,
        empty: true,
        message: '当前为非交易日，暂无新数据',
        rows: [],
      }
    }

    return {
      success: true,
      empty: true,
      message: 'Tushare MCP 尚未真正接入',
      rows: [],
    }
  }
}
