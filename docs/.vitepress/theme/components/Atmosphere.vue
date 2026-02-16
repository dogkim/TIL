<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

// 💡 쪼갠 파일에서 초기화와 그리기 함수를 모두 가져옵니다.
import { initSnowFlakes, snowEffect } from '../utils/snow.js'
import { initCherryPetals, cherryEffect } from '../utils/cherryBlossom.js'

const { frontmatter, isDark } = useData()
const route = useRoute()
const canvasRef = ref(null)

let animationId = null
let lastTime = 0
let flakes = [] // 입자 데이터를 담을 배열

const initParticles = (width, height) => {
  // 💡 테마에 맞춰 다른 초기화 함수를 호출합니다.
  if (isDark.value) {
    flakes = initSnowFlakes(120, width, height)
  } else {
    flakes = initCherryPetals(80, width, height)
  }
}

const draw = (currentTime) => {
  if (frontmatter.value.layout !== 'home') {
    animationId = null
    return
  }

  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  if (!lastTime) lastTime = currentTime
  const deltaTime = (currentTime - lastTime) / 1000
  if (deltaTime > 0.1) deltaTime = 0.1
  lastTime = currentTime

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  flakes.forEach(f => {
    if (isDark.value) {
      snowEffect(ctx, f, deltaTime, canvas)
    } else {
      cherryEffect(ctx, f, deltaTime, canvas)
    }
  })
  
  animationId = requestAnimationFrame(draw)
}

const start = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  initParticles(canvas.width, canvas.height)
  lastTime = 0
  
  if (animationId) cancelAnimationFrame(animationId)
  animationId = requestAnimationFrame(draw)
}

watch(
  [() => route.path, isDark], 
  () => {
    if (frontmatter.value.layout === 'home') {
      setTimeout(start, 100)
    } else {
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
      const ctx = canvasRef.value?.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, 
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('resize', start)
})

onUnmounted(() => {
  window.removeEventListener('resize', start)
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<template>
  <ClientOnly>
    <canvas 
      v-if="frontmatter.layout === 'home'" 
      ref="canvasRef" 
      class="atmosphere-canvas"
    />
  </ClientOnly>
</template>

<style scoped>
.atmosphere-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 100;
  display: block;
  transform: translateZ(0);
}
</style>