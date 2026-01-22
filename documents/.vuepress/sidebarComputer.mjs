//컴퓨터 탭의 사이드바 목록

import * as CONST from './constComputer.mjs'

const computerMenu = [
  {
  text: 'Home',
  link: '/computer/',
  },
  {
    text: 'HTML',
    children: CONST.HTMLList,
  },
  {
    text: 'CSS',
    children: CONST.CSSList,
  },
  {
    text: 'DataStructure',
    children: CONST.DataStructList,
  }
]

export const sidebarComputer = computerMenu.map(item => ({
  ...item,
  collapsible: item.text !== 'Computer Engineering Home' 
}))
