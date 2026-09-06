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
const BELL_REACTION_LINES = [
  '네, 손님!',
  '잠시만요~',
  '지금 나갑니다!',
  '그렇게 급하세요?',
  '한 번만 더 치시면 진짜 옵니다',
  '...아직도 안 옴',
]

// 입장 인사: [인사 1개(고정)] → [무작위 토막상식 hook 1개] → [그 상식에 대한 설명 2~3개] 순서로 고정된 플롯
const GREETING = '안녕하세요.'
// 토막상식 7종 — 처음 듣는 사람도 이해할 수 있도록 배경 설명을 붙였고, TIL에 있는
// 주제(카뮈, 정보의 이중성, 페스트)뿐 아니라 그 밖의 철학 이야기도 섞음
const TOPICS = [
  {
    hook: '그거 아세요? 배 부품을 하나씩 다 바꾸면, 그 배는 원래 배랑 같은 걸까요 다른 걸까요?',
    detail: [
      '고대 그리스 때부터 내려오는 유명한 철학 질문이에요. "테세우스의 배"라고 불러요.',
      '판자를 하나씩 새 걸로 갈다가 결국 원래 부품이 하나도 안 남으면, 그래도 같은 배라고 할 수 있을지 묻는 거죠.',
      '우리 몸도 세포가 계속 바뀌는데, 그럼 저도 어릴 때랑 같은 사람인 걸까 싶기도 하더라고요.',
    ],
  },
  {
    hook: '그거 아세요? 알베르 카뮈라는 프랑스 작가가, 벌 받는 사람이 오히려 행복할 수 있다고 했어요.',
    detail: [
      '그리스 신화 속 시지프스는 평생 바위를 산 위로 밀어 올려야 하는 벌을 받은 사람이에요.',
      '바위는 정상에 닿는 순간 다시 굴러떨어지는데, 카뮈는 그래도 다시 밀러 올라가는 그를 행복하다고 상상해야 한다고 했어요.',
      '포기하지 않고 계속하는 태도 자체가 일종의 반항이자, 삶에 대한 긍정이라는 거죠.',
    ],
  },
  {
    hook: '그거 아세요? 철학에서 말하는 "정보"랑 컴퓨터공학에서 말하는 "정보"는 사실 완전히 다른 뜻이에요.',
    detail: [
      '철학 쪽에서는 정보를 의미나 해석의 문제로 다뤄요. 그게 무슨 뜻이고 어떻게 받아들여지는지가 중요하죠.',
      '반면 컴퓨터공학 쪽에서는 정보를 그냥 0과 1, 비트의 나열로 봐요. 뜻은 상관없이 양으로만 계산하는 거예요.',
      '같은 단어인데도 어떤 학문의 언어로 보느냐에 따라 완전히 다른 세계가 되더라고요.',
    ],
  },
  {
    hook: '그거 아세요? 프랑스 철학자 데카르트는 세상 모든 걸 의심하다가, 딱 하나만은 의심할 수 없었대요.',
    detail: [
      '바로 "지금 의심하고 있는 나" 자체예요. 다른 건 다 가짜일 수 있어도, 의심하는 행위를 하는 나는 있어야 하니까요.',
      '그래서 나온 말이 "나는 생각한다, 고로 존재한다"예요. 아마 한 번쯤 들어보셨을 거예요.',
    ],
  },
  {
    hook: '그거 아세요? "트롤리 문제"라는 유명한 딜레마는 아직도 정답이 안 정해졌어요.',
    detail: [
      '브레이크가 고장 난 기차가 달려오는데, 그대로 두면 다섯 명이 죽고 선로를 바꾸면 다른 한 명이 죽어요. 손님이라면 선로를 바꾸실 건가요?',
      '숫자로만 보면 한 명을 희생하는 게 나아 보이는데, 막상 내 손으로 선로를 바꿔야 한다고 하면 다들 망설이더라고요.',
      '결과가 중요한지, 아니면 내가 직접 한 행동인지가 중요한지 — 지금도 계속 논쟁이 되는 질문이에요.',
    ],
  },
  {
    hook: '그거 아세요? 독일 철학자 니체는 이런 상상을 한번 해보라고 했어요.',
    detail: [
      '지금 이 순간, 그리고 지금까지의 내 삶 전체가 토씨 하나 안 틀리고 영원히 반복된다면 어떨 것 같으세요?',
      '"영원회귀"라고 부르는 개념인데, 그 상상 앞에서도 "그래도 좋다"고 말할 수 있는 삶을 살고 있는지 스스로 묻게 만드는 질문이에요.',
    ],
  },
  {
    hook: '그거 아세요? 카뮈의 소설 "페스트"에 나오는 의사는, 신념이 아니라 그냥 그게 자기 일이라서 끝까지 싸워요.',
    detail: [
      '전염병이 도시를 덮쳐서 다들 도망치거나 절망하는 와중에도, 그 의사는 담담하게 환자를 돌보는 자기 자리를 지켜요.',
      '거창한 이유나 신념 없이도, 맡은 일을 묵묵히 해내는 것 자체가 하나의 반항이 될 수 있다는 거예요.',
      '카뮈는 이런 태도를 "성실함"이라고 불렀어요.',
    ],
  },
]
// 인사가 끝난 뒤 뜸을 들이며 반복되는 혼잣말 — 주변 소음 묘사 + 바텐더의 가벼운 잡담 +
// 가볍게 던져보는 윤리적 딜레마/철학적 질문을 섞음
const AMBIENT_LINES = [
  '저 뒤에서 잔 부딪히는 소리가 나네요.',
  '누가 웃고 있나 봐요, 저쪽이 시끌시끌하네요.',
  '스피커에서 흘러나오는 노래가 오늘따라 좋네요.',
  '문 열리는 소리, 누가 또 들어왔나 봐요.',
  '손님, 잔 비었으면 말씀하세요.',
  '오늘따라 손이 느적느적하네요, 죄송해요.',
  '이 자리 조명이 딱 좋죠? 제가 제일 좋아하는 자리예요.',
  '가끔은 아무 말 안 해도 괜찮아요.',
  '손님, 다섯 명을 살리려고 한 명을 희생시켜도 괜찮은 걸까요?',
  '거짓말이어도, 그게 누군가를 행복하게 한다면 해도 되는 걸까요?',
  '손님의 기억을 전부 지우고 새로 산다면, 그래도 지금의 손님이라고 할 수 있을까요?',
  '완전히 들키지 않는다면, 그때도 옳은 일을 하실 건가요?',
  '지금 이 순간이 사실 정교한 시뮬레이션이 아니라고, 확신할 수 있으세요?',
  '자유롭다는 건 아무한테도 책임질 필요가 없다는 뜻일까요, 아니면 그 반대일까요?',
  '손님을 손님답게 만드는 게 기억일까요, 아니면 몸일까요?',
]

