import { BreathingPattern, findBreathingPattern } from '../../../utils/breathing'
import { formatDuration } from '../../../utils/util'

let timer: number | undefined

Page({
  data: {
    pattern: undefined as BreathingPattern | undefined,
    phaseIndex: 0,
    phaseLabel: '准备',
    phaseRemaining: 0,
    totalElapsed: 0,
    elapsedText: '00:00',
    running: false,
    started: false,
    ballScale: 0.72,
    transitionSeconds: 0,
  },

  onLoad(options: { id?: string }) {
    const pattern = findBreathingPattern(options.id || '') || findBreathingPattern('box')
    if (!pattern) {
      return
    }
    this.setData({
      pattern,
      phaseLabel: pattern.phases[0].label,
      phaseRemaining: pattern.phases[0].seconds,
    })
  },

  onUnload() {
    this.clearTimer()
  },

  toggleTraining() {
    if (this.data.running) {
      this.pause()
    } else {
      this.start()
    }
  },

  start() {
    const pattern = this.data.pattern
    if (!pattern || this.data.running) {
      return
    }

    this.setData({
      running: true,
      started: true,
    }, () => this.applyPhaseMotion())

    this.clearTimer()
    timer = setInterval(() => this.tick(), 1000)
  },

  pause() {
    this.setData({
      running: false,
      transitionSeconds: 0,
    })
    this.clearTimer()
  },

  tick() {
    const pattern = this.data.pattern
    if (!pattern || !this.data.running) {
      return
    }

    const totalElapsed = this.data.totalElapsed + 1
    const phaseRemaining = this.data.phaseRemaining - 1

    if (phaseRemaining <= 0) {
      const phaseIndex = (this.data.phaseIndex + 1) % pattern.phases.length
      const phase = pattern.phases[phaseIndex]
      this.setData({
        phaseIndex,
        phaseLabel: phase.label,
        phaseRemaining: phase.seconds,
        totalElapsed,
        elapsedText: formatDuration(totalElapsed),
      }, () => this.applyPhaseMotion())
      return
    }

    this.setData({
      phaseRemaining,
      totalElapsed,
      elapsedText: formatDuration(totalElapsed),
    })
  },

  applyPhaseMotion() {
    const pattern = this.data.pattern
    if (!pattern) {
      return
    }
    const phase = pattern.phases[this.data.phaseIndex]
    let ballScale = this.data.ballScale

    if (phase.motion === 'grow') {
      ballScale = 1
    }
    if (phase.motion === 'shrink') {
      ballScale = 0.66
    }

    this.setData({
      ballScale,
      transitionSeconds: phase.motion === 'hold' ? 0 : this.data.phaseRemaining,
    })
  },

  endTraining() {
    this.clearTimer()
    wx.navigateBack()
  },

  clearTimer() {
    if (timer !== undefined) {
      clearInterval(timer)
      timer = undefined
    }
  },
})
