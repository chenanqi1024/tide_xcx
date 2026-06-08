Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/sleep/index',
        text: '睡眠',
        iconPath: '/assets/tabbar/sleep.png',
        selectedIconPath: '/assets/tabbar/sleep-active.png',
      },
      {
        pagePath: '/pages/focus/index',
        text: '专注',
        iconPath: '/assets/tabbar/focus.png',
        selectedIconPath: '/assets/tabbar/focus-active.png',
      },
      {
        pagePath: '/pages/breathe/index',
        text: '呼吸',
        iconPath: '/assets/tabbar/breathe.png',
        selectedIconPath: '/assets/tabbar/breathe-active.png',
      },
      {
        pagePath: '/pages/meditate/index',
        text: '冥想',
        iconPath: '/assets/tabbar/meditate.png',
        selectedIconPath: '/assets/tabbar/meditate-active.png',
      },
    ],
  },
  methods: {
    switchTab(event: WechatMiniprogram.BaseEvent) {
      const { path, index } = event.currentTarget.dataset
      this.setData({
        selected: Number(index),
      })
      wx.switchTab({
        url: String(path),
      })
    },
  },
})
