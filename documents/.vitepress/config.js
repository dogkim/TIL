import { defineConfig } from 'vitepress'
import { sidebarComputer } from './sidebar/computer'
import { sidebarPhilosophy } from './sidebar/philosophy'

export default defineConfig({
  lang: 'ko-KR',
  title: 'Today I Learned',
  base: '/TIL/',

  themeConfig: {
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
