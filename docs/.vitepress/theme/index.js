import DefaultTheme from 'vitepress/theme'
// 1. 컴포넌트 가져오기 (경로가 훨씬 깔끔해집니다)
import Snow from './components/Snow.vue' 

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 2. 'Snow'라는 이름으로 전역 등록
    app.component('Snow', Snow)
  }
}