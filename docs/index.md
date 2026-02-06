---
title: My TIL
---

# Welcome to My TIL

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
let snowContainer = null

// 1. GSAP 라이브러리 로드 (Promise 활용)
const loadGSAP = () => {
  return new Promise((resolve) => {
    if (window.gsap) return resolve(window.gsap)
    const script = document.createElement('script')
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
    script.onload = () => resolve(window.gsap)
    document.head.appendChild(script)
  })
}

// 2. 개별 눈송이 생성 및 애니메이션 부여
const createFlake = (gsap, cw, ch) => {
  if (!snowContainer) return

  const flake = document.createElement('div')
  flake.innerHTML = '●'
  flake.style.cssText = `
    position: absolute; color: white; text-shadow: 0 0 5px #fff;
    opacity: ${0.2 + Math.random() * 0.7};
    font-size: ${3 + Math.random() * 4}px;
    top: -20px;
  `
  snowContainer.appendChild(flake)

  gsap.fromTo(flake, 
    { x: Math.random() * cw, y: -30 }, 
    {
      duration: 5 + Math.random() * 10,
      y: ch + 30,
      x: "+=" + (Math.random() * 200 - 100),
      repeat: -1,
      ease: "none",
      delay: Math.random() * 2
    }
  )
}

// 3. 눈 내리기 시작 (컨테이너 생성 및 루프 실행)
const initSnow = async () => {
  if (snowContainer || route.path !== '/') return

  const gsap = await loadGSAP()
  const cw = window.innerWidth
  const ch = window.innerHeight

  snowContainer = document.createElement('div')
  snowContainer.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999;'
  document.body.appendChild(snowContainer)

  for (let i = 0; i < 70; i++) {
    createFlake(gsap, cw, ch)
  }
}

// 4. 눈 치우기
const clearSnow = () => {
  if (snowContainer) {
    snowContainer.remove()
    snowContainer = null
  }
}

// --- 생명주기 관리 ---
onMounted(() => initSnow())

watch(() => route.path, (path) => {
  path === '/' ? initSnow() : clearSnow()
})

onUnmounted(() => clearSnow())
</script>