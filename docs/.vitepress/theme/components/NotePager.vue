<script setup>
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { isActiveLink } from '../utils/activePath.js'

const { theme } = useData()
const route = useRoute()

// 현재 글이 들어 있는 형제 목록(children 배열)을 트리에서 찾음
function findSiblings(nodes, path) {
  for (const n of nodes) {
    if (!n.children?.length && isActiveLink(path, n.link)) return nodes
    if (n.children?.length) {
      const found = findSiblings(n.children, path)
      if (found) return found
    }
  }
  return null
}

const neighbours = computed(() => {
  for (const g of theme.value.homeData.groups) {
    const siblings = findSiblings(g.items, route.path)
    if (!siblings) continue
    const leaves = siblings.filter(n => !n.children?.length) // 하위 폴더는 건너뜀
    const i = leaves.findIndex(n => isActiveLink(route.path, n.link))
    return { prev: leaves[i - 1] ?? null, next: leaves[i + 1] ?? null }
  }
  return { prev: null, next: null }
})
</script>

<template>
  <nav v-if="neighbours.prev || neighbours.next" class="note-pager">
    <a v-if="neighbours.prev" class="pager-box" :href="withBase(neighbours.prev.link)">
      <span class="pager-label">← 이전</span>
      <span class="pager-title">{{ neighbours.prev.title }}</span>
    </a>
    <span v-else class="pager-spacer" />
    <a v-if="neighbours.next" class="pager-box pager-next" :href="withBase(neighbours.next.link)">
      <span class="pager-label">다음 →</span>
      <span class="pager-title">{{ neighbours.next.title }}</span>
    </a>
  </nav>
</template>

<style scoped>
.note-pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--home-hairline);
}
.pager-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid var(--home-hairline);
  text-decoration: none;
  color: var(--home-text);
  min-width: 0;
}
.pager-box:hover {
  background: var(--home-panel);
}
.pager-next {
  grid-column: 2;
  text-align: right;
}
.pager-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--home-faint);
}
.pager-title {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 767px) {
  .note-pager {
    grid-template-columns: 1fr;
  }
  .pager-next {
    grid-column: 1;
  }
  .pager-spacer {
    display: none;
  }
}
</style>
