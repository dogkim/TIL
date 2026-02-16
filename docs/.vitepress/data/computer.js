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
  '01-Performance-Anlysis.md',
  '02-Arrays-and-Structures.md',
  '03-Stacks-and-Queues.md',
  '05-Trees.md'
])
