export const generateMockData = (tsCode) => {
  const result = []
  let basePrice = 40 + Math.random() * 80

  for (let i = 365; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const move = (Math.random() - 0.5) * 0.05
    const close = basePrice * (1 + move)

    result.push({
      ts_code: tsCode,
      trade_date: date.toISOString().slice(0, 10),
      open: Number((close * 0.99).toFixed(2)),
      high: Number((close * 1.02).toFixed(2)),
      low: Number((close * 0.98).toFixed(2)),
      close: Number(close.toFixed(2)),
      pre_close: Number(basePrice.toFixed(2)),
      change: Number((close - basePrice).toFixed(2)),
      pct_chg: Number((((close - basePrice) / basePrice) * 100).toFixed(2)),
      vol: Math.random() * 300000,
      amount: Math.random() * 500000000,
    })

    basePrice = close
  }

  return result
}
