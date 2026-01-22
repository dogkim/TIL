import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { sidebarComputer } from './sidebarComputer.mjs'
import { sidebarPhilosophy } from './sidebarPhilosophy.mjs'

export default defineUserConfig({
  lang: 'ko-KR',
  title: 'Today I Learned',
  base: '/TIL/',
  dest: 'build',

  theme: defaultTheme({
    sidebarDepth: 1,

    navbar: [
      { text: 'Computer Engineering',
        link: '/computer-entry.html',
        activeMatch: '^/computer/'
      },
      { text: 'Philosophy',
        link: '/philosophy-entry.html',
        activeMatch: '^/philosophy/'
      },
    ],

    sidebar: {
      '/computer/': sidebarComputer,
      '/philosophy/': sidebarPhilosophy,
    },
  }),
})