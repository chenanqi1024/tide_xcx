import { breathingPatterns } from '../../utils/breathing'

Page({
  data: {
    patterns: breathingPatterns,
  },

  onShow() {
    const tabBar = this.getTabBar()
    if (tabBar) {
      tabBar.setData({
        selected: 2,
      })
    }
  },

  openTraining(event: WechatMiniprogram.BaseEvent) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/breathe/training/index?id=${encodeURIComponent(id)}`,
    })
  },
})
