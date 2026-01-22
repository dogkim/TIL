// 철학 관련 글 목록 

const addPath = (subFolder, files) => files.map(file => `/philosophy/${subFolder}/${file}`);

export const logicList = addPath('logic', [
  "01-basics.md",
]);

export const niList = addPath('ni', [
]);