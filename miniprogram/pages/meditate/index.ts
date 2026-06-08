import { meditations } from '../../utils/meditations'

Page({
  data: {
    meditations,
  },

  onShow() {
    const tabBar = this.getTabBar()
    if (tabBar) {
      tabBar.setData({
        selected: 3,
      })
    }
  },

  openDetail(event: WechatMiniprogram.BaseEvent) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/meditate/detail/index?id=${encodeURIComponent(id)}`,
    })
  },
})
