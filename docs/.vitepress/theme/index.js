import DefaultTheme from 'vitepress/theme'
import Snow from './components/Atmosphere.vue'
import Home from './components/Home.vue'
import { h } from 'vue'
import { useData } from 'vitepress'
import './custom.css'
import './home.css'

export default {
  extends: DefaultTheme,
  // Layout을 확장하여 전역적으로 Snow 컴포넌트를 삽입합니다.
  Layout() {
    const { page } = useData()
    if (page.value.relativePath === 'index.md') {
      return h(Home)
    }
    return h(DefaultTheme.Layout, null, {
      // 'layout-bottom' 슬롯을 사용하여 모든 페이지 최하단에 Snow를 배치합니다.
      // Snow.vue 내부에 "메인화면일 때만 실행"하는 로직이 이미 있으므로 안전합니다.
      'layout-bottom': () => h(Snow)
    })
  },
  enhanceApp({ app }) {
    app.component('Snow', Snow)
  }
}