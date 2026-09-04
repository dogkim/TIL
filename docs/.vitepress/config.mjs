import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { autoSidebar } from './sidebar/autoGenerate'
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
      '/computer/': autoSidebar(docsRoot, 'computer', 'Computer Engineering'),
      '/philosophy/': autoSidebar(docsRoot, 'philosophy', 'Philosophy'),
    },
  },
})
