// CommonMark's emphasis rule refuses to close a **bold** span when the
// character right before the closing `**` is punctuation (e.g. `)`) and the
// character right after has no whitespace/punctuation of its own — e.g.
// **용어(설명)**에 처럼 붙여 쓰면 원본 CommonMark 파서는 볼드를 닫지 못하고
// 별표를 그대로 텍스트로 출력해버림. Obsidian 등에서 이렇게 써왔다면 사이트에서만
// 깨지는 것처럼 보임.
//
// 이 플러그인은 `**`를 CommonMark의 flanking 규칙 대신, 그냥 "가장 가까운 다음
// `**`까지"로 단순하게 짝지어 강조로 처리한다 (중첩된 인라인 구문은 재귀적으로
// 그대로 파싱됨). 기존에 이미 정상 동작하던 케이스(공백 뒤 등)는 이 방식으로도
// 동일하게 렌더링되므로 회귀 없음.
export function strongLenientPlugin(md) {
  md.inline.ruler.before('emphasis', 'strong_lenient', function strongLenient(state, silent) {
    const src = state.src
    const start = state.pos

    if (src.charCodeAt(start) !== 0x2a /* * */) return false
    if (src.charCodeAt(start + 1) !== 0x2a) return false
    // 별표 3개 이상(***bold italic*** 등)은 건드리지 않고 기본 emphasis 엔진에 맡김
    if (src.charCodeAt(start + 2) === 0x2a) return false
    if (start > 0 && src.charCodeAt(start - 1) === 0x2a) return false

    let end = -1
    for (let i = start + 2; i < src.length - 1; i++) {
      if (src.charCodeAt(i) === 0x2a && src.charCodeAt(i + 1) === 0x2a) {
        if (src.charCodeAt(i - 1) === 0x5c /* \ */) continue // 이스케이프된 별표
        if (src.charCodeAt(i + 2) === 0x2a) continue // ***로 이어지는 경우 스킵
        end = i
        break
      }
    }
    if (end === -1) return false
    if (end === start + 2) return false // ****(빈 내용)은 처리하지 않음

    if (silent) return true

    const oldPos = state.pos
    const oldPosMax = state.posMax

    state.push('strong_open', 'strong', 1).markup = '**'
    state.pos = start + 2
    state.posMax = end
    state.md.inline.tokenize(state)
    state.push('strong_close', 'strong', -1).markup = '**'

    state.pos = end + 2
    state.posMax = oldPosMax
    return true
  })
}
