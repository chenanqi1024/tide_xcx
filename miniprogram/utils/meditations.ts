export interface Meditation {
  id: string
  title: string
  description: string
  duration: string
  paragraphs: string[]
}

export const meditations: Meditation[] = [
  {
    id: 'sleep',
    title: '快速入眠',
    description: '放下今天的思绪，让身体逐渐松软下来。',
    duration: '约 5 分钟',
    paragraphs: [
      '找一个舒服的姿势躺好，轻轻闭上眼睛。',
      '把注意力放在呼吸上，不需要刻意改变它。',
      '感受肩膀慢慢下沉，放松下巴和眉心。',
      '每次呼气，都允许今天的事情离你远一点。',
      '现在什么都不需要完成，只需要安心休息。',
    ],
  },
  {
    id: 'exam',
    title: '考试压力',
    description: '从紧绷中腾出一点空间，找回稳定和清晰。',
    duration: '约 4 分钟',
    paragraphs: [
      '把双脚平稳地放在地面，感受地面对你的支撑。',
      '慢慢吸气，再比吸气更缓慢地呼出去。',
      '注意身体里紧张的位置，不批评它，也不赶走它。',
      '告诉自己：我只需要完成眼前这一小步。',
      '带着平稳的呼吸，重新回到正在准备的事情。',
    ],
  },
  {
    id: 'breath',
    title: '呼吸练习',
    description: '用几轮有意识的呼吸，重新连接此刻。',
    duration: '约 3 分钟',
    paragraphs: [
      '坐直但不僵硬，让手自然放在腿上。',
      '吸气时，感受空气经过鼻尖进入身体。',
      '呼气时，感受胸腔和腹部自然回落。',
      '走神很正常，发现后温柔地回到呼吸。',
      '再完成三次缓慢呼吸，然后睁开眼睛。',
    ],
  },
  {
    id: 'body',
    title: '身体扫描',
    description: '依次觉察身体各处，释放不易察觉的疲惫。',
    duration: '约 6 分钟',
    paragraphs: [
      '闭上眼睛，把注意力带到双脚。',
      '依次感受小腿、膝盖和大腿，允许它们放松。',
      '觉察腹部和胸口随着呼吸轻轻起伏。',
      '放松双手、手臂、肩膀和脖颈。',
      '最后感受整个身体，安静地停留片刻。',
    ],
  },
]

export const findMeditation = (id: string) => {
  return meditations.find(item => item.id === id)
}
