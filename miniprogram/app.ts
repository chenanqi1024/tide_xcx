App<IAppOption>({
  globalData: {
    immersiveFocusActive: false,
  },
  onLaunch() {
    wx.setInnerAudioOption({
      mixWithOther: false,
      obeyMuteSwitch: false,
    })
  },
  onHide() {
    if (this.globalData.immersiveFocusActive) {
      this.globalData.onFocusInterrupted?.()
    }
  },
})
