//철학 탭의 사이드바 목록
import * as philosophy from '../../data/computer'


const toItems = (list) =>
  list.map(path => ({
    text: path.split('/').pop(),
    link: path,
  }))

export const sidebarPhilosophy = [
  {
    text: 'Logic',
    items: toItems(logicList),
  },
  {
    text: 'NI',
    items: toItems(niList),
  },
]

