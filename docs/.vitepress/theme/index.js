import DefaultTheme from 'vitepress/theme'
import AppShell from './components/AppShell.vue'
import SidebarNode from './components/SidebarNode.vue'
import { h } from 'vue'
import './custom.css'
import './home.css'

export default {
  extends: DefaultTheme,
  // 모든 페이지를 AppShell(헤더+사이드바)로 감싸서, 홈이든 개별 문서든 같은 틀 안에서
  // 내용만 바뀌는 것처럼 보이게 합니다 (VitePress 기본 테마의 Layout은 더 이상 쓰지 않음).
  Layout() {
    return h(AppShell)
  },
  enhanceApp({ app }) {
    app.component('SidebarNode', SidebarNode)
  }
}