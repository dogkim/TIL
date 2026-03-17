import { defineConfig } from 'vitepress'
import { sidebarComputer } from './sidebar/computer'
import { sidebarPhilosophy } from './sidebar/philosophy'
import mathjax3 from 'markdown-it-mathjax3'

export default defineConfig({
  lang: 'ko-KR',
  title: 'Today I Learned',
  base: '/TIL/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/TIL/favicon.svg' }]
  ],

  markdown: {
    lineNumbers: true, //코드 박스 줄 표시
    breaks: true, //개행문자 enter변환 <\br>
    config: (md) => {
      md.use(mathjax3)
    }
  },

  themeConfig: {
    logo: {
      light: '/logo-dark.png',
      dark: '/logo-light.png'   
    },
    siteTitle: 'TIL..!',

    nav: [
      {
        text: 'Computer Engineering',
        link: '/computer/',
      },
      {
        text: 'Philosophy',
        link: '/philosophy/',
      },
    ],

    sidebar: {
      '/computer/': sidebarComputer,
      '/philosophy/': sidebarPhilosophy,
    },
  },
})
