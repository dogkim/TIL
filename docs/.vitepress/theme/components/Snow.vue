<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

const { frontmatter } = useData()
const route = useRoute()
const canvasRef = ref(null)
let animationId = null

// 눈송이 데이터 초기화
const createFlakes = (width, height, count) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 3 + 1, // 크기
    d: Math.random() * count, // 밀도
    speed: Math.random() * 1 + 0.5, // 속도
    opacity: Math.random() * 0.5 + 0.3
  }))
}

const initSnow = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  
  let width = window.innerWidth
  let height = window.innerHeight
  canvas.width = width
  canvas.height = height

  const flakes = createFlakes(width, height, 80)

  const draw = () => {
    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    flakes.forEach(f => {
      ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`
      ctx.moveTo(f.x, f.y)
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
    })
    ctx.fill()
    move()
    animationId = requestAnimationFrame(draw)
  }

  const move = () => {
    flakes.forEach(f => {
      f.y += f.speed
      f.x += Math.sin(f.y / 50) * 0.5 // 지그재그 흔들림 효과
      
      if (f.y > height) {
        f.y = -10
        f.x = Math.random() * width
      }
    })
  }

  draw()

  const handleResize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', handleResize)
}

// 레이아웃이 home일 때만 실행
onMounted(() => {
  if (frontmatter.value.layout === 'home') {
    initSnow()
  }
})

// 페이지 전환 시 애니메이션 중지/재개 감시
watch(() => route.path, () => {
  if (frontmatter.value.layout === 'home') {
    if (!animationId) initSnow()
  } else {
    cancelAnimationFrame(animationId)
    animationId = null
  }
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<template>
  <ClientOnly>
    <canvas 
      v-if="frontmatter.layout === 'home'"
      ref="canvasRef" 
      class="snow-canvas"
    />
  </ClientOnly>
</template>

<style scoped>
.snow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
}
</style>