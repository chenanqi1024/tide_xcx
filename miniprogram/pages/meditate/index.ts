import { meditations } from '../../utils/meditations'

Page({
  data: {
    meditations,
  },

  openDetail(event: WechatMiniprogram.BaseEvent) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/meditate/detail/index?id=${encodeURIComponent(id)}`,
    })
  },
})
