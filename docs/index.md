<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

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

// 2. 개별 눈송이 생성 및 애니메이션 부여
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

  // 창 크기 변화에 유연하게 대응하기 위해 픽셀 대신 %나 vh 활용 가능
  gsap.fromTo(flake, 
    { x: Math.random() * window.innerWidth, y: -30 }, 
    {
      duration: 5 + Math.random() * 10,
      y: window.innerHeight + 50,
      x: "+=" + (Math.random() * 200 - 100),
      repeat: -1,
      ease: "none",
      delay: Math.random() * 5
    }
  )
}

// 3. 눈 내리기 시작
const initSnow = async () => {
  // 메인 경로('/') 체크. VitePress 환경에 따라 '/index.html' 등도 고려 필요할 수 있음
  if (snowContainer || (route.path !== '/' && route.path !== '/index.html')) return

  const gsap = await loadGSAP()

  snowContainer = document.createElement('div')
  snowContainer.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 9999; overflow: hidden;
  `
  document.body.appendChild(snowContainer)

  // 한 번에 생성하지 않고 약간의 시차를 두어 생성 (자연스러움 추가)
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

// --- 생명주기 관리 ---
onMounted(() => initSnow())

watch(() => route.path, (path) => {
  // 메인 페이지일 때만 실행, 그 외엔 제거
  (path === '/' || path === '/index.html') ? initSnow() : clearSnow()
})

onUnmounted(() => clearSnow())
</script>