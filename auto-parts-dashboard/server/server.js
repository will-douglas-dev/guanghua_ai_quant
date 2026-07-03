import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import database from './db/sqlite.js'
import { generateMockData } from './providers/mockProvider.js'
import { TushareProvider } from './providers/tushareProvider.js'
import { getSchedulerState, startScheduler } from './scheduler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8787

app.use(cors())
app.use(express.json())

const companies = [
  '600660.SH',
  '601689.SH',
  '600741.SH',
  '600699.SH',
  '601799.SH',
]

const tushareProvider = new TushareProvider()

const insertStatement = database.prepare(`
  INSERT OR REPLACE INTO daily_prices (
    ts_code,
    trade_date,
    open,
    high,
    low,
    close,
    pre_close,
    change,
    pct_chg,
    vol,
    amount
  ) VALUES (
    @ts_code,
    @trade_date,
    @open,
    @high,
    @low,
    @close,
    @pre_close,
    @change,
    @pct_chg,
    @vol,
    @amount
  )
`)

app.get('/api/status', (_request, response) => {
  const totalRows = database
    .prepare('SELECT COUNT(*) AS count FROM daily_prices')
    .get()

  response.json({
    provider: process.env.MARKET_PROVIDER || 'mock',
    totalRows: totalRows.count,
    database: 'SQLite',
    cachePath: process.env.DATA_CACHE_PATH,
  })
})

app.post('/api/update', async (_request, response) => {
  try {
    const provider = process.env.MARKET_PROVIDER || 'mock'

    if (provider === 'tushare') {
      const result = await tushareProvider.fetchDailyData(
        '600660.SH',
        '20250101',
        '20251231',
      )

      return response.json(result)
    }

    companies.forEach((tsCode) => {
      const data = generateMockData(tsCode)

      const latestRows = data.slice(-5)

      latestRows.forEach((row) => insertStatement.run(row))
    })

    response.json({
      success: true,
      message: 'SQLite 数据更新完成',
    })
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

startScheduler(async () => {
  console.log('执行自动更新任务')
}, 60)

app.get('/api/scheduler', (_request, response) => {
  response.json(getSchedulerState())
})

app.get('/api/prices/:tsCode', (request, response) => {
  const rows = database
    .prepare(
      `
      SELECT * FROM daily_prices
      WHERE ts_code = ?
      ORDER BY trade_date ASC
    `,
    )
    .all(request.params.tsCode)

  response.json(rows)
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