const bellLine = ref('')
const bellLineVisible = ref(false)
// 화면 밖으로 나가거나 눈이 못 쫓아갈 만큼 넓게 흔들리진 않도록, 기준 위치를
// 중심으로 좁은 범위 안에서만 좌우/상하로 살짝 흔듦
const TOP_BASE_DESKTOP = 20 // %
const TOP_BASE_MOBILE = 28 // %
const TOP_JITTER = 5 // 기준 위치 ± %
const LEFT_JITTER = 8 // 기준(50%) 위치 ± %
const bellLinePos = reactive({ top: TOP_BASE_DESKTOP, left: 50 })
let bellLineHideTimer = null

function showLine(text, visibleMs = 1700) {
  bellLine.value = text
  const topBase = window.matchMedia('(max-width: 767px)').matches ? TOP_BASE_MOBILE : TOP_BASE_DESKTOP
  bellLinePos.top = topBase + (Math.random() * TOP_JITTER * 2 - TOP_JITTER)
  bellLinePos.left = 50 + (Math.random() * LEFT_JITTER * 2 - LEFT_JITTER)
  bellLineVisible.value = true
  clearTimeout(bellLineHideTimer)
  bellLineHideTimer = setTimeout(() => { bellLineVisible.value = false }, visibleMs)
}

// 직전과 다른 인덱스를 무작위로 골라줌 (같은 문장이 두 번 연달아 나오는 걸 방지)
function pickIndexAvoiding(length, lastIdx) {
  let idx = Math.floor(Math.random() * length)
  if (length > 1 && idx === lastIdx) {
    idx = (idx + 1) % length
  }
  return idx
}

// 직전과 다른 문장을 무작위로 골라 보여주는 공용 로직 (종소리 반응, 혼잣말 등에서 재사용)
function makeLineSayer(lines, visibleMs = 1700) {
  let lastIdx = -1
  return () => {
    lastIdx = pickIndexAvoiding(lines.length, lastIdx)
    showLine(lines[lastIdx], visibleMs)
  }
}
const sayBellLine = makeLineSayer(BELL_REACTION_LINES)
const sayAmbient = makeLineSayer(AMBIENT_LINES, 6500)

function ringBell() {
  hit('bell')
  sayBellLine()
}

