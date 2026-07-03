import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  RefreshCcw,
  TrendingUp,
} from 'lucide-react'
import { AUTO_PARTS_COMPANIES } from './config/companies'
import { calculateMetrics } from './services/analytics'
import {
  fetchApiStatus,
  fetchCompanyPrices,
  triggerDataUpdate,
} from './services/api'
import type { DailyPrice } from './types/market'
import './index.css'

const formatPct = (value: number) => `${(value * 100).toFixed(2)}%`

function App() {
  const [selectedCode, setSelectedCode] = useState(AUTO_PARTS_COMPANIES[0].ts_code)
  const [marketData, setMarketData] = useState<Record<string, DailyPrice[]>>({})
  const [statusMessage, setStatusMessage] = useState('正在连接后端 API...')
  const [provider, setProvider] = useState('unknown')
  const [databaseRows, setDatabaseRows] = useState(0)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const status = await fetchApiStatus()

      setProvider(status.provider)
      setDatabaseRows(status.totalRows)

      const loaded: Record<string, DailyPrice[]> = {}

      await Promise.all(
        AUTO_PARTS_COMPANIES.map(async (company) => {
          const rows = await fetchCompanyPrices(company.ts_code)
          loaded[company.ts_code] = rows
        }),
      )

      setMarketData(loaded)
      setStatusMessage('SQLite 数据已连接')
      setApiError(null)
    } catch (error) {
      setApiError('无法连接后端 API，请先启动 npm run server')
      setStatusMessage('API 连接失败')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const selectedCompany = AUTO_PARTS_COMPANIES.find(
    (company) => company.ts_code === selectedCode,
  )!

  const selectedPrices = marketData[selectedCode] ?? []

  const metrics = useMemo(() => {
    if (!selectedPrices.length) {
      return null
    }

    return calculateMetrics(selectedCompany, selectedPrices)
  }, [selectedCompany, selectedPrices])

  const rankingData = AUTO_PARTS_COMPANIES.map((company) => {
    const prices = marketData[company.ts_code]

    if (!prices?.length) {
      return {
        name: company.name,
        return_1y: 0,
      }
    }

    const companyMetrics = calculateMetrics(company, prices)

    return {
      name: company.name,
      return_1y: Number((companyMetrics.return_1y * 100).toFixed(2)),
    }
  }).sort((a, b) => b.return_1y - a.return_1y)

  const handleUpdate = async () => {
    setLoading(true)

    try {
      const result = await triggerDataUpdate()

      setStatusMessage(result.message)

      await loadData()
    } catch (error) {
      setApiError('更新失败，请检查 MCP / Provider 配置')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div>
          <p className="sidebar-label">AUTO PARTS INVEST RESEARCH</p>
          <h1>中国汽车零部件投资研究</h1>
          <p className="sidebar-description">
            跟踪头部汽车零部件公司股价、成交额、趋势强弱与阶段位置。
          </p>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <Activity size={16} />
            公司池
          </div>

          <div className="company-list">
            {AUTO_PARTS_COMPANIES.map((company) => (
              <button
                key={company.ts_code}
                type="button"
                className={company.ts_code === selectedCode ? 'company-chip active' : 'company-chip'}
                onClick={() => setSelectedCode(company.ts_code)}
              >
                <span>{company.name}</span>
                <small>{company.category}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="data-panel">
          <div className="sidebar-section-title">
            <Database size={16} />
            数据管理
          </div>

          <div className="data-status-item">
            <span>Provider</span>
            <strong>{provider}</strong>
          </div>

          <div className="data-status-item">
            <span>SQLite Rows</span>
            <strong>{databaseRows}</strong>
          </div>

          <div className="status-badge">
            <CheckCircle2 size={14} />
            {statusMessage}
          </div>

          {apiError && (
            <div className="error-badge">
              <AlertTriangle size={14} />
              {apiError}
            </div>
          )}
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="topbar-label">AI AUTO PARTS WATCH</p>
            <h2>{selectedCompany.name}</h2>
            <div className="market-banner">
              <div className="market-pill positive">汽车零部件指数 +1.82%</div>
              <div className="market-pill">机器人链活跃</div>
              <div className="market-pill negative">部分高位回撤</div>
            </div>
          </div>

          <button
            type="button"
            className="update-button"
            onClick={handleUpdate}
            disabled={loading}
          >
            <RefreshCcw size={16} />
            {loading ? '更新中...' : '更新 Tushare 数据'}
          </button>
        </header>

        {!metrics ? (
          <div className="empty-panel">
            <AlertTriangle size={22} />
            当前 SQLite 中暂无该公司数据，请先点击更新按钮。
          </div>
        ) : (
          <>
            <section className="terminal-overview">
              <div className="terminal-box">
                <span>行业状态</span>
                <strong>景气修复中</strong>
                <p>热管理、机器人链表现较强</p>
              </div>

              <div className="terminal-box">
                <span>强势方向</span>
                <strong>机器人 + 智能底盘</strong>
                <p>拓普集团 / 双环传动 领涨</p>
              </div>

              <div className="terminal-box">
                <span>风险提示</span>
                <strong>高位波动放大</strong>
                <p>注意高估值板块回撤风险</p>
              </div>
            </section>

            <section className="hero-grid">
              <div className="hero-card highlight">
                <span>最新收盘价</span>
                <strong>¥ {metrics.latest_close.toFixed(2)}</strong>
                <p className={metrics.latest_pct_chg >= 0 ? 'positive' : 'negative'}>
                  {metrics.latest_pct_chg.toFixed(2)}%
                </p>
              </div>

              <div className="hero-card">
                <span>一年涨跌幅</span>
                <strong>{formatPct(metrics.return_1y)}</strong>
                <p>{metrics.trend_label}</p>
              </div>

              <div className="hero-card">
                <span>20 日波动率</span>
                <strong>{formatPct(metrics.volatility_20d)}</strong>
                <p>MA20: {metrics.ma20.toFixed(2)}</p>
              </div>

              <div className="hero-card">
                <span>SQLite 数据行数</span>
                <strong>{databaseRows}</strong>
                <p>{statusMessage}</p>
              </div>
            </section>

            <section className="content-grid">
              <div className="chart-panel large">
                <div className="panel-header">
                  <div>
                    <p>一年收盘价走势</p>
                    <small>{selectedCompany.ts_code}</small>
                  </div>
                  <TrendingUp size={18} />
                </div>

                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={selectedPrices.slice(-120)}>
                    <defs>
                      <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                    <XAxis dataKey="trade_date" hide />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke="#4ade80"
                      fillOpacity={1}
                      fill="url(#colorClose)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-panel metrics-panel">
                <div className="panel-header">
                  <div>
                    <p>趋势状态</p>
                    <small>自动阶段判断</small>
                  </div>
                </div>

                <div className="metrics-list">
                  <div>
                    <span>趋势状态</span>
                    <strong>{metrics.trend_label}</strong>
                  </div>
                  <div>
                    <span>距离一年高点</span>
                    <strong>{formatPct(metrics.drawdown_from_high)}</strong>
                  </div>
                  <div>
                    <span>距离一年低点</span>
                    <strong>{formatPct(metrics.rebound_from_low)}</strong>
                  </div>
                  <div>
                    <span>近 20 日涨跌幅</span>
                    <strong>{formatPct(metrics.return_20d)}</strong>
                  </div>
                </div>

                <p className="stage-comment">{metrics.stage_comment}</p>

                <div className="ai-panel">
                  <span>AI 综合评分</span>
                  <strong>
                    {Math.max(
                      0,
                      Math.min(
                        100,
                        50 +
                          metrics.return_20d * 120 +
                          (metrics.latest_close > metrics.ma20 ? 10 : -10) +
                          (metrics.latest_close > metrics.ma60 ? 15 : -15),
                      ),
                    ).toFixed(0)}
                  </strong>
                  <p>
                    {metrics.trend_label === '强势上涨'
                      ? 'AI 判断：短期强势，适合趋势跟踪。'
                      : metrics.trend_label === '高位回撤'
                        ? 'AI 判断：需注意高位波动风险。'
                        : 'AI 判断：处于观察阶段。'}
                  </p>
                </div>
              </div>

              <div className="chart-panel">
                <div className="panel-header">
                  <div>
                    <p>成交额走势</p>
                    <small>最近 60 个交易日</small>
                  </div>
                  <Database size={18} />
                </div>

                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={selectedPrices.slice(-60)}>
                    <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                    <XAxis dataKey="trade_date" hide />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-panel">
                <div className="panel-header">
                  <div>
                    <p>一年涨跌幅排名</p>
                    <small>全部公司对比</small>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={rankingData} layout="vertical">
                    <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" width={70} />
                    <Tooltip />
                    <Bar dataKey="return_1y" radius={[0, 6, 6, 0]}>
                      {rankingData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.return_1y >= 0 ? '#4ade80' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default App
