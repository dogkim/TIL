//컴퓨터 탭의 사이드바 목록

import * as computer from '../data/computer'

const toItems = (list) =>
  list.map(path => ({
    text: decodeURIComponent(path.split('/').pop()),
    link: path,
  }))

export const sidebarComputer = [
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
