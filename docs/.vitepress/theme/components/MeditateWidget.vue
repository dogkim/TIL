<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { withBase } from 'vitepress'

const TRACKS = [
  { name: 'Peacefully', src: withBase('/audio/peacefully.mp3') },
  { name: 'Three Wise People', src: withBase('/audio/three-wise-people.mp3') },
]

const trackIndex = ref(0)
const playing = ref(false)
const audioEl = ref(null)
const volume = ref(0.35) // 기본 음량은 낮게, 슬라이더로 키울 수 있음
const bump = reactive({ cup: false, coaster: false, bell: false })

function onVolumeInput() {
  if (audioEl.value) audioEl.value.volume = volume.value
}

function tryAutoplay() {
  if (!audioEl.value) return
  audioEl.value.volume = volume.value
  audioEl.value.play().then(() => {
    playing.value = true
  }).catch(() => {
    // 브라우저 자동재생 정책에 막히면, 첫 클릭/키 입력 때 한 번만 재시도
    const retry = () => {
      audioEl.value?.play().then(() => { playing.value = true }).catch(() => {})
      window.removeEventListener('pointerdown', retry)
      window.removeEventListener('keydown', retry)
    }
    window.addEventListener('pointerdown', retry, { once: true })
    window.addEventListener('keydown', retry, { once: true })
  })
}

function toggleMusic() {
  if (!audioEl.value) return
  audioEl.value.volume = volume.value
  if (playing.value) {
    audioEl.value.pause()
    playing.value = false
  } else {
    audioEl.value.play().then(() => { playing.value = true }).catch(() => {})
  }
}

async function onEnded() {
  trackIndex.value = (trackIndex.value + 1) % TRACKS.length
  // Vue가 :src 바인딩을 실제 DOM에 반영할 때까지 기다린 뒤에 readyState를 확인해야 함 —
  // 그 전에 확인하면 아직 이전 트랙의 상태를 보게 되어 판단이 어긋남
  await nextTick()
  const el = audioEl.value
  if (!el) return
  // src가 바뀐 뒤 재생 가능해질 때까지 기다렸다가 재생 (너무 이르게 play()를 부르면
  // 브라우저가 조용히 실패시켜서 다음 곡이 안 들리는 문제가 있었음)
  const start = () => {
    el.volume = volume.value
    el.play().then(() => { playing.value = true }).catch(() => {})
  }
  if (el.readyState >= 2) {
    start()
  } else {
    el.addEventListener('canplay', start, { once: true })
  }
}

onMounted(() => {
  if (audioEl.value) audioEl.value.volume = volume.value
  tryAutoplay()
  checkSfxAvailability()
})

