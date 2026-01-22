// 컴퓨터 관련 글 목록 

const addPath = (subFolder, files) => files.map(file => `/computer/${subFolder}/${file}`);


export const HTMLList = addPath('HTML', [
  //  기존 이름 : "/computer/HTML/01-basics-structure.md"
  "01-basics-structure.md",
  "02-tags.md"
]);

export const CSSList = addPath('CSS', [
  "1. CSS 문법 살펴보기.md"
]);

export const DataStructList = addPath('DataStructure', [
  "1. Performance Anlysis.md",
  "2. Arrays.md"
]);