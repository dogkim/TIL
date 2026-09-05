<script setup>
import { ref } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
})

const hasChildren = props.node.children && props.node.children.length > 0
const open = ref(false)
</script>

<template>
  <div class="cnode" :style="{ marginLeft: depth ? '18px' : '0' }">
    <!-- 폴더(하위 항목 있음): 클릭하면 펼치기/접기만 함 -->
    <button v-if="hasChildren" class="cnode-row" @click="open = !open">
      <span class="cnode-caret">{{ open ? '▾' : '▸' }}</span>
      <span class="cnode-title cnode-folder">{{ node.title }}</span>
    </button>
    <!-- 파일(하위 항목 없음): 실제 문서로 이동 -->
    <a v-else :href="withBase(node.link)" class="cnode-row">
      <span class="cnode-caret cnode-caret-empty" />
      <span class="cnode-title">{{ node.title }}</span>
    </a>
    <div v-if="hasChildren && open" class="cnode-children">
      <CategoryNode v-for="c in node.children" :key="c.link || c.title" :node="c" :depth="depth + 1" />
    </div>
  </div>
</template>

<style scoped>
.cnode {
  margin-top: 2px;
}
.cnode-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 3px 0;
  background: none;
  border: none;
  text-decoration: none;
  cursor: pointer;
  text-align: left;
}
.cnode-caret {
  width: 12px;
  flex-shrink: 0;
  color: var(--home-faint);
  font-size: 11px;
}
.cnode-caret-empty {
  cursor: default;
}
.cnode-title {
  font-size: 14px;
  color: var(--home-muted);
}
.cnode-row:hover .cnode-title {
  color: var(--home-accent);
}
.cnode-folder {
  font-weight: 600;
  color: var(--home-text);
}
.cnode-row:hover .cnode-folder {
  color: var(--home-accent);
}
.cnode-children {
  border-left: 1px solid var(--home-hairline);
  padding-left: 12px;
  margin-left: 4px;
}
</style>
