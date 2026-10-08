import { withBase } from 'vitepress'

// route.path는 한글/공백이 인코딩돼 있거나 .html이 붙어 있을 수 있어서 같은 형태로 맞춰 비교
function normalize(path) {
  let p = path
  try {
    p = decodeURI(path)
  } catch {}
  return p.replace(/\.html$/, '').replace(/\/$/, '')
}

export function isActiveLink(routePath, link) {
  if (!link) return false
  return normalize(routePath) === normalize(withBase(link))
}

// 트리 노드(또는 그 하위)에 현재 페이지가 있는지
export function containsActive(routePath, node) {
  if (!node.children?.length) return isActiveLink(routePath, node.link)
  return node.children.some(c => containsActive(routePath, c))
}
