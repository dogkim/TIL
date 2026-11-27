<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const props = defineProps({
  groupKey: { type: String, required: true },
})

const { theme } = useData()

const group = computed(() => theme.value.homeData.groups.find(g => g.key === props.groupKey) || null)
const recent = computed(() => group.value?.recent ?? [])
const folders = computed(() => group.value?.items ?? [])
const lastUpdated = computed(() => recent.value[0]?.date || '-')
</script>

<template>
  <div v-if="group" class="section-landing">
    <div class="landing-meta">
      <span>노트 {{ group.count }}개</span>
      <span>최근 업데이트 {{ lastUpdated }}</span>
    </div>

    <template v-if="recent.length">
      <h2 class="landing-head">최근 노트</h2>
      <div class="landing-recent">
        <a v-for="n in recent" :key="n.link" class="recent-row" :href="withBase(n.link)">
          <span class="recent-date">{{ n.date }}</span>
          <span class="recent-title">{{ n.title }}</span>
        </a>
      </div>
    </template>

    <h2 class="landing-head">폴더</h2>
    <div class="folder-grid">
      <a v-for="f in folders" :key="f.link" class="folder-card" :href="withBase(f.link)">
        <h3>{{ f.title }}</h3>
        <div class="folder-meta">
          <span>{{ f.count }}개 노트</span>
          <span v-if="f.updated">{{ f.updated }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.landing-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--home-faint);
  margin: 4px 0 8px;
}
.landing-head {
  font-size: 18px;
  margin: 40px 0 16px;
  border: none;
  padding: 0;
}
.landing-recent {
  border: 1px solid var(--home-hairline);
}
.recent-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--home-hairline);
  text-decoration: none;
  color: var(--home-text);
  align-items: center;
}
.recent-row:last-child {
  border-bottom: none;
}
.recent-row:hover {
  background: var(--home-panel);
}
.recent-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--home-faint);
}
.recent-title {
  font-size: 14px;
}

.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1px;
  background: var(--home-line);
  border: 1px solid var(--home-line);
}
.folder-card {
  padding: 18px 20px;
  background: var(--home-bg);
  text-decoration: none;
  color: var(--home-text);
}
.folder-card:hover {
  background: var(--home-panel);
}
.folder-card h3 {
  margin: 0 0 8px;
  font-size: 15px;
}
.folder-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--home-faint);
}

@media (max-width: 767px) {
  .recent-row {
    grid-template-columns: 90px 1fr;
  }
}
</style>
