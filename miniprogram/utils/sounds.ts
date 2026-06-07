export interface SoundItem {
  id: string
  name: string
  url: string
  cover: string
}

export interface SoundData {
  alarm: SoundItem
  sounds: SoundItem[]
}

export type AudioSource = 'sleep' | 'focus' | 'alarm'

interface AudioState {
  isPlaying: boolean
  soundId: string
  source?: AudioSource
}

const SOUNDS_API = 'https://zzz-pet.oss-cn-hangzhou.aliyuncs.com/api/sounds.json'
const audio = wx.createInnerAudioContext()
const audioListeners: Array<(state: AudioState) => void> = []

let cachedSoundData: SoundData | undefined
let pendingRequest: Promise<SoundData> | undefined
let currentSound: SoundItem | undefined
let currentSource: AudioSource | undefined
let isPlaying = false

audio.loop = true
audio.obeyMuteSwitch = false

const emitAudioState = () => {
  const state = getAudioState()
  audioListeners.forEach(listener => listener(state))
}

audio.onPlay(() => {
  isPlaying = true
  emitAudioState()
})

audio.onPause(() => {
  isPlaying = false
  emitAudioState()
})

audio.onStop(() => {
  isPlaying = false
  emitAudioState()
})

audio.onEnded(() => {
  isPlaying = false
  emitAudioState()
})

audio.onError(() => {
  isPlaying = false
  emitAudioState()
  wx.showToast({
    title: '音频播放失败',
    icon: 'none',
  })
})

const isValidSoundData = (value: SoundData) => {
  return Boolean(
    value &&
    value.alarm &&
    value.alarm.url &&
    Array.isArray(value.sounds)
  )
}

export const fetchSoundData = (force = false): Promise<SoundData> => {
  if (cachedSoundData && !force) {
    return Promise.resolve(cachedSoundData)
  }

  if (pendingRequest && !force) {
    return pendingRequest
  }

  pendingRequest = new Promise((resolve, reject) => {
    wx.request<SoundData>({
      url: `${SOUNDS_API}?t=${Date.now()}`,
      method: 'GET',
      header: {
        'Cache-Control': 'no-cache',
      },
      success: response => {
        if (response.statusCode >= 200 && response.statusCode < 300 && isValidSoundData(response.data)) {
          cachedSoundData = response.data
          resolve(response.data)
          return
        }

        reject(new Error('声音数据格式错误'))
      },
      fail: reject,
      complete: () => {
        pendingRequest = undefined
      },
    })
  })

  return pendingRequest
}

export const getCachedSoundData = () => cachedSoundData

export const findSoundById = (id: string) => {
  return cachedSoundData?.sounds.find(sound => sound.id === id)
}

export const playSound = (sound: SoundItem, source: AudioSource) => {
  const isSameTrack = currentSound?.id === sound.id && currentSource === source

  if (!isSameTrack) {
    audio.stop()
    currentSound = sound
    currentSource = source
    audio.src = sound.url
  }

  audio.play()
}

export const pauseSound = (source?: AudioSource) => {
  if (!source || currentSource === source) {
    audio.pause()
  }
}

export const stopSound = (source?: AudioSource) => {
  if (!source || currentSource === source) {
    audio.stop()
    currentSound = undefined
    currentSource = undefined
    emitAudioState()
  }
}

export const getAudioState = (): AudioState => ({
  isPlaying,
  soundId: currentSound?.id || '',
  source: currentSource,
})

export const subscribeAudioState = (listener: (state: AudioState) => void) => {
  audioListeners.push(listener)
  listener(getAudioState())

  return () => {
    const index = audioListeners.indexOf(listener)
    if (index >= 0) {
      audioListeners.splice(index, 1)
    }
  }
}
