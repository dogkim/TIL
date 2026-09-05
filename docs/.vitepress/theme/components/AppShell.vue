<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useData, withBase } from 'vitepress'
import SidebarNode from './SidebarNode.vue'
import HomeContent from './HomeContent.vue'
import CommandPalette from './CommandPalette.vue'
import Snow from './Atmosphere.vue'
import SiteIcon from './SiteIcon.vue'

const { isDark, theme, page } = useData()
const data = theme.value.homeData

const isHome = computed(() => page.value.relativePath === 'index.md')

const NAV = [
  { label: 'Projects', link: '/computer/project/' },
  { label: 'Computer Science', link: '/computer/' },
  { label: 'Philosophy', link: '/philosophy/' },
  { label: 'Records', link: '/records/' },
]

const railCollapsed = ref(false)
const expanded = ref(Object.fromEntries(data.groups.map(g => [g.key, false])))
const paletteOpen = ref(false)
const activeSlug = ref('')

const tocHeaders = computed(() => (page.value.headers || []).filter(h => h.level >= 2 && h.level <= 3))

function toggleGroup(key) {
  expanded.value[key] = !expanded.value[key]
}

function onKeydown(e) {
  const isMeta = e.metaKey || e.ctrlKey
  if (isMeta && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    paletteOpen.value = true
  }
}

const SCROLLSPY_OFFSET = 96 // 헤더 높이 + 여유값 — 이 지점을 막 지난 헤딩을 active로 취급

function updateActiveHeading() {
  if (typeof document === 'undefined') return // SSR(빌드 시 렌더링)에는 document가 없음
  const els = tocHeaders.value
    .map(h => document.getElementById(h.slug))
    .filter(Boolean)
  let current = els[0]
  for (const el of els) {
    if (el.getBoundingClientRect().top <= SCROLLSPY_OFFSET) current = el
    else break
  }
  activeSlug.value = current ? current.id : ''
}

watch(() => page.value.relativePath, () => {
  nextTick(updateActiveHeading)
}, { immediate: true })

onMounted(() => {
  window.addEventListener('scroll', updateActiveHeading, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})
</script>

<template>
  <div class="home-shell" tabindex="0" @keydown="onKeydown">
    <header class="home-header">
      <div class="home-header-left">
        <a :href="withBase('/')" class="home-icon" aria-label="홈으로">
          <SiteIcon />
        </a>
        <a :href="withBase('/')" class="home-brand">til.vault</a>
      </div>
      <nav class="home-nav">
        <a v-for="n in NAV" :key="n.link" :href="withBase(n.link)">{{ n.label }}</a>
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
              <SidebarNode v-for="item in g.items" :key="item.link || item.title" :node="item" :depth="1" />
            </div>
          </div>
        </template>
        <template v-else>
          <button class="rail-toggle rail-toggle-collapsed" @click="railCollapsed = false">⟩</button>
        </template>
      </aside>

      <main class="home-main">
        <HomeContent v-if="isHome" :data="data" />
        <div v-else class="vp-doc doc-content">
          <Content />
        </div>
      </main>

      <aside v-if="!isHome && tocHeaders.length" class="home-toc">
        <div class="toc-label">ON THIS PAGE</div>
        <a
          v-for="h in tocHeaders"
          :key="h.slug"
          :href="'#' + h.slug"
          class="toc-link"
          :class="['toc-level-' + h.level, { active: activeSlug === h.slug }]"
        >{{ h.title }}</a>
      </aside>
    </div>

    <CommandPalette
      v-if="paletteOpen"
      :items="data.searchIndex"
      @close="paletteOpen = false"
    />
    <Snow />
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
  padding: 0 32px;
  border-bottom: 1px solid var(--home-hairline);
  background: var(--home-bg);
}
.home-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.home-icon {
  display: flex;
  align-items: center;
  color: var(--home-text);
}
.home-icon svg {
  width: 26px;
  height: 26px;
}
.home-brand {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--home-faint);
  text-decoration: none;
}
.home-nav {
  display: flex;
  gap: 28px;
  margin-left: 56px;
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
  margin-left: auto;
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

.home-main {
  flex: 1;
  max-width: 920px;
  padding: 56px 40px;
  border-left: 1px solid var(--home-hairline);
}

.doc-content {
  padding-bottom: 40px;
}

.home-toc {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 57px;
  height: fit-content;
  max-height: calc(100vh - 57px);
  overflow-y: auto;
  padding: 56px 24px;
  display: none;
}
@media (min-width: 1280px) {
  .home-toc {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
}
.toc-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--home-faint);
  margin-bottom: 8px;
}
.toc-link {
  font-size: 13px;
  line-height: 1.5;
  color: var(--home-muted);
  text-decoration: none;
  padding: 3px 0;
  border-left: 2px solid transparent;
  padding-left: 10px;
}
.toc-link:hover {
  color: var(--home-text);
}
.toc-link.active {
  color: var(--home-text);
  border-left-color: var(--home-text);
  font-weight: 600;
}
.toc-link.toc-level-3 {
  padding-left: 22px;
  font-size: 12.5px;
}
</style>