// --- 효과음: 외부 음원 없이 Web Audio API로 직접 합성 (파일 받으면 교체 예정) ---
let audioCtx = null
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function tone(freq, duration, type, peak, delay = 0) {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  const start = ac.currentTime + delay
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

// 나중에 실제 효과음 파일을 받으면 이 이름으로 docs/public/audio/ 에 넣기만 하면
// 자동으로 합성음 대신 재생됨 (파일이 없으면 조용히 지금의 합성음으로 대체)
const SFX_FILES = {
  bell: withBase('/audio/sfx-bell.mp3'),
  cup: withBase('/audio/sfx-cup.mp3'),
  coaster: withBase('/audio/sfx-coaster.mp3'),
  clatter: withBase('/audio/sfx-clatter.mp3'),
}
const sfxAvailable = reactive({ bell: false, cup: false, coaster: false, clatter: false })

async function checkSfxAvailability() {
  await Promise.all(Object.entries(SFX_FILES).map(async ([key, src]) => {
    try {
      const res = await fetch(src, { method: 'HEAD' })
      // 개발 서버는 없는 경로도 SPA 폴백으로 200(HTML)을 돌려주는 경우가 있어,
      // content-type이 실제 오디오인지까지 확인해야 오탐이 없음
      const type = res.headers.get('content-type') || ''
      sfxAvailable[key] = res.ok && type.includes('audio')
    } catch {
      sfxAvailable[key] = false
    }
  }))
}

function playSample(src, vol = 0.7) {
  const a = new Audio(src)
  a.volume = vol
  a.play().catch(() => {})
}

function playBell() {
  if (sfxAvailable.bell) return playSample(SFX_FILES.bell)
  tone(880, 1.4, 'sine', 0.28)
  tone(1760, 1.1, 'sine', 0.07)
}
function playCup() {
  if (sfxAvailable.cup) return playSample(SFX_FILES.cup)
  tone(1500, 0.16, 'sine', 0.22)
  tone(2250, 0.1, 'triangle', 0.08)
}
function playCoaster() {
  if (sfxAvailable.coaster) return playSample(SFX_FILES.coaster)
  tone(170, 0.12, 'triangle', 0.3)
  tone(90, 0.1, 'sine', 0.2)
}
// 컵을 컵받침에 내려놓을 때 "덜그덕"
function playClatter() {
  if (sfxAvailable.clatter) return playSample(SFX_FILES.clatter)
  tone(1500, 0.14, 'sine', 0.18)
  tone(2200, 0.09, 'triangle', 0.06, 0.02)
  tone(180, 0.1, 'triangle', 0.25, 0.03)
  tone(95, 0.09, 'sine', 0.18, 0.04)
}
// 수저로 컵을 치는 소리 (실제 음원 사용)
const CUP_HIT_SRC = withBase('/audio/cup-hit.mp3')
function playSpoonTap() {
  playSample(CUP_HIT_SRC)
}

const SOUND = { cup: playCup, coaster: playCoaster, bell: playBell }

function hit(name) {
  SOUND[name]()
  bump[name] = true
  setTimeout(() => { bump[name] = false }, 260)
}

// --- 종을 여러 번 치면 대사가 뜸 / 입장하면 바텐더가 먼저 말을 걺 ---
const BELL_LINES = [
  '네, 손님!',
  '잠시만요~',
  '지금 나갑니다!',
  '그렇게 급하세요?',
  '한 번만 더 치시면 진짜 옵니다',
  '...아직도 안 옴',
]
// 입장하면 바텐더가 인사 한 마디 + "그거 아세요?" 토막상식 한 마디, 항상 이 플롯으로 고정
const GREETING_OPENER = '어서 오세요, 손님.'
// 에세이 주제를 담은 토막상식 (5개, 무작위) — 인사 뒤 / 이후 반복되는 혼잣말 모두 여기서 고름
const TRIVIA_LINES = [
  '그거 아세요? 카뮈는 시지프스가 행복하다고 상상해야 한다고 했대요. 평생 바위나 굴리는 사람인데 말이죠.',
  '그거 아세요? 우리는 태어날 때부터 정해진 목적이 없대요. 그래서 매번 스스로 정해야 한다나 봐요.',
  '그거 아세요? 철학에서 말하는 "정보"랑 컴퓨터공학에서 말하는 "정보"는 완전히 다른 뜻이래요.',
  '그거 아세요? 페스트 속 의사는 신념 때문이 아니라, 그냥 그게 자기 일이라 끝까지 싸웠대요.',
  '그거 아세요? 부조리는 세상 탓도 우리 탓도 아니고, 그 둘 사이 틈에서 생기는 거래요.',
]
const INTRO_LINES = [GREETING_OPENER, TRIVIA_LINES[Math.floor(Math.random() * TRIVIA_LINES.length)]]
const BELL_REACTION_LINES = [
  '네, 손님!',
  '잠시만요~',
  '지금 나갑니다!',
  '그렇게 급하세요?',
  '한 번만 더 치시면 진짜 옵니다',
  '...아직도 안 옴',
]

const bellLine = ref('')
const bellLineVisible = ref(false)
const bellLinePos = reactive({ top: 18, left: 50 }) // % 단위
let bellLineHideTimer = null

// 벽 상단의 무작위 위치에 한 문장을 띄움
function showLine(text, visibleMs = 1700) {
  bellLine.value = text
  bellLinePos.top = 6 + Math.random() * 16 // 6~22%
  bellLinePos.left = 20 + Math.random() * 60 // 20~80%
  bellLineVisible.value = true
  clearTimeout(bellLineHideTimer)
  bellLineHideTimer = setTimeout(() => { bellLineVisible.value = false }, visibleMs)
}

// 직전과 다른 문장을 무작위로 골라 보여주는 공용 로직 (종소리 반응, 혼잣말 등에서 재사용)
function makeLineSayer(lines, visibleMs = 1700) {
  let lastIdx = -1
  return () => {
    let idx = Math.floor(Math.random() * lines.length)
    if (lines.length > 1 && idx === lastIdx) {
      idx = (idx + 1) % lines.length
    }
    lastIdx = idx
    showLine(lines[idx], visibleMs)
  }
}
const sayBellLine = makeLineSayer(BELL_REACTION_LINES)
const sayAmbient = makeLineSayer(TRIVIA_LINES, 5500)

function ringBell() {
  hit('bell')
  sayBellLine()
}

// 입장 인사: 문장을 하나씩 순서대로 이어서 보여주다가, 다 끝나면 뜸한 간격의
// 무작위 혼잣말 사이클로 넘어감 (천천히 읽을 수 있도록 느긋한 템포)
const INTRO_LINE_MS = 4200
const INTRO_GAP_MS = 900
let introTimer = null
let ambientTimer = null

function scheduleAmbient() {
  const delay = 25000 + Math.random() * 20000 // 25~45초 간격
  ambientTimer = setTimeout(() => {
    sayAmbient()
    scheduleAmbient()
  }, delay)
}

function playIntro(i = 0) {
  if (i >= INTRO_LINES.length) {
    scheduleAmbient()
    return
  }
  showLine(INTRO_LINES[i], INTRO_LINE_MS)
  introTimer = setTimeout(() => playIntro(i + 1), INTRO_LINE_MS + INTRO_GAP_MS)
}

// --- 컵 드래그 (컵받침 위에 놓으면 달그락, 테이블 밖으로는 못 나감) ---
const tableEl = ref(null)
const cupEl = ref(null)
const cupPos = reactive({ x: 0, y: 0 })
const cupDragging = ref(false)
let cupDrag = null

// 드래그 중인 요소가 테이블 영역을 벗어나지 않도록 위치를 보정
function clampToTable(startRect, rawLeft, rawTop) {
  const t = tableEl.value?.getBoundingClientRect()
  if (!t) return { left: rawLeft, top: rawTop }
  const minLeft = t.left
  const maxLeft = t.right - startRect.width
  const minTop = t.top
  const maxTop = t.bottom - startRect.height
  return {
    left: Math.min(Math.max(rawLeft, minLeft), maxLeft),
    top: Math.min(Math.max(rawTop, minTop), maxTop),
  }
}

function onCupPointerDown(e) {
  cupDragging.value = true
  cupDrag = {
    px: e.clientX,
    py: e.clientY,
    ox: cupPos.x,
    oy: cupPos.y,
    startRect: cupEl.value.getBoundingClientRect(),
  }
}
function onCupPointerMove(e) {
  if (!cupDrag) return
  const rawLeft = cupDrag.startRect.left + (e.clientX - cupDrag.px)
  const rawTop = cupDrag.startRect.top + (e.clientY - cupDrag.py)
  const { left, top } = clampToTable(cupDrag.startRect, rawLeft, rawTop)
  cupPos.x = cupDrag.ox + (left - cupDrag.startRect.left)
  cupPos.y = cupDrag.oy + (top - cupDrag.startRect.top)
}
function onCupPointerUp() {
  if (!cupDrag) return
  cupDrag = null
  cupDragging.value = false
  if (Math.abs(cupPos.x) < 26 && Math.abs(cupPos.y) < 26) {
    cupPos.x = 0
    cupPos.y = 0
    playClatter()
    bump.coaster = true
    setTimeout(() => { bump.coaster = false }, 260)
  }
}

// --- 수저 드래그 (컵 근처에 놓으면 쨍) ---
const spoonEl = ref(null)
const spoonPos = reactive({ x: 0, y: 0 })
const spoonDragging = ref(false)
let spoonDrag = null
let spoonTouchingCup = false // 접촉 중 반복 재생 방지용 플래그

// 점(좌표 하나) 기준으로 판정하면 정확히 그 지점을 맞춰야 해서 치기 어려웠음.
// 대신 컵의 중앙 세로선과 수저의 중앙 세로선 사이의 좌우 거리만 보고 판정해서,
// 좌우로 움직이기만 하면 쉽게 닿고 뗄 수 있게 함.
function spoonCupDistance() {
  if (!spoonEl.value || !cupEl.value) return { dist: Infinity, threshold: 0 }
  const s = spoonEl.value.getBoundingClientRect()
  const c = cupEl.value.getBoundingClientRect()
  const sx = s.left + s.width / 2
  const cx = c.left + c.width / 2
  return { dist: Math.abs(sx - cx), threshold: 34 }
}

function onSpoonPointerDown(e) {
  spoonDragging.value = true
  spoonTouchingCup = false
  spoonDrag = {
    px: e.clientX,
    py: e.clientY,
    ox: spoonPos.x,
    oy: spoonPos.y,
    startRect: spoonEl.value.getBoundingClientRect(),
  }
}
function onSpoonPointerMove(e) {
  if (!spoonDrag) return
  const rawLeft = spoonDrag.startRect.left + (e.clientX - spoonDrag.px)
  const rawTop = spoonDrag.startRect.top + (e.clientY - spoonDrag.py)
  const { left, top } = clampToTable(spoonDrag.startRect, rawLeft, rawTop)
  spoonPos.x = spoonDrag.ox + (left - spoonDrag.startRect.left)
  spoonPos.y = spoonDrag.oy + (top - spoonDrag.startRect.top)

  // 들고 있는 동안 컵에 닿을 때마다(진입 순간에만) 소리
  const { dist, threshold } = spoonCupDistance()
  if (dist < threshold) {
    if (!spoonTouchingCup) {
      spoonTouchingCup = true
      playSpoonTap()
      bump.cup = true
      setTimeout(() => { bump.cup = false }, 200)
    }
  } else {
    spoonTouchingCup = false
  }
}
function onSpoonPointerUp() {
  if (!spoonDrag) return
  spoonDrag = null
  spoonDragging.value = false
  spoonTouchingCup = false
  // 수저는 항상 제자리로 돌아감
  spoonPos.x = 0
  spoonPos.y = 0
}

function onPointerMove(e) {
  onCupPointerMove(e)
  onSpoonPointerMove(e)
}
function onPointerUp() {
  onCupPointerUp()
  onSpoonPointerUp()
}

onMounted(() => {
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  // 들어오고 바로가 아니라, 바텐더가 손님을 알아차린 듯한 자연스러운 텀을 두고 인사
  setTimeout(() => playIntro(), 1300)
})
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  clearTimeout(bellLineHideTimer)
  clearTimeout(introTimer)
  clearTimeout(ambientTimer)
})
</script>

