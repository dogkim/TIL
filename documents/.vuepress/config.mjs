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
         link: '/computer/',
        activeMatch: '^/computer/'
      },
      { text: 'Philosophy',
         link: '/philosophy/',
        activeMatch: '^/philosophy/'
      },
    ],

    sidebar: {
      '/': sidebarComputer,
      '/computer': sidebarComputer,
      '/philosophy': sidebarPhilosophy,
    },
  }),
})