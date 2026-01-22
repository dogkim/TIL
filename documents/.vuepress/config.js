var CONST = require("./const");

module.exports = {
  title: `Today I Learned`,
  description: `(Today I Learned)`,
  base: "/TIL/",
  dest: 'build',
  head: [
    ['link', {
      rel: 'icon',
      href: '/logo.png'
    }]
  ],
  themeConfig: {
    sidebar: [
      {
        title: 'HTML',
        children: CONST.HTMLList
      },
      {
        title: 'Books',
        children: CONST.BooksList
      },
      {
        title: 'DataStructure',
        children: CONST.DataStructList
      }
    ],
    // nav: [{
    //     text: 'GitHub',
    //     link: 'https://github.com/milooy/'
    //   }, {
    //     text: 'Blog',
    //     link: 'https://milooy.wordpress.com/'
    //   }
    // ]
  },
}