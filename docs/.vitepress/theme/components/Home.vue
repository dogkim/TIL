<script setup>
import { ref, computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import data from '../homeData.data'
import CommandPalette from './CommandPalette.vue'

const { isDark } = useData()
const route = useRoute()

const NAV = [
  { label: 'Projects', link: '/computer/project/' },
  { label: 'Computer Science', link: '/computer/' },
  { label: 'Philosophy', link: '/philosophy/' },
  { label: 'Records', link: '/records/' },
]

const railCollapsed = ref(false)
const expanded = ref(Object.fromEntries(data.groups.map(g => [g.key, true])))
const paletteOpen = ref(false)

function toggleGroup(key) {
  expanded.value[key] = !expanded.value[key]
}

function isActive(link) {
  return route.path === link || route.path === link.replace(/\/$/, '')
}

function onKeydown(e) {
  const isMeta = e.metaKey || e.ctrlKey
  if (isMeta && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    paletteOpen.value = true
  }
}

const featuredProjects = computed(() => {
  const projectGroup = data.groups.find(g => g.key === 'projects')
  return (projectGroup?.items ?? []).map(item => ({
    year: '20XX',
    role: '역할을 입력하세요',
    title: item.title,
    description: '프로젝트 설명을 입력하세요.',
    tags: ['tag1', 'tag2'],
    link: item.link,
  }))
})
</script>

<template>
  <div class="home-shell" tabindex="0" @keydown="onKeydown">
    <header class="home-header">
      <div class="home-header-left">
        <span class="home-name">이름을 입력하세요</span>
        <span class="home-brand">til.vault</span>
      </div>
      <nav class="home-nav">
        <a v-for="n in NAV" :key="n.link" :href="n.link">{{ n.label }}</a>
      </nav>
      <div class="home-header-right">
        <button class="home-search-btn" @click="paletteOpen = true">
          검색 <span class="kbd">⌘K</span>
        </button>
        <button class="home-theme-btn" @click="isDark = !isDark" aria-label="테마 전환">
          {{ isDark ? '◑' : '◐' }}
        </button>
      </div>
    </header>

    <div class="home-body">
      <aside class="home-sidebar" :class="{ collapsed: railCollapsed }">
        <template v-if="!railCollapsed">
          <div class="sidebar-top">
            <span class="sidebar-label">VAULT</span>
            <button class="rail-toggle" @click="railCollapsed = true">⟨</button>
          </div>
          <div v-for="g in data.groups" :key="g.key" class="sidebar-group">
            <button class="sidebar-group-row" @click="toggleGroup(g.key)">
              <span class="caret">{{ expanded[g.key] ? '▾' : '▸' }}</span>
              <span class="sidebar-group-label">{{ g.label }}</span>
              <span class="sidebar-group-count">{{ String(g.count).padStart(2, '0') }}</span>
            </button>
            <div v-if="expanded[g.key]" class="sidebar-children">
              <a
                v-for="item in g.items"
                :key="item.link"
                :href="item.link"
                class="sidebar-child"
                :class="{ active: isActive(item.link) }"
              >
                {{ item.title }}
              </a>
            </div>
          </div>
        </template>
        <template v-else>
          <button class="rail-toggle rail-toggle-collapsed" @click="railCollapsed = false">⟩</button>
        </template>
      </aside>

      <main class="home-main">
        <section class="hero">
          <p class="hero-eyebrow">PERSONAL KNOWLEDGE VAULT</p>
          <h1 class="hero-headline">
            이름을 입력하세요<br />
            이곳에 소개 문구를 적어주세요
          </h1>
          <p class="hero-lede">
            이 페이지는 개인 지식 관리(TIL) 볼트의 홈페이지입니다. 이 문단에 자기소개를 채워넣으세요.
          </p>
          <div class="hero-meta">
            <span>노트 {{ data.stats.noteCount }}개</span>
            <span>프로젝트 {{ data.stats.projectCount }}개</span>
            <span>최근 업데이트 {{ data.stats.lastUpdated }}</span>
            <span>위치를 입력하세요</span>
          </div>
        </section>

        <section class="featured">
          <div class="section-head">
            <h2>대표 프로젝트</h2>
            <a href="/computer/project/">전체 보기 →</a>
          </div>
          <div class="project-grid">
            <a
              v-for="p in featuredProjects"
              :key="p.link"
              class="project-card"
              :href="p.link"
            >
              <div class="project-card-meta">{{ p.year }} · {{ p.role }}</div>
              <h3>{{ p.title }}</h3>
              <p>{{ p.description }}</p>
              <div class="project-tags">
                <span v-for="t in p.tags" :key="t" class="tag-chip">{{ t }}</span>
              </div>
            </a>
          </div>
        </section>

        <section class="recent">
          <div class="section-head">
            <h2>최근 노트</h2>
          </div>
          <div class="recent-list">
            <a
              v-for="n in data.recentNotes"
              :key="n.link"
              class="recent-row"
              :href="n.link"
            >
              <span class="recent-date">{{ n.date }}</span>
              <span class="recent-title">{{ n.title }}</span>
              <span class="recent-group">{{ n.group }}</span>
            </a>
          </div>
        </section>

        <footer class="home-footer">
          <span>Built with VitePress</span>
          <span>you@example.com</span>
        </footer>
      </main>
    </div>

    <CommandPalette
      v-if="paletteOpen"
      :items="data.searchIndex"
      @close="paletteOpen = false"
    />
  </div>
</template>

<style scoped>
.home-shell {
  min-height: 100vh;
  background: var(--home-bg);
  color: var(--home-text);
  outline: none;
}

.home-header {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 57px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid var(--home-hairline);
  background: var(--home-bg);
}
.home-header-left {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.home-name {
  font-weight: 600;
}
.home-brand {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--home-faint);
}
.home-nav {
  display: flex;
  gap: 28px;
}
.home-nav a {
  color: var(--home-muted);
  text-decoration: none;
  font-size: 14px;
}
.home-nav a:hover {
  color: var(--home-text);
}
.home-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.home-search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--home-line);
  background: var(--home-panel);
  color: var(--home-muted);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
}
.kbd {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--home-faint);
}
.home-theme-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--home-line);
  background: var(--home-panel);
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  cursor: pointer;
  color: var(--home-text);
}

