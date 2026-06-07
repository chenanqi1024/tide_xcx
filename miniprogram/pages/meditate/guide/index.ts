import { findMeditation, Meditation } from '../../../utils/meditations'

Page({
  data: {
    meditation: undefined as Meditation | undefined,
    paragraphIndex: 0,
    paragraph: '',
    progressText: '1 / 1',
    progressPercent: 0,
    isFirst: true,
    isLast: false,
  },

  onLoad(options: { id?: string }) {
    const meditation = findMeditation(options.id || '') || findMeditation('sleep')
    if (!meditation) {
      return
    }
    this.setData({ meditation }, () => this.updateParagraph(0))
  },

  previous() {
    this.updateParagraph(this.data.paragraphIndex - 1)
  },

  next() {
    this.updateParagraph(this.data.paragraphIndex + 1)
  },

  updateParagraph(paragraphIndex: number) {
    const meditation = this.data.meditation
    if (!meditation) {
      return
    }
    const safeIndex = Math.max(0, Math.min(paragraphIndex, meditation.paragraphs.length - 1))
    this.setData({
      paragraphIndex: safeIndex,
      paragraph: meditation.paragraphs[safeIndex],
      progressText: `${safeIndex + 1} / ${meditation.paragraphs.length}`,
      progressPercent: ((safeIndex + 1) / meditation.paragraphs.length) * 100,
      isFirst: safeIndex === 0,
      isLast: safeIndex === meditation.paragraphs.length - 1,
    })
  },

  finish() {
    wx.navigateBack()
  },
})
