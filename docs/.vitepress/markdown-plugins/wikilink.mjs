// Obsidian 스타일 위키링크 [[대상]] / [[대상|표시텍스트]] 를 실제 링크로 변환.
// `대상`은 확장자 없는 상대 경로(같은 폴더면 파일명만, 다른 폴더면 ../Folder/파일명)이며,
// 이를 `대상.md`로 바꿔 일반 마크다운 링크 토큰을 만들면, VitePress가 원래 갖고 있는
// 상대경로 .md 링크 처리(클린 URL로 변환, base 경로 적용 등)를 그대로 재사용할 수 있다.
// `![[파일.png]]`(이미지 임베드)는 건드리지 않는다 — `!` 다음의 `[[`는 그대로 두고
// 이 규칙은 `[[`로 시작하는 경우만 처리(앞 글자가 `!`면 스킵).
export function wikiLinkPlugin(md) {
  md.inline.ruler.before('link', 'wikilink', function wikilink(state, silent) {
    const src = state.src
    const start = state.pos

    if (src.charCodeAt(start) !== 0x5b /* [ */) return false
    if (src.charCodeAt(start + 1) !== 0x5b) return false
    if (start > 0 && src.charCodeAt(start - 1) === 0x21 /* ! */) return false // ![[image]]는 제외

    const end = src.indexOf(']]', start + 2)
    if (end === -1) return false

    const inner = src.slice(start + 2, end)
    if (!inner.trim()) return false

    if (silent) return true

    const bar = inner.indexOf('|')
    let target = (bar === -1 ? inner : inner.slice(0, bar)).trim()
    let label = (bar === -1 ? inner : inner.slice(bar + 1)).trim()
    // 일부 노트에서 `\|`로 이스케이프된 표기도 함께 지원
    target = target.replace(/\\\|/g, '|')
    label = label.replace(/\\\|/g, '|') || target

    const href = target.endsWith('.md') ? target : `${target}.md`

    const openToken = state.push('link_open', 'a', 1)
    openToken.attrs = [['href', href]]
    openToken.markup = 'wikilink'

    const textToken = state.push('text', '', 0)
    textToken.content = label

    state.push('link_close', 'a', -1)

    state.pos = end + 2
    return true
  })
}
