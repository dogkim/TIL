import fs from 'node:fs'
import path from 'node:path'

const isHidden = (name) => name === 'assets' || name.startsWith('_') || name === 'index.md'

const titleFromFilename = (name) =>
  name.replace(/\.md$/, '').replace(/^\d+[-.\s]*/, '')

function listEntries(dirAbs, excludeDirs = []) {
  if (!fs.existsSync(dirAbs)) return []
  return fs.readdirSync(dirAbs, { withFileTypes: true })
    .filter(e => !isHidden(e.name))
    .filter(e => !(e.isDirectory() && excludeDirs.includes(e.name)))
}

// 폴더 안에서 (번호순으로) 가장 먼저 오는 문서 하나를 찾아 그 폴더의 진입점으로 사용
function firstDocIn(dirAbs, urlPrefix) {
  const entries = listEntries(dirAbs).sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
  for (const e of entries) {
    if (e.isDirectory()) {
      const nested = firstDocIn(path.join(dirAbs, e.name), `${urlPrefix}/${e.name}`)
      if (nested) return nested
    } else if (e.name.endsWith('.md')) {
      return `${urlPrefix}/${e.name.replace(/\.md$/, '')}`
    }
  }
  return null
}

// group의 바로 아래 항목만 (프로젝트 카드 등에서 사용) — 폴더면 폴더 안 첫 문서로, 파일이면 그 파일로 링크
function topLevelItems(dirAbs, urlPrefix, excludeDirs = []) {
  return listEntries(dirAbs, excludeDirs).map(e => {
    if (e.isDirectory()) {
      const link = firstDocIn(path.join(dirAbs, e.name), `${urlPrefix}/${e.name}`)
      return { title: e.name, link: link ?? `${urlPrefix}/${e.name}/` }
    }
    return { title: titleFromFilename(e.name), link: `${urlPrefix}/${e.name.replace(/\.md$/, '')}` }
  })
}

// 사이드바 전체 트리(재귀) — 폴더는 children을 갖고, 자기 자신도 폴더 안 첫 문서로 링크됨
function buildTree(dirAbs, urlPrefix, excludeDirs = []) {
  return listEntries(dirAbs, excludeDirs)
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
    .map(e => {
      if (e.isDirectory()) {
        const childDir = path.join(dirAbs, e.name)
        const childPrefix = `${urlPrefix}/${e.name}`
        const children = buildTree(childDir, childPrefix)
        const link = firstDocIn(childDir, childPrefix)
        return { title: e.name, link, children }
      }
      return { title: titleFromFilename(e.name), link: `${urlPrefix}/${e.name.replace(/\.md$/, '')}` }
    })
}

// 재귀적으로 모든 .md 문서를 수집 (검색 팔레트 / 최근 노트 / 개수 집계용)
function collectDocs(dirAbs, urlPrefix, group, excludeDirs = [], acc = []) {
  for (const e of listEntries(dirAbs, excludeDirs)) {
    const full = path.join(dirAbs, e.name)
    if (e.isDirectory()) {
      collectDocs(full, `${urlPrefix}/${e.name}`, group, [], acc)
    } else if (e.name.endsWith('.md')) {
      const stat = fs.statSync(full)
      acc.push({
        title: titleFromFilename(e.name),
        link: `${urlPrefix}/${e.name.replace(/\.md$/, '')}`,
        group,
        mtimeMs: stat.mtimeMs,
      })
    }
  }
  return acc
}

export function buildHomeData(docsRoot) {
    const computerDir = path.join(docsRoot, 'computer')
    const projectDir = path.join(computerDir, 'project')
    const philosophyDir = path.join(docsRoot, 'philosophy')
    const recordDirs = [
      { name: 'TOEIC', abs: path.join(docsRoot, 'TOEIC'), url: '/TOEIC' },
      { name: 'Certifications', abs: path.join(docsRoot, 'Certifications'), url: '/Certifications' },
      { name: 'External-Activities', abs: path.join(docsRoot, 'External-Activities'), url: '/External-Activities' },
      { name: 'club', abs: path.join(docsRoot, 'club'), url: '/club' },
    ]

    const groups = [
      {
        key: 'projects',
        label: 'Projects',
        items: buildTree(projectDir, '/computer/project'),
        docs: collectDocs(projectDir, '/computer/project', 'Projects'),
      },
      {
        key: 'cs',
        label: 'Computer Science',
        items: buildTree(computerDir, '/computer', ['project']),
        docs: collectDocs(computerDir, '/computer', 'Computer Science', ['project']),
      },
      {
        key: 'philosophy',
        label: 'Philosophy',
        items: buildTree(philosophyDir, '/philosophy'),
        docs: collectDocs(philosophyDir, '/philosophy', 'Philosophy'),
      },
      {
        key: 'records',
        label: 'Records',
        items: recordDirs.map(r => ({
          title: r.name,
          link: firstDocIn(r.abs, r.url) ?? `${r.url}/`,
          children: buildTree(r.abs, r.url),
        })),
        docs: recordDirs.flatMap(r => collectDocs(r.abs, r.url, 'Records')),
      },
    ].map(g => ({
      key: g.key,
      label: g.label,
      count: g.docs.length,
      items: g.items,
    }))

    const everyDoc = [
      ...collectDocs(projectDir, '/computer/project', 'Projects'),
      ...collectDocs(computerDir, '/computer', 'Computer Science', ['project']),
      ...collectDocs(philosophyDir, '/philosophy', 'Philosophy'),
      ...recordDirs.flatMap(r => collectDocs(r.abs, r.url, 'Records')),
    ]

    const recentNotes = [...everyDoc]
      .sort((a, b) => b.mtimeMs - a.mtimeMs)
      .slice(0, 6)
      .map(d => ({
        title: d.title,
        link: d.link,
        group: d.group,
        date: new Date(d.mtimeMs).toISOString().slice(0, 10),
      }))

    const lastUpdatedMs = everyDoc.reduce((max, d) => Math.max(max, d.mtimeMs), 0)

    const projectCount = topLevelItems(projectDir, '/computer/project').length

    return {
      groups,
      searchIndex: everyDoc.map(d => ({ title: d.title, link: d.link, group: d.group })),
      recentNotes,
      stats: {
        noteCount: everyDoc.length,
        projectCount,
        lastUpdated: lastUpdatedMs ? new Date(lastUpdatedMs).toISOString().slice(0, 10) : '-',
      },
    }
}
