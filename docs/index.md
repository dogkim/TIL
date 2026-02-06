<script setup>
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'

const { frontmatter } = useData()
const route = useRoute()
let snowContainer = null

// 1. GSAP 라이브러리 로드
const loadGSAP = () => {
  return new Promise((resolve) => {
    if (window.gsap) return resolve(window.gsap)
    const script = document.createElement('script')
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
    script.onload = () => resolve(window.gsap)
    document.head.appendChild(script)
  })
}

// 2. 개별 눈송이 생성 및 애니메이션
const createFlake = (gsap) => {
  if (!snowContainer) return
  const flake = document.createElement('div')
  flake.innerHTML = '●'
  flake.style.cssText = `
    position: absolute; color: white; text-shadow: 0 0 5px #fff;
    opacity: ${0.2 + Math.random() * 0.7};
    font-size: ${3 + Math.random() * 4}px;
    top: -20px;
    will-change: transform;
  `
  snowContainer.appendChild(flake)

  gsap.fromTo(flake, 
    { x: Math.random() * window.innerWidth, y: -30 }, 
    {
      duration: 5 + Math.random() * 10,
      y: window.innerHeight + 50,
      x: "+=" + (Math.random() * 200 - 100),
      repeat: -1,
      ease: "none",
      delay: Math.random() * 4
    }
  )
}

// 3. 눈 내리기 시작 (layout: home 조건으로 체크)
const initSnow = async () => {
  // 배포 환경(GitHub Pages)에서도 안전하게 layout 속성으로 확인
  if (snowContainer || frontmatter.value.layout !== 'home') return

  const gsap = await loadGSAP()
  snowContainer = document.createElement('div')
  snowContainer.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 9999; overflow: hidden;
  `
  document.body.appendChild(snowContainer)

  for (let i = 0; i < 70; i++) {
    createFlake(gsap)
  }
}

// 4. 눈 치우기
const clearSnow = () => {
  if (snowContainer) {
    snowContainer.remove()
    snowContainer = null
  }
}

// --- 생명주기 및 경로 변경 감시 ---
onMounted(() => initSnow())

watch(() => route.path, async () => {
  // 페이지 이동 후 데이터가 업데이트될 때까지 대기
  await nextTick()
  if (frontmatter.value.layout === 'home') {
    initSnow()
  } else {
    clearSnow()
  }
})

onUnmounted(() => clearSnow())
</script>