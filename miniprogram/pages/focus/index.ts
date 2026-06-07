import { formatDuration } from '../../utils/util'
import { fetchSoundData, playSound, SoundItem, stopSound } from '../../utils/sounds'

interface FocusMode {
  label: string
  focusMinutes: number
  restMinutes: number
}

const modes: FocusMode[] = [
  { label: '25 / 5', focusMinutes: 25, restMinutes: 5 },
  { label: '50 / 10', focusMinutes: 50, restMinutes: 10 },
]

let timer: number | undefined
let targetTime = 0

Page({
  data: {
    modes,
    modeIndex: 0,
    stage: 'focus',
    stageLabel: '专注',
    remainingSeconds: modes[0].focusMinutes * 60,
    remainingText: formatDuration(modes[0].focusMinutes * 60),
    running: false,
    immersive: false,
    loading: true,
    error: false,
    sounds: [] as SoundItem[],
    selectedSoundId: '',
  },

  onLoad() {
    this.loadSounds()
  },

  onShow() {
    if (this.data.running) {
      this.tick()
    }
  },

  onUnload() {
    this.clearTimer()
    this.clearImmersiveHandler()
  },

  loadSounds(force = false) {
    this.setData({
      loading: true,
      error: false,
    })

    fetchSoundData(force)
      .then(data => {
        this.setData({
          loading: false,
          sounds: data.sounds,
          selectedSoundId: this.data.selectedSoundId || data.sounds[0]?.id || '',
        })
      })
      .catch(() => {
        this.setData({
          loading: false,
          error: true,
        })
      })
  },

  retry() {
    this.loadSounds(true)
  },

  selectMode(event: WechatMiniprogram.BaseEvent) {
    if (this.data.running) {
      wx.showToast({
        title: '请先结束当前专注',
        icon: 'none',
      })
      return
    }

    const modeIndex = Number(event.currentTarget.dataset.index)
    const mode = modes[modeIndex]
    const remainingSeconds = mode.focusMinutes * 60
    this.setData({
      modeIndex,
      stage: 'focus',
      stageLabel: '专注',
      remainingSeconds,
      remainingText: formatDuration(remainingSeconds),
    })
  },

  selectSound(event: WechatMiniprogram.BaseEvent) {
    const selectedSoundId = String(event.currentTarget.dataset.id)
    this.setData({ selectedSoundId })

    if (this.data.running && this.data.stage === 'focus') {
      this.playSelectedSound(selectedSoundId)
    }
  },

  toggleImmersive(event: WechatMiniprogram.SwitchChange) {
    const immersive = event.detail.value
    this.setData({ immersive })
    if (this.data.running) {
      this.configureImmersiveHandler(immersive)
    }
  },

  start() {
    if (this.data.running) {
      return
    }

    targetTime = Date.now() + this.data.remainingSeconds * 1000
    this.setData({ running: true })
    this.configureImmersiveHandler(this.data.immersive && this.data.stage === 'focus')

    if (this.data.stage === 'focus') {
      this.playSelectedSound(this.data.selectedSoundId)
    }

    this.clearTimer()
    timer = setInterval(() => this.tick(), 1000)
  },

  pause() {
    if (!this.data.running) {
      return
    }

    this.tick()
    this.setData({ running: false })
    this.clearTimer()
    this.clearImmersiveHandler()
    stopSound('focus')
  },

  end() {
    this.finishSession(false)
  },

  tick() {
    if (!this.data.running) {
      return
    }

    const remainingSeconds = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000))
    this.setData({
      remainingSeconds,
      remainingText: formatDuration(remainingSeconds),
    })

    if (remainingSeconds <= 0) {
      this.switchStage()
    }
  },

  switchStage() {
    const mode = modes[this.data.modeIndex]
    const isNextFocus = this.data.stage !== 'focus'
    const remainingSeconds = (isNextFocus ? mode.focusMinutes : mode.restMinutes) * 60

    this.setData({
      stage: isNextFocus ? 'focus' : 'rest',
      stageLabel: isNextFocus ? '专注' : '休息',
      remainingSeconds,
      remainingText: formatDuration(remainingSeconds),
    })
    targetTime = Date.now() + remainingSeconds * 1000

    if (isNextFocus) {
      this.playSelectedSound(this.data.selectedSoundId)
      this.configureImmersiveHandler(this.data.immersive)
    } else {
      stopSound('focus')
      this.clearImmersiveHandler()
    }

    wx.showToast({
      title: isNextFocus ? '开始下一轮专注' : '做得好，休息一下',
      icon: 'none',
    })
  },

  playSelectedSound(soundId: string) {
    const sound = this.data.sounds.find(item => item.id === soundId)
    if (sound) {
      playSound(sound, 'focus')
    }
  },

  configureImmersiveHandler(enabled: boolean) {
    const app = getApp<IAppOption>()
    app.globalData.immersiveFocusActive = enabled
    app.globalData.onFocusInterrupted = enabled ? () => this.failImmersiveSession() : undefined
  },

  clearImmersiveHandler() {
    const app = getApp<IAppOption>()
    app.globalData.immersiveFocusActive = false
    app.globalData.onFocusInterrupted = undefined
  },

  failImmersiveSession() {
    this.finishSession(true)
    wx.showModal({
      title: '本次专注未完成',
      content: '沉浸模式下离开了小程序，计时与背景音已停止。',
      showCancel: false,
      confirmText: '知道了',
    })
  },

  finishSession(failed: boolean) {
    const mode = modes[this.data.modeIndex]
    const remainingSeconds = mode.focusMinutes * 60
    this.clearTimer()
    this.clearImmersiveHandler()
    stopSound('focus')
    this.setData({
      stage: 'focus',
      stageLabel: '专注',
      remainingSeconds,
      remainingText: formatDuration(remainingSeconds),
      running: false,
    })

    if (!failed) {
      wx.showToast({
        title: '专注已结束',
        icon: 'none',
      })
    }
  },

  clearTimer() {
    if (timer !== undefined) {
      clearInterval(timer)
      timer = undefined
    }
  },

  toggleTimer() {
    if (this.data.running) {
      this.pause()
    } else {
      this.start()
    }
  },
})
