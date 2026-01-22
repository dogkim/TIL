// 컴퓨터 관련 글 목록

const addPath = (subFolder, files) =>
  files.map(file =>
    `/computer/${subFolder}/${file.replace(/\.md$/, '')}`
  )

export const HTMLList = addPath('HTML', [
  '01-basic-structure.md',
  '02-tags.md',
])

export const CSSList = addPath('CSS', [
  '1. CSS 문법 살펴보기.md',
])

export const DataStructList = addPath('DataStructure', [
  '01-Performance-Anlysis.md',
  '02-Arrays.md',
])

