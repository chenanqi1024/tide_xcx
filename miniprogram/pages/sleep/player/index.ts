import {
  fetchSoundData,
  getAudioState,
  pauseSound,
  playSound,
  SoundItem,
  subscribeAudioState,
} from '../../../utils/sounds'
import {
  cancelSleepTimer,
  getSleepTimerState,
  startSleepTimer,
  subscribeSleepTimer,
} from '../../../utils/sleep-timer'

let unsubscribeAudio: (() => void) | undefined
let unsubscribeTimer: (() => void) | undefined

Page({
  data: {
    loading: true,
    error: false,
    soundId: '',
    sound: undefined as SoundItem | undefined,
    alarm: undefined as SoundItem | undefined,
    isPlaying: false,
    wakeTime: '',
    timerStatus: 'idle',
    remainingText: '未设置',
  },

  onLoad(options: { id?: string }) {
    const id = options.id || ''
    this.setData({ soundId: id })
    this.loadSound(id)

    unsubscribeAudio = subscribeAudioState(audioState => {
      const sound = this.data.sound
      this.setData({
        isPlaying: Boolean(
          sound &&
          audioState.source === 'sleep' &&
          audioState.soundId === sound.id &&
          audioState.isPlaying
        ),
      })
    })

    unsubscribeTimer = subscribeSleepTimer(timerState => {
      this.setData({
        timerStatus: timerState.status,
        remainingText: timerState.remainingText,
      })
    })
  },

  onUnload() {
    unsubscribeAudio?.()
    unsubscribeTimer?.()
  },

  loadSound(id: string) {
    this.setData({
      loading: true,
      error: false,
    })

    fetchSoundData()
      .then(data => {
        const sound = data.sounds.find(item => item.id === id)
        if (!sound) {
          throw new Error('未找到声音')
        }
        const audioState = getAudioState()
        this.setData({
          loading: false,
          sound,
          alarm: data.alarm,
          isPlaying: audioState.source === 'sleep' && audioState.soundId === sound.id && audioState.isPlaying,
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
    this.loadSound(this.data.soundId)
  },

  togglePlay() {
    const sound = this.data.sound
    if (!sound) {
      return
    }

    if (this.data.isPlaying) {
      pauseSound('sleep')
    } else {
      playSound(sound, 'sleep')
    }
  },

  chooseWakeTime(event: WechatMiniprogram.PickerChange) {
    const wakeTime = String(event.detail.value)
    const alarm = this.data.alarm
    if (!alarm) {
      return
    }

    const [hours, minutes] = wakeTime.split(':').map(Number)
    const target = new Date()
    target.setHours(hours, minutes, 0, 0)
    if (target.getTime() <= Date.now()) {
      target.setDate(target.getDate() + 1)
    }

    this.setData({ wakeTime })
    startSleepTimer(target.getTime(), alarm)
    wx.showToast({
      title: '睡眠定时已开始',
      icon: 'none',
    })
  },

  cancelTimer() {
    cancelSleepTimer()
    this.setData({
      wakeTime: '',
      timerStatus: getSleepTimerState().status,
    })
  },
})
