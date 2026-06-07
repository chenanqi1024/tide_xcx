export interface BreathingPhase {
  label: '吸气' | '屏息' | '呼气'
  seconds: number
  motion: 'grow' | 'hold' | 'shrink'
}

export interface BreathingPattern {
  id: string
  title: string
  rhythm: string
  scenario: string
  phases: BreathingPhase[]
}

export const breathingPatterns: BreathingPattern[] = [
  {
    id: 'box',
    title: '方形呼吸',
    rhythm: '4 - 4 - 4 - 4',
    scenario: '适合紧张、焦虑，帮助快速冷静并稳住情绪。',
    phases: [
      { label: '吸气', seconds: 4, motion: 'grow' },
      { label: '屏息', seconds: 4, motion: 'hold' },
      { label: '呼气', seconds: 4, motion: 'shrink' },
      { label: '屏息', seconds: 4, motion: 'hold' },
    ],
  },
  {
    id: 'sleep',
    title: '睡前呼吸',
    rhythm: '4 - 7 - 8',
    scenario: '适合睡前放松，让身体逐渐进入休息状态。',
    phases: [
      { label: '吸气', seconds: 4, motion: 'grow' },
      { label: '屏息', seconds: 7, motion: 'hold' },
      { label: '呼气', seconds: 8, motion: 'shrink' },
    ],
  },
  {
    id: 'balance',
    title: '平衡呼吸',
    rhythm: '5 - 5',
    scenario: '适合日常减压，随时恢复平静与专注。',
    phases: [
      { label: '吸气', seconds: 5, motion: 'grow' },
      { label: '呼气', seconds: 5, motion: 'shrink' },
    ],
  },
]

export const findBreathingPattern = (id: string) => {
  return breathingPatterns.find(pattern => pattern.id === id)
}
