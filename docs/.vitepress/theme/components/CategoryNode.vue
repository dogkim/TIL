<script setup>
import { withBase } from 'vitepress'

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
})

const hasChildren = props.node.children && props.node.children.length > 0
</script>

<template>
  <div class="cnode" :style="{ marginLeft: depth ? '18px' : '0' }">
    <a v-if="node.link" :href="withBase(node.link)" class="cnode-title" :class="{ 'cnode-folder': hasChildren }">
      {{ node.title }}
    </a>
    <span v-else class="cnode-title cnode-folder">{{ node.title }}</span>
    <div v-if="hasChildren" class="cnode-children">
      <CategoryNode v-for="c in node.children" :key="c.link || c.title" :node="c" :depth="depth + 1" />
    </div>
  </div>
</template>

<style scoped>
.cnode {
  margin-top: 2px;
}
.cnode-title {
  display: block;
  padding: 3px 0;
  font-size: 14px;
  color: var(--home-muted);
  text-decoration: none;
}
.cnode-title:hover {
  color: var(--home-accent);
}
.cnode-folder {
  font-weight: 600;
  color: var(--home-text);
}
.cnode-children {
  border-left: 1px solid var(--home-hairline);
  padding-left: 12px;
  margin-left: 4px;
}
</style>
