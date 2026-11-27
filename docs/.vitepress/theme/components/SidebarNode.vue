<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { isActiveLink, containsActive } from '../utils/activePath.js'

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 1 },
  // 부모가 정해 주는 펼침 여부 (아코디언: 같은 형제 중 하나만 true)
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['toggle'])

const route = useRoute()
const leafEl = ref(null)
// 이 폴더의 자식 중 펼쳐진 하나의 key (없으면 null)
const openChild = ref(null)

const hasChildren = props.node.children && props.node.children.length > 0

function isActive(link) {
  return isActiveLink(route.path, link)
}

function keyOf(c) {
  return c.link || c.title
}

// 자식을 누르면 이미 열린 것은 닫고, 아니면 그것만 열어서 형제는 자동으로 닫힘
function toggleChild(key) {
  openChild.value = openChild.value === key ? null : key
}

// 페이지가 바뀔 때마다(검색, 카드, 메뉴 어디서 들어오든) 열린 자식을 초기화하고
// 현재 글이 속한 자식 폴더만 펼침(없으면 모두 접음). 현재 글이 화면 밖이면 보이는 위치로 스크롤
watch(
  () => route.path,
  async () => {
    if (hasChildren) {
      const c = props.node.children.find(c => containsActive(route.path, c))
      openChild.value = c ? keyOf(c) : null
    }
    if (!hasChildren && isActive(props.node.link)) {
      await nextTick()
      leafEl.value?.scrollIntoView({ block: 'nearest' })
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="snode">
    <!-- 폴더(하위 항목 있음): 클릭하면 펼치기/접기만 함, 링크로 이동하지 않음 -->
    <button
      v-if="hasChildren"
      class="snode-row snode-folder"
      :style="{ paddingLeft: `${depth * 10}px` }"
      @click="emit('toggle')"
    >
      <span class="snode-caret">{{ open ? '▾' : '▸' }}</span>
      <span class="snode-link">{{ node.title }}</span>
    </button>
    <!-- 파일(하위 항목 없음): 실제 문서로 이동하는 링크 -->
    <a
      v-else
      ref="leafEl"
      :href="withBase(node.link)"
      class="snode-row"
      :style="{ paddingLeft: `${depth * 10}px` }"
    >
      <span class="snode-caret snode-caret-empty" />
      <span class="snode-link" :class="{ active: isActive(node.link) }">{{ node.title }}</span>
    </a>
    <div v-if="hasChildren && open" class="snode-children">
      <SidebarNode
        v-for="c in node.children"
        :key="keyOf(c)"
        :node="c"
        :depth="depth + 1"
        :open="openChild === keyOf(c)"
        @toggle="toggleChild(keyOf(c))"
      />
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
