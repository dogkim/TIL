  import { defineConfig } from 'vitepress'
  import { sidebarComputer } from './sidebar/computer'
  import { sidebarPhilosophy } from './sidebar/philosophy'

  export default defineConfig({
    lang: 'ko-KR',
    title: 'Today I Learned',
    base: '/TIL/',

    head: [
      [
        'link', 
        { 
          rel: 'icon', 
          type: 'image/svg+xml', 
          href: 'TIL/favicon.svg' 
        }
      ]
    ],

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
