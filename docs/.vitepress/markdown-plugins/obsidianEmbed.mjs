// Obsidian 임베드 ![[파일.png]] / ![[파일.png|586]] / ![[파일.png|586x300]] 를 image 토큰으로 변환.
// Obsidian처럼 파일명만으로 vault 어디서든 이미지를 찾는다(같은 폴더 > assets > 경로 접두사가 가장 긴 폴더).
// 이미지가 아닌 임베드(![[노트]])는 일반 [[위키링크]]처럼 링크로 렌더링한다.
import fs from 'node:fs'
import path from 'node:path'

const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'avif'])
const SKIP_DIRS = new Set(['.vitepress', 'node_modules', 'public'])

// docsRoot 아래 모든 비-md 파일을 basename(소문자) 기준으로 색인
function buildIndex(docsRoot) {
  const index = new Map() // basename(lower) -> [절대경로]
  const walk = (dir) => {
    let entries
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name)) walk(full)
      } else if (e.isFile() && !e.name.toLowerCase().endsWith('.md')) {
        const key = e.name.toLowerCase()
        if (!index.has(key)) index.set(key, [])
        index.get(key).push(full)
      }
    }
  }
  walk(docsRoot)
  return index
}

const norm = (p) => path.resolve(p).replace(/\\/g, '/')

// 두 폴더의 공통 디렉터리 접두사 길이(세그먼트 수)
function commonPrefixLen(a, b) {
  const sa = norm(a).split('/')
  const sb = norm(b).split('/')
  let i = 0
  while (i < sa.length && i < sb.length && sa[i].toLowerCase() === sb[i].toLowerCase()) i++
  return i
}

function pickBest(cands, noteDir) {
  if (cands.length <= 1) return cands[0] || null
  const nd = norm(noteDir).toLowerCase()
  const score = (c) => {
    const d = norm(path.dirname(c)).toLowerCase()
    if (d === nd) return Infinity
    if (d === nd + '/assets') return Number.MAX_SAFE_INTEGER
    return commonPrefixLen(path.dirname(c), noteDir)
  }
  return cands.slice().sort((x, y) => score(y) - score(x))[0]
}

export function obsidianEmbedPlugin(md, { docsRoot }) {
  const root = path.resolve(docsRoot)
  const index = buildIndex(root)

  function resolve(target, noteDir) {
    const t = target.replace(/\\/g, '/')
    const base = t.split('/').pop().toLowerCase()
    const cands = index.get(base) || []
    if (!cands.length) return null

    if (t.includes('/')) {
      // 노트 폴더 기준 상대 경로 우선
      const rel = norm(path.resolve(noteDir, t)).toLowerCase()
      const hit = cands.find((c) => norm(c).toLowerCase() === rel)
      if (hit) return hit
      // 경로 접미사 일치
      const suffix = '/' + t.replace(/^\/+/, '').toLowerCase()
      const matched = cands.filter((c) => norm(c).toLowerCase().endsWith(suffix))
      return pickBest(matched, noteDir)
    }
    return pickBest(cands, noteDir)
  }

  md.inline.ruler.before('image', 'obsidian_embed', function obsidianEmbed(state, silent) {
    const src = state.src
    const start = state.pos

    if (src.charCodeAt(start) !== 0x21 /* ! */) return false
    if (src.charCodeAt(start + 1) !== 0x5b || src.charCodeAt(start + 2) !== 0x5b) return false

    const end = src.indexOf(']]', start + 3)
    if (end === -1) return false

    const inner = src.slice(start + 3, end)
    if (!inner.trim() || inner.includes('\n')) return false

    const bar = inner.search(/(?<!\\)\|/)
    const target = (bar === -1 ? inner : inner.slice(0, bar)).trim().replace(/\\\|/g, '|')
    const extra = (bar === -1 ? '' : inner.slice(bar + 1)).trim().replace(/\\\|/g, '|')
    if (!target) return false

    const ext = path.extname(target).slice(1).toLowerCase()
    const isImage = IMAGE_EXTS.has(ext)

    // 현재 노트의 절대 경로
    const env = state.env || {}
    const notePath = env.relativePath ? path.join(root, env.relativePath) : env.path || ''
    const noteDir = notePath ? path.dirname(notePath) : root

    if (!isImage) {
      // 노트 임베드: 위키링크와 동일하게 링크로 처리
      if (silent) return true
      const href = target.endsWith('.md') ? target : `${target}.md`
      const open = state.push('link_open', 'a', 1)
      open.attrs = [['href', href]]
      open.markup = 'wikilink'
      state.push('text', '', 0).content = extra || target
      state.push('link_close', 'a', -1)
      state.pos = end + 2
      return true
    }

    const file = resolve(target, noteDir)
    if (!file) {
      if (!silent) console.warn(`[obsidianEmbed] 이미지를 찾을 수 없음: ${notePath || '(unknown note)'} -> ![[${target}]]`)
      return false
    }
    if (silent) return true

    // 노트 폴더 기준 상대 경로 (./ 또는 ../ 로 시작)
    let rel = path.relative(noteDir, file).replace(/\\/g, '/')
    if (!rel.startsWith('.')) rel = './' + rel
    const url = state.md.normalizeLink(rel)

    // | 뒤 텍스트 해석: 숫자 / 숫자x숫자 는 크기, 그 외는 alt
    let alt = path.basename(target, path.extname(target))
    let width = null
    let height = null
    const m = /^(\d+)(?:x(\d+))?$/i.exec(extra)
    if (m) {
      width = m[1]
      height = m[2] || null
    } else if (extra) {
      alt = extra
    }

    const token = state.push('image', 'img', 0)
    token.attrs = [['src', url], ['alt', '']]
    if (width) token.attrs.push(['width', width])
    if (height) token.attrs.push(['height', height])
    token.children = []
    const text = new state.Token('text', '', 0)
    text.content = alt
    token.children.push(text)
    token.content = alt

    state.pos = end + 2
    return true
  })
}
