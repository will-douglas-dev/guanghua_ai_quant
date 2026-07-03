let schedulerState = {
  enabled: false,
  intervalMinutes: 60,
  lastRun: null,
}

export const startScheduler = (callback, intervalMinutes = 60) => {
  schedulerState.enabled = true
  schedulerState.intervalMinutes = intervalMinutes

  setInterval(async () => {
    schedulerState.lastRun = new Date().toISOString()

    try {
      await callback()
    } catch (error) {
      console.error('自动更新失败:', error.message)
    }
  }, intervalMinutes * 60 * 1000)
}

export const getSchedulerState = () => schedulerState
