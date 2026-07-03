# 中国汽车零部件投资研究 Dashboard

第一阶段：MockProvider 版本。

## 技术方案

- Frontend: React + Vite + TypeScript
- UI: 自定义深色 Dashboard 风格
- Charts: Recharts
- Data Layer: MockProvider（后续切换 Tushare MCP）
- 数据缓存: 第二阶段接入 SQLite

选择原因：

- Vite + React 启动速度快，适合投研 Dashboard；
- TypeScript 方便后续扩展行业与指标；
- Recharts 与 React 集成简单，适合快速构建交互式图表；
- Provider Adapter 结构方便未来替换真实数据源。

---

## 启动方式

前端：

```bash
cd auto-parts-dashboard
npm install
npm run dev
```

后端 API：

```bash
npm run server
```

前后端同时启动：

```bash
npm run dev:full
```

前端地址：

```text
http://localhost:5173
```

后端 API：

```text
http://localhost:8787/api/status
```

---

## 当前阶段功能

✅ 深色投研 Dashboard
✅ 固定汽车零部件公司池
✅ Mock 行情数据
✅ 一年股价走势图
✅ 成交额图表
✅ 一年收益率排名
✅ 趋势分析与阶段判断
✅ 公司切换
✅ 更新数据按钮（Mock）
✅ LocalStorage 本地缓存
✅ 数据覆盖区间展示
✅ 数据状态管理面板
✅ Mock 增量更新逻辑

---

## Provider 结构

当前默认：

```text
MockProvider
```

后续将支持：

```text
TushareMcpProvider
```

目录：

```text
src/services/
```

---

## 当前第三阶段新增

✅ Express 后端 API
✅ SQLite 数据库初始化
✅ SQLite 行情写入
✅ `/api/status`
✅ `/api/update`
✅ `/api/prices/:tsCode`
✅ Tushare Provider 占位
✅ Token 环境变量读取
✅ 前后端同时启动脚本

---

## MCP 与 Tushare 配置

复制环境变量：

```bash
cp .env.example .env
```

配置：

```env
TUSHARE_TOKEN=your_real_token
MARKET_PROVIDER=tushare
```

当前支持：

- mock Provider
- tushare Provider（占位结构）

后续只需要替换：

```text
server/providers/tushareProvider.js
```

即可接入真实 MCP。

---

## 常见错误

### 1. 未配置 Token

```text
未配置 TUSHARE_TOKEN，请检查 .env 文件
```

解决：

```env
TUSHARE_TOKEN=你的 token
```

---

### 2. Token 无效

```text
TUSHARE_TOKEN 无效
```

请检查：

- token 是否正确
- Tushare 账户权限

---

### 3. 非交易日

```text
当前为非交易日，暂无新数据
```

属于正常情况。

---

### 4. SQLite 无数据

请先点击：

```text
更新 Tushare 数据
```

---

### 5. API 无法连接

请确认：

```bash
npm run server
```

已经启动。

---

## GitHub Pages 部署建议

前端：

```bash
npm run build
```

部署：

- Vercel
- Netlify
- GitHub Pages

后端建议：

- Railway
- Render
- Fly.io

SQLite 文件：

```text
/data/auto_parts_market.sqlite
```

建议挂载持久化存储。

---

## 当前第四阶段新增

✅ 前端真实 REST API
✅ SQLite → Dashboard
✅ API 错误提示
✅ token 错误处理
✅ 非交易日提示
✅ 空数据提示
✅ MCP Adapter 完整占位结构
✅ README 完整化
