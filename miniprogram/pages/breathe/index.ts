import { breathingPatterns } from '../../utils/breathing'

Page({
  data: {
    patterns: breathingPatterns,
  },

  openTraining(event: WechatMiniprogram.BaseEvent) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/breathe/training/index?id=${encodeURIComponent(id)}`,
    })
  },
})
