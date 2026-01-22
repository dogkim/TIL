import * as computer from '../data/computer'

const toItems = (list) =>
  list.map(path => ({
    text: decodeURIComponent(path.split('/').pop()),
    link: path,
  }))

export const sidebarComputer = [
  {
    text: 'Computer Engineering',
    items: [{ text: 'Home', link: '/computer/' }],
  },
  {
    text: 'HTML',
    items: toItems(computer.HTMLList),
  },
  {
    text: 'CSS',
    items: toItems(computer.CSSList),
  },
  {
    text: 'DataStructure',
    items: toItems(computer.DataStructList),
  },
]
