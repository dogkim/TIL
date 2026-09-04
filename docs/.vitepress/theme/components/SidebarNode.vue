<script setup>
import { ref } from 'vue'
import { useRoute, withBase } from 'vitepress'

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 1 },
})

const route = useRoute()
const open = ref(false)

const hasChildren = props.node.children && props.node.children.length > 0

function isActive(link) {
  if (!link) return false
  const target = withBase(link)
  return route.path === target || route.path === target.replace(/\/$/, '')
}

// 하위에 지금 열려있는 페이지가 있으면, 접혀있어도 자동으로 펼쳐서 보여줌
function containsActive(node) {
  if (isActive(node.link)) return true
  return (node.children ?? []).some(containsActive)
}
if (hasChildren && containsActive(props.node)) {
  open.value = true
}
</script>

<template>
  <div class="snode">
    <!-- 폴더(하위 항목 있음): 클릭하면 펼치기/접기만 함, 링크로 이동하지 않음 -->
    <button
      v-if="hasChildren"
      class="snode-row snode-folder"
      :style="{ paddingLeft: `${depth * 10}px` }"
      @click="open = !open"
    >
      <span class="snode-caret">{{ open ? '▾' : '▸' }}</span>
      <span class="snode-link">{{ node.title }}</span>
    </button>
    <!-- 파일(하위 항목 없음): 실제 문서로 이동하는 링크 -->
    <a
      v-else
      :href="withBase(node.link)"
      class="snode-row"
      :style="{ paddingLeft: `${depth * 10}px` }"
    >
      <span class="snode-caret snode-caret-empty" />
      <span class="snode-link" :class="{ active: isActive(node.link) }">{{ node.title }}</span>
    </a>
    <div v-if="hasChildren && open" class="snode-children">
      <SidebarNode v-for="c in node.children" :key="c.link || c.title" :node="c" :depth="depth + 1" />
    </div>
  </div>
</template>

<style scoped>
.snode-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding-top: 4px;
  padding-bottom: 4px;
  background: none;
  border: none;
  text-decoration: none;
  cursor: pointer;
  text-align: left;
}
.snode-caret {
  width: 12px;
  flex-shrink: 0;
  color: var(--home-faint);
  font-size: 10px;
}
.snode-caret-empty {
  cursor: default;
}
.snode-link {
  font-size: 13px;
  color: var(--home-muted);
  border-left: 2px solid transparent;
  padding-left: 4px;
}
.snode-row:hover .snode-link {
  color: var(--home-text);
}
.snode-link.active {
  color: var(--home-accent);
  font-weight: 600;
  border-left-color: var(--home-accent);
}
.snode-children {
  border-left: 1px solid var(--home-hairline);
  margin-left: 10px;
}
</style>
