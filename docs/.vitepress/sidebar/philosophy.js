import * as philosophy from '../data/philosophy'

const toItems = (list) =>
  list.map(path => ({
    text: decodeURIComponent(path.split('/').pop()),
    link: path,
  }))

export const sidebarPhilosophy = [
  {
    text: 'Philosophy',
    items: [{ text: 'Home', link: '/philosophy/' }],
  },
  {
    text: 'Logic',
    items: toItems(philosophy.logicList),
  },
  {
    text: 'NI',
    items: toItems(philosophy.niList),
  },
]
