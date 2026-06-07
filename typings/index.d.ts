/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    immersiveFocusActive: boolean,
    onFocusInterrupted?: () => void,
  }
}
