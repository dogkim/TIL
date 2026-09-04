import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { buildHomeData } from './sidebar/homeData'
import mathjax3 from 'markdown-it-mathjax3'

const docsRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

export default defineConfig({
  lang: 'ko-KR',
  title: 'Today I Learned',
  base: '/TIL/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/TIL/favicon.svg' }],
  ],

  markdown: {
    lineNumbers: true, //코드 박스 줄 표시
    breaks: true, //개행문자 enter변환 <\br>
    config: (md) => {
      md.use(mathjax3)
    }
  },

  themeConfig: {
    // 커스텀 AppShell(헤더+사이드바)이 모든 페이지를 감싸므로,
    // VitePress 기본 테마의 nav/sidebar/logo 설정은 더 이상 쓰지 않음.
    homeData: buildHomeData(docsRoot),
  },
})
