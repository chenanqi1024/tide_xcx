Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    icon: {
      type: String,
      value: '',
    },
  },
  data: {
    statusBarHeight: 24,
  },
  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync()
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight || 24,
      })
    },
  },
})
