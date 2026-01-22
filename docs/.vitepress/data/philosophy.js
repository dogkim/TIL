// 철학 관련 글 목록

const addPath = (subFolder, files) =>
  files.map(file => `/philosophy/${subFolder}/${file.replace(/\.md$/, '')}`)

export const logicList = addPath('logic', [
  '01-basic.md',
])

export const niList = addPath('ni', [
])
