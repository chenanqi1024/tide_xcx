import { findMeditation, Meditation } from '../../../utils/meditations'

Page({
  data: {
    meditation: undefined as Meditation | undefined,
  },

  onLoad(options: { id?: string }) {
    const meditation = findMeditation(options.id || '') || findMeditation('sleep')
    this.setData({ meditation })
  },

  startGuide() {
    const meditation = this.data.meditation
    if (!meditation) {
      return
    }
    wx.navigateTo({
      url: `/pages/meditate/guide/index?id=${encodeURIComponent(meditation.id)}`,
    })
  },
})
