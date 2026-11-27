<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

// 날짜는 Date 객체/ISO 문자열/일반 문자열 어느 쪽이든 YYYY-MM-DD로 맞춤
const date = computed(() => {
  const d = frontmatter.value.date
  if (!d) return ''
  if (d instanceof Date) return isNaN(d) ? '' : d.toISOString().slice(0, 10)
  return String(d).slice(0, 10)
})

// 태그는 경로 마지막 조각만 표시 (philosophy/Logic → Logic)
const tags = computed(() => {
  const t = frontmatter.value.tags
  const list = Array.isArray(t) ? t : t ? [t] : []
  return list.map(x => String(x).split('/').filter(Boolean).pop()).filter(Boolean)
})
</script>

<template>
  <div v-if="date || tags.length" class="note-meta">
    <span v-if="date" class="note-date">{{ date }}</span>
    <span v-for="t in tags" :key="t" class="tag-chip">{{ t }}</span>
  </div>
</template>

<style scoped>
.note-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.note-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--home-faint);
  margin-right: 4px;
}
.tag-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  border: 1px solid var(--home-line);
  border-radius: 4px;
  padding: 2px 6px;
  color: var(--home-muted);
}
</style>
