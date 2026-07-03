import type { Company, CompanyMetrics, DailyPrice } from '../types/market'

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length

const standardDeviation = (values: number[]) => {
  const avg = average(values)
  const variance = average(values.map((value) => (value - avg) ** 2))
  return Math.sqrt(variance)
}

const calcReturn = (latest: number, previous?: number) => {
  if (!previous || previous === 0) return 0
  return latest / previous - 1
}

const movingAverage = (prices: DailyPrice[], days: number) => {
  const sample = prices.slice(-days)
  return average(sample.map((item) => item.close))
}

export const calculateMetrics = (
  company: Company,
  prices: DailyPrice[],
): CompanyMetrics => {
  const latest = prices[prices.length - 1]
  const closes = prices.map((item) => item.close)
  const latestClose = latest.close

  const ma20 = movingAverage(prices, 20)
  const ma60 = movingAverage(prices, 60)
  const ma120 = movingAverage(prices, 120)

  const high1y = Math.max(...closes)
  const low1y = Math.min(...closes)

  const dailyReturns = prices.slice(-20).map((item) => item.pct_chg / 100)
  const volatility20d = standardDeviation(dailyReturns)

  const return20d = calcReturn(latestClose, prices[prices.length - 21]?.close)
  const drawdown = latestClose / high1y - 1

  let trendLabel = '中性观察'

  if (latestClose > ma20 && ma20 > ma60 && return20d > 0) {
    trendLabel = '强势上涨'
  } else if (latestClose > ma20 && return20d > 0) {
    trendLabel = '温和上涨'
  } else if (Math.abs(return20d) < 0.03) {
    trendLabel = '横盘震荡'
  } else if (latestClose < ma20 && latestClose < ma60) {
    trendLabel = '弱势下跌'
  } else if (drawdown < -0.15) {
    trendLabel = '高位回撤'
  }

  const percentile = ((latestClose - low1y) / (high1y - low1y)) * 100

  const stageComment = `当前股价位于一年价格区间的 ${percentile.toFixed(0)}% 分位，${latestClose > ma20 ? '短期站上 20 日均线' : '短期仍低于 20 日均线'}，${latestClose > ma60 ? '中期趋势偏强' : '仍需观察是否突破 60 日均线'}。近 20 日涨跌幅为 ${(return20d * 100).toFixed(1)}%，趋势处于${trendLabel}阶段。`

  return {
    ts_code: company.ts_code,
    name: company.name,
    latest_close: latestClose,
    latest_pct_chg: latest.pct_chg,
    latest_change: latest.change,
    latest_amount: latest.amount,
    latest_volume: latest.vol,
    return_5d: calcReturn(latestClose, prices[prices.length - 6]?.close),
    return_10d: calcReturn(latestClose, prices[prices.length - 11]?.close),
    return_20d: return20d,
    return_60d: calcReturn(latestClose, prices[prices.length - 61]?.close),
    return_1y: calcReturn(latestClose, prices[0]?.close),
    ma20,
    ma60,
    ma120,
    high_1y: high1y,
    low_1y: low1y,
    drawdown_from_high: drawdown,
    rebound_from_low: latestClose / low1y - 1,
    volatility_20d: volatility20d,
    trend_label: trendLabel,
    stage_comment: stageComment,
  }
}
