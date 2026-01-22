//철학 탭의 사이드바 목록

import * as philosophy from '../data/philosophy'


const toItems = (list) =>
  list.map(path => ({
    text: path.split('/').pop(),
    link: path,
  }))

export const sidebarPhilosophy = [
  {
    text: 'Logic',
    items: toItems(philosophy.logicList),
  },
  {
    text: 'NI',
    items: toItems(philosophy.niList),
  },
]

