const addPath = (subFolder, files) =>
  files.map(file =>
    `/philosophy/${subFolder}/${file.replace(/\.md$/, '')}`
  )

export const HOME = ['/philosophy/']

export const PhenomenologyList = addPath('Phenomenology', [
  '01-Introduction.md',
])
