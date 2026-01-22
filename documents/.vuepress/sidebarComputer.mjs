//컴퓨터 탭의 사이드바 목록

import * as CONST from './constComputer.mjs'

const computerMenu = [
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
  ...item,           // 기존의 데이터를 가져오기
  collapsible: true  // 모든 항목에 접기 기능을 추가
}))