//컴퓨터 탭의 사이드바 목록

import * as CONST from './constComputer.mjs'

const computerMenu = [
  {
    // 1. 카테고리 전체를 아우르는 그룹을 만듭니다.
    text: 'Computer Engineering Home',
    collapsible: false, // 홈은 항상 보이게
    children: [
      '/computer/README.md',
    ],
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