<template>
  <div class="lounge">
    <div class="title-bar">
      <button class="play-toggle" @click="toggleMusic" :aria-label="playing ? '일시정지' : '재생'">
        {{ playing ? '⏸' : '▶' }}
      </button>
      <span class="track-name">♪ {{ TRACKS[trackIndex].name }}</span>
    </div>

    <div class="scene">
      <div class="wall">
        <img :src="withBase('/images/bar-wall.jpg')" alt="" class="wall-img" />
        <div
          class="wall-voice"
          :class="{ show: bellLineVisible }"
          :style="{ top: bellLinePos.top + '%', left: bellLinePos.left + '%' }"
        >{{ bellLine }}</div>
      </div>

      <div class="vol-vertical">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          orient="vertical"
          v-model.number="volume"
          @input="onVolumeInput"
          aria-label="음량 조절"
        />
        <span class="vol-icon">🔈</span>
      </div>

      <div class="table" ref="tableEl">
        <img :src="withBase('/images/table.png')" alt="" class="table-img" />

        <button class="item bell" :class="{ bump: bump.bell }" @click="ringBell" aria-label="종">
          <img :src="withBase('/images/bell.png')" alt="" />
        </button>

        <div class="cup-spoon-group">
          <div class="coaster-slot">
            <button class="item coaster" :class="{ bump: bump.coaster }" @click="hit('coaster')" aria-label="컵받침">
              <img :src="withBase('/images/coaster.png')" alt="" />
            </button>

            <button
              ref="cupEl"
              class="item cup"
              :class="{ bump: bump.cup, dragging: cupDragging }"
              :style="{ transform: `translate(${cupPos.x}px, ${cupPos.y}px)` }"
              @pointerdown="onCupPointerDown"
              @click="hit('cup')"
              aria-label="컵"
            >
              <img :src="withBase('/images/cup.png')" alt="" />
            </button>
          </div>

          <button
            ref="spoonEl"
            class="item spoon"
            :class="{ dragging: spoonDragging }"
            :style="{ transform: `translate(${spoonPos.x}px, ${spoonPos.y}px)` }"
            @pointerdown="onSpoonPointerDown"
            aria-label="수저"
          >
            <img :src="withBase('/images/spoon.png')" alt="" />
          </button>
        </div>
      </div>
    </div>

    <audio ref="audioEl" :src="TRACKS[trackIndex].src" @ended="onEnded" />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap');

