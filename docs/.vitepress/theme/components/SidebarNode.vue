<script setup>
import { ref } from 'vue'
import { useRoute, withBase } from 'vitepress'

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 1 },
})

const route = useRoute()
const open = ref(false)

function isActive(link) {
  if (!link) return false
  const target = withBase(link)
  return route.path === target || route.path === target.replace(/\/$/, '')
}
</script>

<template>
  <div class="snode">
    <div class="snode-row" :style="{ paddingLeft: `${depth * 10}px` }">
      <button
        v-if="node.children && node.children.length"
        class="snode-caret"
        @click="open = !open"
      >{{ open ? '▾' : '▸' }}</button>
      <span v-else class="snode-caret snode-caret-empty" />
      <a
        v-if="node.link"
        :href="withBase(node.link)"
        class="snode-link"
        :class="{ active: isActive(node.link) }"
      >{{ node.title }}</a>
      <span v-else class="snode-link snode-label">{{ node.title }}</span>
    </div>
    <div v-if="node.children && node.children.length && open" class="snode-children">
      <SidebarNode v-for="c in node.children" :key="c.link || c.title" :node="c" :depth="depth + 1" />
    </div>
  </div>
</template>

<style scoped>
.snode-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 4px;
  padding-bottom: 4px;
}
.snode-caret {
  width: 12px;
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--home-faint);
  font-size: 10px;
  padding: 0;
}
.snode-caret-empty {
  cursor: default;
}
.snode-link {
  font-size: 13px;
  color: var(--home-muted);
  text-decoration: none;
  border-left: 2px solid transparent;
  padding-left: 4px;
}
.snode-link:hover {
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
