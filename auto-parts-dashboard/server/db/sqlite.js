import Database from 'better-sqlite3'
import path from 'node:path'

const dbPath = process.env.DATA_CACHE_PATH || './data/auto_parts_market.sqlite'

const database = new Database(path.resolve(dbPath))

database.exec(`
  CREATE TABLE IF NOT EXISTS daily_prices (
    ts_code TEXT NOT NULL,
    trade_date TEXT NOT NULL,
    open REAL,
    high REAL,
    low REAL,
    close REAL,
    pre_close REAL,
    change REAL,
    pct_chg REAL,
    vol REAL,
    amount REAL,
    PRIMARY KEY (ts_code, trade_date)
  )
`)

export default database