.lounge {
  min-height: calc(100vh - 57px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 20px;
}

.title-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--home-muted);
}
.play-toggle {
  border: 1px solid var(--home-line);
  background: var(--home-panel);
  color: var(--home-text);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.play-toggle:hover {
  border-color: var(--home-accent);
  color: var(--home-accent);
}

.scene {
  position: relative;
  width: min(96vw, 1200px);
  flex: 1;
  min-height: 420px;
  max-height: 78vh;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 50px -18px rgba(0, 0, 0, 0.55);
}

.wall {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #1c130a 0%, #140d07 55%, #0d0804 100%);
}
.wall-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 22%;
}
.wall-voice {
  position: absolute;
  z-index: 2;
  max-width: 62%;
  font-family: 'Gowun Batang', 'Noto Serif KR', serif;
  font-size: 20px;
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: rgba(255, 245, 228, 0.95);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 200, 120, 0.25);
  opacity: 0;
  transform: translate(-50%, -50%) translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease, top 0.3s ease, left 0.3s ease;
  pointer-events: none;
  text-align: center;
}
.wall-voice.show {
  opacity: 1;
  transform: translate(-50%, -50%) translateY(0);
}

.vol-vertical {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 5;
}
.vol-vertical input[type='range'] {
  writing-mode: vertical-lr;
  direction: rtl;
  appearance: slider-vertical;
  width: 6px;
  height: 110px;
  accent-color: var(--home-accent);
}
.vol-icon {
  font-size: 13px;
}

