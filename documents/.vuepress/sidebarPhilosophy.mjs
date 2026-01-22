//철학 탭의 사이드바 목록

import * as CONST from './constPhilosophy.mjs'



const philosophyMenu = [
  {
    text: 'Logic',
    children: CONST.logicList,
  }
]

export const sidebarPhilosophy = philosophyMenu.map(item => ({
  ...item,           // 기존의 데이터를 가져오기
  collapsible: true  // 모든 항목에 접기 기능을 추가
}))