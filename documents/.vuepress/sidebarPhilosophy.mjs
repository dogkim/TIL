//철학 탭의 사이드바 목록

import * as CONST from './constPhilosophy.mjs'

const philosophyMenu = [
  {
  text: 'Home',
  link: '/philosophy/',
  },
  {
    text: 'Logic',
    children: CONST.logicList,
  }
]

export const sidebarPhilosophy = philosophyMenu.map(item => ({
  ...item,           // 기존의 데이터를 가져오기
  collapsible: item.text !== 'Philosophy Home'
}))