.table {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 32%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 20px 24px;
  background: linear-gradient(180deg, #b8895a, #9c6c40); /* 이미지 로드 전/실패 시 대체 배경 */
}
/* 실제 배치처럼 종은 구석에 두고, 컵/수저는 오른쪽에 붙여서 모아둠 */
.item.bell {
  position: absolute;
  top: 0;
  left: 0;
}
.cup-spoon-group {
  display: flex;
  align-items: flex-start;
  gap: 32px;
}
.table-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
  pointer-events: none;
  z-index: 0;
}

.item {
  position: relative;
  z-index: 1;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s ease;
}
.coaster-slot {
  position: relative;
  width: 160px;
  height: 137px;
}
.item.coaster {
  width: 160px;
  height: 137px;
}
.item.bell {
  width: 152px;
  height: 143px;
}
.item.spoon {
  width: 44px;
  height: 152px;
  touch-action: none;
  cursor: grab;
  align-self: flex-end;
  z-index: 2; /* 드래그로 옮겨져 다른 물건 뒤에 깔려도 항상 집을 수 있게 */
}
.item.spoon.dragging {
  cursor: grabbing;
  z-index: 10;
  transition: none;
}
.item.cup {
  position: absolute;
  top: -5px;
  left: 17px;
  width: 128px;
  height: 110px;
  touch-action: none;
  cursor: grab;
  z-index: 2; /* 드래그로 종/컵받침 뒤에 깔려도 항상 집을 수 있게 */
}
.item.cup.dragging {
  cursor: grabbing;
  z-index: 10;
  transition: none;
}
.item:not(.cup):not(.spoon):hover {
  transform: scale(1.08);
}
.item svg,
.item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 6px 6px rgba(0, 0, 0, 0.35));
  pointer-events: none;
}
.item.bump {
  animation: bump 0.26s ease;
}
.item.cup.bump {
  animation: none;
}
@keyframes bump {
  0% { transform: scale(1); }
  35% { transform: scale(0.86) rotate(-4deg); }
  70% { transform: scale(1.12) rotate(3deg); }
  100% { transform: scale(1); }
}

/* 좁은 화면(휴대폰)에서는 컵받침+종+수저 폭 합이 테이블 폭을 넘어서 겹치므로 축소 */
@media (max-width: 767px) {
  .table {
    padding: 14px 12px;
  }
  .coaster-slot,
  .item.coaster {
    width: 117px;
    height: 100px;
  }
  .item.bell {
    width: 111px;
    height: 104px;
  }
  .item.spoon {
    width: 32px;
    height: 111px;
  }
  .item.cup {
    top: -4px;
    left: 12px;
    width: 93px;
    height: 80px;
  }
  .wall-voice {
    font-size: 16px;
    line-height: 1.45;
    max-width: 84%;
  }
}

/* 웹(모바일 아님)에서만: 종을 구석에서 살짝 띄우고, 배경도 천장 대신 조명/선반이 보이게 */
@media (min-width: 768px) {
  .item.bell {
    top: -26px;
    left: 64px;
  }
  .cup-spoon-group {
    margin-right: 28px;
  }
  .wall-img {
    object-position: center 45%;
  }
}

</style>
