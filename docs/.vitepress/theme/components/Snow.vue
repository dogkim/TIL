<script setup>
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'

const { frontmatter } = useData()
const route = useRoute()
let snowContainer = null

// 1. GSAP 로드 (기존 유지)
const loadGSAP = () => {
  return new Promise((resolve) => {
    if (window.gsap) return resolve(window.gsap)
    const script = document.createElement('script')
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
    script.onload = () => resolve(window.gsap)
    document.head.appendChild(script)
  })
}

// 2. 눈송이 생성
const createFlake = (gsap, container) => {
  const flake = document.createElement('div')
  flake.innerHTML = '●'
  flake.style.cssText = `
    position: absolute; color: white; text-shadow: 0 0 5px #fff;
    opacity: ${0.2 + Math.random() * 0.7};
    font-size: ${3 + Math.random() * 4}px;
    top: -20px;
    will-change: transform;
  `
  container.appendChild(flake)

  gsap.to(flake, {
    duration: 5 + Math.random() * 10,
    y: window.innerHeight + 50,
    x: "+=" + (Math.random() * 200 - 100),
    left: Math.random() * 100 + "%", // 초기 가로 위치를 %로 지정
    repeat: -1,
    ease: "none",
    delay: Math.random() * 5
  })
}

// 3. 눈 시작 로직 (안정성 강화)
const initSnow = async () => {
  // 이미 컨테이너가 있거나 메인이 아니면 중단
  if (document.getElementById('snow-container') || frontmatter.value.layout !== 'home') return

  const gsap = await loadGSAP()
  
  // 컨테이너 생성 및 스타일 부여
  snowContainer = document.createElement('div')
  snowContainer.id = 'snow-container'
  snowContainer.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 9999; overflow: hidden;
  `
  document.body.appendChild(snowContainer)
  
  // 눈송이 개수 생성
  for (let i = 0; i < 70; i++) {
    createFlake(gsap, snowContainer)
  }
}

// 4. 눈 제거 로직
const clearSnow = () => {
  const existingContainer = document.getElementById('snow-container')
  if (existingContainer) {
    existingContainer.remove()
    snowContainer = null
  }
}

// 마운트 시 실행
onMounted(() => {
  // 약간의 지연을 주어 frontmatter 로드를 기다림
  setTimeout(() => initSnow(), 100)
})

// 경로 변경 감시
watch(
  () => route.path,
  async () => {
    await nextTick()
    if (frontmatter.value.layout === 'home') {
      initSnow()
    } else {
      clearSnow()
    }
  },
  { immediate: true }
)

onUnmounted(() => clearSnow())
</script>

<template>
  </template>