const addPath = (subFolder, files) =>
  files.map(file =>
    `/computer/${subFolder}/${file.replace(/\.md$/, '')}`
  )

export const HOME = ['/computer/']

export const HTMLList = addPath('HTML', [
  '01-basic-structure.md',
  '02-tags.md',
])

export const CSSList = addPath('CSS', [
  '01-CSS-Basics.md',
  'text.md'
])

export const DataStructList = addPath('DataStructure', [
  '01-Performance-Analysis.md',
  '02-Arrays-Polynomial-FastTranspose.md',
  '03-Stacks-and-Queues.md',
  '05-Trees.md'
])

export const JavaList = addPath('DataStructure', [

])

export const AutomataList = addPath('Automata', [
  '01-Central-Concepts-of-Automata-Theory.md',
  '02-DFA(Deterministic-Finite-Automata).md',
  '03-NFA(Nondeterministic-Finite-Automata).md',
  '04-Regular-Expression.md'
])