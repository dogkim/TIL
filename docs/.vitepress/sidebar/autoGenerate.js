import fs from 'node:fs'
import path from 'node:path'

// 사이드바에서 제외할 파일/폴더
const EXCLUDE = new Set(['assets', 'index.md', '_History.md'])

// "01-Title-Case.md" / "01 한글 제목.md" 형태의 앞자리 숫자를 기준으로 정렬,
// 숫자 접두어가 없는 항목은 뒤로 보냄
const sortKey = (name) => {
  const m = name.match(/^(\d+)/)
  return m ? parseInt(m[1], 10) : Infinity
}

const titleFromFilename = (name) =>
  decodeURIComponent(name)
    .replace(/\.md$/, '')
    .replace(/^\d+[-.\s]*/, '') // 앞자리 번호 제거 ("01-" / "01 " / "01.")

// dirAbsPath: 실제 파일시스템 경로, urlPrefix: 사이트에서의 경로 (예: '/computer/Java')
function walk(dirAbsPath, urlPrefix) {
  if (!fs.existsSync(dirAbsPath)) return []

  const entries = fs.readdirSync(dirAbsPath, { withFileTypes: true })
    .filter(e => !EXCLUDE.has(e.name))
    .sort((a, b) => sortKey(a.name) - sortKey(b.name))

  const items = []
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const children = walk(
        path.join(dirAbsPath, entry.name),
        `${urlPrefix}/${entry.name}`
      )
      if (children.length > 0) {
        items.push({
          text: entry.name,
          collapsed: true,
          items: children,
        })
      }
    } else if (entry.name.endsWith('.md')) {
      items.push({
        text: titleFromFilename(entry.name),
        link: `${urlPrefix}/${entry.name.replace(/\.md$/, '')}`,
      })
    }
  }
  return items
}

// docsRootAbsPath: docs/ 폴더의 절대경로, folderName: 'computer' | 'philosophy' 등
export function autoSidebar(docsRootAbsPath, folderName, homeText = 'Home') {
  const abs = path.join(docsRootAbsPath, folderName)
  return [
    { text: homeText, items: [{ text: 'Home', link: `/${folderName}/` }] },
    ...walk(abs, `/${folderName}`),
  ]
}