.home-body {
  display: flex;
}

.home-sidebar {
  width: 268px;
  flex-shrink: 0;
  position: sticky;
  top: 57px;
  height: calc(100vh - 57px);
  overflow-y: auto;
  padding: 20px 16px;
  border-right: 1px solid var(--home-hairline);
  transition: width 0.18s ease;
}
.home-sidebar.collapsed {
  width: 64px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px 0;
}
.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.sidebar-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--home-faint);
}
.rail-toggle {
  border: 1px solid var(--home-line);
  background: var(--home-panel);
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: var(--home-muted);
}
.sidebar-group {
  margin-bottom: 4px;
}
.sidebar-group-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--home-text);
  text-align: left;
}
.caret {
  color: var(--home-faint);
  font-size: 11px;
  width: 10px;
}
.sidebar-group-label {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
}
.sidebar-group-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--home-faint);
}
.sidebar-children {
  display: flex;
  flex-direction: column;
  margin-left: 18px;
  border-left: 1px solid var(--home-hairline);
  padding-left: 10px;
}
.sidebar-child {
  padding: 5px 6px;
  font-size: 13px;
  color: var(--home-muted);
  text-decoration: none;
  border-left: 2px solid transparent;
}
.sidebar-child:hover {
  color: var(--home-text);
}
.sidebar-child.active {
  color: var(--home-accent);
  font-weight: 600;
  border-left-color: var(--home-accent);
}

.home-main {
  flex: 1;
  max-width: 920px;
  padding: 56px 40px;
  border-left: 1px solid var(--home-hairline);
}

.hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--home-accent);
  margin-bottom: 12px;
}
.hero-headline {
  font-size: 44px;
  line-height: 1.2;
  font-weight: 700;
  margin: 0 0 16px;
}
.hero-lede {
  color: var(--home-muted);
  font-size: 16px;
  max-width: 560px;
  margin-bottom: 20px;
}
.hero-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--home-faint);
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 56px 0 16px;
}
.section-head h2 {
  font-size: 18px;
  margin: 0;
}
.section-head a {
  font-size: 13px;
  color: var(--home-accent);
  text-decoration: none;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 1px solid var(--home-hairline);
}
.project-card {
  padding: 20px;
  border-right: 1px solid var(--home-hairline);
  border-bottom: 1px solid var(--home-hairline);
  text-decoration: none;
  color: var(--home-text);
}
.project-card:hover {
  background: var(--home-panel);
}
.project-card-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  color: var(--home-faint);
  margin-bottom: 8px;
}
.project-card h3 {
  margin: 0 0 6px;
  font-size: 16px;
}
.project-card p {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--home-muted);
}
.project-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tag-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  border: 1px solid var(--home-line);
  border-radius: 4px;
  padding: 2px 6px;
  color: var(--home-muted);
}

.recent-list {
  border: 1px solid var(--home-hairline);
}
.recent-row {
  display: grid;
  grid-template-columns: 100px 1fr 140px;
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
.recent-group {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  color: var(--home-faint);
  text-align: right;
}

.home-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 56px;
  padding-top: 20px;
  border-top: 1px solid var(--home-hairline);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--home-faint);
}
</style>
