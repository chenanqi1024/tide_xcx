import { formatDuration } from './util'
import { playSound, SoundItem, stopSound } from './sounds'

export interface SleepTimerState {
  status: 'idle' | 'countdown' | 'alarm'
  targetTime: number
  remainingSeconds: number
  remainingText: string
}

const ALARM_LIMIT_MS = 20 * 60 * 1000
const listeners: Array<(state: SleepTimerState) => void> = []

let state: SleepTimerState = {
  status: 'idle',
  targetTime: 0,
  remainingSeconds: 0,
  remainingText: '未设置',
}
let countdownTimer: number | undefined
let alarmTimer: number | undefined
let alarmSound: SoundItem | undefined

const emit = () => {
  listeners.forEach(listener => listener(state))
}

const stopIntervals = () => {
  if (countdownTimer !== undefined) {
    clearInterval(countdownTimer)
    countdownTimer = undefined
  }
  if (alarmTimer !== undefined) {
    clearTimeout(alarmTimer)
    alarmTimer = undefined
  }
}

const finishAlarm = () => {
  stopSound('alarm')
  stopIntervals()
  state = {
    status: 'idle',
    targetTime: 0,
    remainingSeconds: 0,
    remainingText: '未设置',
  }
  emit()
}

const ringAlarm = () => {
  stopSound('sleep')
  if (alarmSound) {
    playSound(alarmSound, 'alarm')
  }
  state = {
    status: 'alarm',
    targetTime: state.targetTime,
    remainingSeconds: 0,
    remainingText: '闹钟响铃中',
  }
  emit()

  alarmTimer = setTimeout(finishAlarm, ALARM_LIMIT_MS)
  wx.showModal({
    title: '该起床了',
    content: '新的一天已经开始，慢慢睁开眼睛吧。',
    showCancel: false,
    confirmText: '停止闹钟',
    success: finishAlarm,
  })
}

const tick = () => {
  const remainingSeconds = Math.max(0, Math.ceil((state.targetTime - Date.now()) / 1000))
  state = {
    ...state,
    remainingSeconds,
    remainingText: formatDuration(remainingSeconds),
  }
  emit()

  if (remainingSeconds <= 0) {
    if (countdownTimer !== undefined) {
      clearInterval(countdownTimer)
      countdownTimer = undefined
    }
    ringAlarm()
  }
}

export const startSleepTimer = (targetTime: number, nextAlarmSound: SoundItem) => {
  stopIntervals()
  alarmSound = nextAlarmSound
  state = {
    status: 'countdown',
    targetTime,
    remainingSeconds: 0,
    remainingText: '',
  }
  tick()
  countdownTimer = setInterval(tick, 1000)
}

export const cancelSleepTimer = () => {
  if (state.status === 'alarm') {
    stopSound('alarm')
  }
  stopIntervals()
  state = {
    status: 'idle',
    targetTime: 0,
    remainingSeconds: 0,
    remainingText: '未设置',
  }
  emit()
}

export const getSleepTimerState = () => state

export const subscribeSleepTimer = (listener: (nextState: SleepTimerState) => void) => {
  listeners.push(listener)
  listener(state)

  return () => {
    const index = listeners.indexOf(listener)
    if (index >= 0) {
      listeners.splice(index, 1)
    }
  }
}
