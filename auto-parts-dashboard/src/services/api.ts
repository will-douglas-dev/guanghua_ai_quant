import type { DailyPrice } from '../types/market'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787/api'

export interface ApiStatus {
  provider: string
  totalRows: number
  database: string
  cachePath: string
}

export const fetchApiStatus = async (): Promise<ApiStatus> => {
  const response = await fetch(`${API_BASE_URL}/status`)

  if (!response.ok) {
    throw new Error('无法连接后端 API')
  }

  return response.json()
}

export const fetchCompanyPrices = async (
  tsCode: string,
): Promise<DailyPrice[]> => {
  const response = await fetch(`${API_BASE_URL}/prices/${tsCode}`)

  if (!response.ok) {
    throw new Error('获取行情失败')
  }

  return response.json()
}

export const triggerDataUpdate = async () => {
  const response = await fetch(`${API_BASE_URL}/update`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('数据更新失败')
  }

  return response.json()
}
