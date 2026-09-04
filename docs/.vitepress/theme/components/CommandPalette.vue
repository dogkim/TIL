<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, required: true }, // [{ title, link, group }]
})
const emit = defineEmits(['close'])

const query = ref('')
const inputEl = ref(null)

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.items.slice(0, 50)
  return props.items.filter(i => i.title.toLowerCase().includes(q)).slice(0, 50)
})

function close() {
  emit('close')
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

watch(
  () => true,
  async () => {
    await nextTick()
    inputEl.value?.focus()
  },
  { immediate: true }
)
</script>

<template>
  <div class="cp-scrim" @click.self="close" @keydown="onKeydown">
    <div class="cp-panel" role="dialog" aria-modal="true">
      <div class="cp-input-row">
        <span class="cp-slash">/</span>
        <input
          ref="inputEl"
          v-model="query"
          class="cp-input"
          type="text"
          placeholder="문서 검색..."
          @keydown="onKeydown"
        />
        <span class="cp-esc" @click="close">ESC</span>
      </div>
      <div class="cp-results">
        <a
          v-for="item in results"
          :key="item.link"
          class="cp-result"
          :href="item.link"
        >
          <span class="cp-result-title">{{ item.title }}</span>
          <span class="cp-result-group">{{ item.group }}</span>
        </a>
        <div v-if="results.length === 0" class="cp-empty">일치하는 문서가 없습니다.</div>
      </div>
      <div class="cp-footer">
        <span>↑↓ 이동</span>
        <span>↵ 열기</span>
        <span>{{ results.length }}개 결과</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-scrim {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--home-bg) 40%, transparent);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
  z-index: 100;
}
.cp-panel {
  width: 620px;
  max-width: 92vw;
  max-height: 66vh;
  background: var(--home-panel);
  border: 1px solid var(--home-line);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
}
.cp-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--home-hairline);
}
.cp-slash {
  font-family: 'JetBrains Mono', monospace;
  color: var(--home-faint);
}
.cp-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--home-text);
}
.cp-esc {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--home-faint);
  border: 1px solid var(--home-line);
  border-radius: 4px;
  padding: 2px 6px;
  cursor: pointer;
}
.cp-results {
  overflow-y: auto;
  flex: 1;
}
.cp-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  text-decoration: none;
  color: var(--home-text);
}
.cp-result:hover {
  background: var(--home-accent-soft);
}
.cp-result-title {
  font-size: 14px;
}
.cp-result-group {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  color: var(--home-faint);
}
.cp-empty {
  padding: 24px 16px;
  text-align: center;
  color: var(--home-muted);
  font-size: 14px;
}
.cp-footer {
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  border-top: 1px solid var(--home-hairline);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--home-faint);
}
</style>
