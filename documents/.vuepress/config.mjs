import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
// 분리한 파일에서 목록들을 불러옵니다.
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