import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import * as CONST from './const.mjs'

export default defineUserConfig({
  lang: 'ko-KR',
  title: 'Today I Learned',
  base: '/TIL/',
  dest: 'build',

  theme: defaultTheme({
    sidebar: [
      {
        text: 'HTML',
        children: CONST.HTMLList, 
      },
      {
        text: 'CSS',
        children: CONST.CSSList,
      },
      {
        text: 'DataStructure',
        children: CONST.DataStructList,
      }
    ],
  }),
})