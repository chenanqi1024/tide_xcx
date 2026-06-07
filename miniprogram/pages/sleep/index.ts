import { fetchSoundData, SoundItem } from '../../utils/sounds'

Page({
  data: {
    loading: true,
    error: false,
    sounds: [] as SoundItem[],
  },

  onLoad() {
    this.loadSounds()
  },

  onPullDownRefresh() {
    this.loadSounds(true)
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
        })
      })
      .catch(() => {
        this.setData({
          loading: false,
          error: true,
        })
      })
      .finally(() => {
        wx.stopPullDownRefresh()
      })
  },

  retry() {
    this.loadSounds(true)
  },

  openSound(event: WechatMiniprogram.BaseEvent) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/sleep/player/index?id=${encodeURIComponent(id)}`,
    })
  },
})