// 입장 인사: 문장을 하나씩 순서대로 이어서 보여주다가, 다 끝나면 뜸한 간격의
// 무작위 혼잣말 사이클로 넘어감 (천천히 읽을 수 있도록 느긋한 템포)
const INTRO_LINE_MS = 6200
const INTRO_GAP_MS = 1400
let introTimer = null
let ambientTimer = null
let lastTopicIdx = -1

function scheduleAmbient() {
  const delay = 25000 + Math.random() * 20000 // 25~45초 간격
  ambientTimer = setTimeout(() => {
    sayAmbient()
    scheduleAmbient()
  }, delay)
}

function playSequence(lines, i = 0) {
  if (i >= lines.length) {
    scheduleAmbient()
    return
  }
  showLine(lines[i], INTRO_LINE_MS)
  introTimer = setTimeout(() => playSequence(lines, i + 1), INTRO_LINE_MS + INTRO_GAP_MS)
}

function playIntro() {
  lastTopicIdx = pickIndexAvoiding(TOPICS.length, lastTopicIdx)
  const topic = TOPICS[lastTopicIdx]
  playSequence([GREETING, topic.hook, ...topic.detail])
}

// --- 컵 드래그 (컵받침 위에 놓으면 달그락, 테이블 밖으로는 못 나감) ---
const tableEl = ref(null)
const cupEl = ref(null)
const cupPos = reactive({ x: 0, y: 0 })
const cupDragging = ref(false)
let cupDrag = null

// 드래그 중인 요소가 테이블 영역을 벗어나지 않도록 위치를 보정
// topOvershoot: 실제로는 바닥(컵의 아랫부분)만 테이블에 닿으면 되는 물건(컵)을 위해,
// 테이블 위쪽 경계보다 조금 더 위로 올라갈 수 있게 허용하는 값(px)
function clampToTable(startRect, rawLeft, rawTop, topOvershoot = 0) {
  const t = tableEl.value?.getBoundingClientRect()
  if (!t) return { left: rawLeft, top: rawTop }
  const minLeft = t.left
  const maxLeft = t.right - startRect.width
  const minTop = t.top - topOvershoot
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
  // 컵은 바닥만 테이블에 닿아 있으면 되니 몸통 대부분(위쪽 75%)은 테이블 경계 위로 올라가도 됨
  const { left, top } = clampToTable(cupDrag.startRect, rawLeft, rawTop, cupDrag.startRect.height * 0.75)
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
        <div class="wall-overlay" />
        <div
          class="wall-voice"
          :class="{ show: bellLineVisible }"
          :style="{ top: bellLinePos.top + '%', left: bellLinePos.left + '%' }"
        >{{ bellLine }}</div>
      </div>

      <div class="vol-horizontal">
        <span class="vol-icon">🔈</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model.number="volume"
          @input="onVolumeInput"
          aria-label="음량 조절"
        />
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
/* 글씨가 배경 사진 위 어디서든 잘 보이도록 벽 전체에 살짝 어둡게 깔아줌 */
.wall-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  pointer-events: none;
  z-index: 1;
}
.wall-voice {
  /* top/left는 JS(bellLinePos)에서 인라인으로 지정 — 여긴 값이 없을 때의 대체값 */
  position: absolute;
  top: 20%;
  left: 50%;
  z-index: 2;
  max-width: 62%;
  font-family: 'Gowun Batang', 'Noto Serif KR', serif;
  font-size: 20px;
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: rgba(255, 245, 228, 0.95);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  opacity: 0;
  transform: translate(-50%, -50%) translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease, left 0.3s ease;
  pointer-events: none;
  text-align: center;
}
.wall-voice.show {
  opacity: 1;
  transform: translate(-50%, -50%) translateY(0);
}

.vol-horizontal {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 5;
}
.vol-horizontal input[type='range'] {
  width: 100px;
  height: 4px;
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
  z-index: 3; /* 컵/수저(z-index:2)에 가려지지 않도록 항상 그 위에 그려지게 */
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

/* 웹(모바일 아님)에서만: 종을 구석에서 더 띄우고, 컵/수저도 딱 맞춰놓은 듯한 느낌을 빼고,
   배경도 천장 대신 조명/선반이 더 보이게 */
@media (min-width: 768px) {
  .item.bell {
    top: -26px;
    left: 108px;
  }
  .cup-spoon-group {
    margin-right: 28px;
  }
  .coaster-slot {
    transform: rotate(-3deg);
  }
  .item.spoon img {
    transform: rotate(11deg);
  }
  .wall-img {
    object-position: center 64%;
  }
}

</style>
