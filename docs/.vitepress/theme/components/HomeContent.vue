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

const featuredProjects = computed(() => {
  const projectGroup = props.data.groups.find(g => g.key === 'projects')
  return (projectGroup?.items ?? [])
    .filter(item => item.title in PROJECT_INFO)
    .map(item => ({
      title: item.title,
      link: item.link,
      ...PROJECT_INFO[item.title],
    }))
})
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
      <h2>대표 프로젝트</h2>
      <a :href="withBase('/computer/project/')">전체 보기 →</a>
    </div>
    <div class="project-grid">
      <a
        v-for="p in featuredProjects"
        :key="p.link"
        class="project-card"
        :href="withBase(p.link)"
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
        :href="withBase(n.link)"
      >
        <span class="recent-date">{{ n.date }}</span>
        <span class="recent-title">{{ n.title }}</span>
        <span class="recent-group">{{ n.group }}</span>
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
