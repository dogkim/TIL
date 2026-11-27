<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  data: { type: Object, required: true },
})

const PROJECT_INFO = {
  imfoster: {
    year: '2026.08',
    role: 'Solo',
    description: '대학 공지·채용 정보를 크롤링해 개인 맞춤 알림을 보내는 자동화 봇.',
    tags: ['Python', 'FastAPI', 'PostgreSQL'],
  },
  Zing: {
    year: '2026.08',
    role: '2인 개발 (FE 제외 전반)',
    description: '일기 기반 매칭으로 교환학생과 한국 학생을 자동 번역으로 이어주는 소셜 앱.',
    tags: ['Expo', 'TypeScript', 'Supabase'],
  },
}

// 모든 프로젝트 폴더 — PROJECT_INFO가 있는 대표 프로젝트를 앞에 둠
const projects = computed(() => {
  const projectGroup = props.data.groups.find(g => g.key === 'projects')
  const all = (projectGroup?.items ?? []).map(item => ({
    title: item.title,
    link: item.link,
    count: item.count ?? 0,
    updated: item.updated ?? '',
    ...(PROJECT_INFO[item.title] ?? {}),
    featured: item.title in PROJECT_INFO,
  }))
  return [...all.filter(p => p.featured), ...all.filter(p => !p.featured)]
})

// 노트 섹션 카드 (cs / philosophy / records)
const SECTIONS = [
  { key: 'cs', link: '/computer/' },
  { key: 'philosophy', link: '/philosophy/' },
  { key: 'records', link: '/records/' },
]
const sections = computed(() =>
  SECTIONS.map(s => {
    const g = props.data.groups.find(g => g.key === s.key)
    return g ? { ...s, label: g.label, count: g.count, latest: g.recent?.[0] ?? null } : null
  }).filter(Boolean)
)
</script>

<template>
  <section class="hero">
    <p class="hero-eyebrow">PERSONAL KNOWLEDGE VAULT</p>
    <p class="hero-lede">공부와 활동 기록을 정리합니다.</p>
    <p class="hero-sub">
      경북대학교 철학과 본전공 · 컴퓨터공학(플랫폼소프트웨어전공) 복수전공 · 4학년 1학기
    </p>
    <div class="hero-meta">
      <span>노트 {{ data.stats.noteCount }}개</span>
      <span>프로젝트 {{ data.stats.projectCount }}개</span>
      <span>최근 업데이트 {{ data.stats.lastUpdated }}</span>
      <span>Daegu, KR</span>
    </div>
  </section>

  <section class="featured">
    <div class="section-head">
      <h2>프로젝트</h2>
      <a :href="withBase('/computer/project/')">전체 보기 →</a>
    </div>
    <div class="project-grid">
      <a
        v-for="p in projects"
        :key="p.link"
        class="project-card"
        :href="withBase(p.link)"
      >
        <template v-if="p.featured">
          <div class="project-card-meta">{{ p.year }} · {{ p.role }}</div>
          <h3>{{ p.title }}</h3>
          <p>{{ p.description }}</p>
          <div class="project-tags">
            <span v-for="t in p.tags" :key="t" class="tag-chip">{{ t }}</span>
          </div>
        </template>
        <template v-else>
          <div class="project-card-meta">{{ p.count }}개 노트</div>
          <h3>{{ p.title }}</h3>
          <div v-if="p.updated" class="project-updated">업데이트 {{ p.updated }}</div>
        </template>
      </a>
    </div>
  </section>

  <section class="note-sections">
    <div class="section-head">
      <h2>노트 섹션</h2>
    </div>
    <div class="section-grid">
      <a
        v-for="s in sections"
        :key="s.key"
        class="section-card"
        :href="withBase(s.link)"
      >
        <div class="project-card-meta">{{ s.count }}개 노트</div>
        <h3>{{ s.label }}</h3>
        <div v-if="s.latest" class="section-latest">
          <span class="recent-date">{{ s.latest.date }}</span>
          <span class="section-latest-title">{{ s.latest.title }}</span>
        </div>
      </a>
    </div>
  </section>

  <footer class="home-footer">
    <span>Built with VitePress</span>
    <span>wherry03@knu.ac.kr</span>
  </footer>
</template>

<style scoped>
.hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--home-accent);
  margin-bottom: 12px;
}
.hero-lede {
  color: var(--home-text);
  font-size: 22px;
  line-height: 1.4;
  font-weight: 600;
  max-width: 640px;
  margin: 0 0 8px;
}
.hero-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--home-faint);
  margin: 0 0 20px;
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
  gap: 1px;
  background: var(--home-line);
  border: 1px solid var(--home-line);
}
.project-card {
  padding: 20px;
  background: var(--home-bg);
  text-decoration: none;
  color: var(--home-text);
}
.project-card:hover {
  background: var(--home-panel);
}
/* 프로젝트가 홀수 개면 마지막 카드가 한 줄을 다 차지해서 빈 칸이 생기지 않게 함 */
.project-card:last-child:nth-child(odd) {
  grid-column: 1 / -1;
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

.project-updated {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--home-faint);
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--home-line);
  border: 1px solid var(--home-line);
}
.section-card {
  padding: 20px;
  background: var(--home-bg);
  text-decoration: none;
  color: var(--home-text);
}
.section-card:hover {
  background: var(--home-panel);
}
.section-card h3 {
  margin: 0 0 12px;
  font-size: 16px;
}
.section-latest {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.recent-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--home-faint);
}
.section-latest-title {
  font-size: 13px;
  color: var(--home-muted);
}

@media (max-width: 767px) {
  .project-grid,
  .section-grid {
    grid-template-columns: 1fr;
  }
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
