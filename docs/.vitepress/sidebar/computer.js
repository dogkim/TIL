import * as computer from '../data/computer'

const toItems = (list) =>
  list.map(path => ({
    text: decodeURIComponent(path.split('/').pop()),
    link: path,
  }))

export const sidebarComputer = [
  {
    text: 'Computer Engineering',
    items: [{ text: 'Home', link: '/computer/' }],
  },
  {
    text: 'HTML',
    items: toItems(computer.HTMLList),
  },
  {
    text: 'CSS',
    items: toItems(computer.CSSList),
  },
  {
    text: 'DataStructure',
    items: toItems(computer.DataStructList),
  },
  {
    text: 'Java',
    items: toItems(computer.JavaList),
  },
    {
    text: 'Automata',
    items: toItems(computer.AutomataList),
  },
  {
    text: 'Algorithm',
    items: toItems(computer.AlgorithmList),
  }

]
