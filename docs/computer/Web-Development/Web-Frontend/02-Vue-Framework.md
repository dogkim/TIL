## Vue란

JS만으로 복잡한 화면을 짜면 코드가 지저분해지므로, Vue는 화면을 **컴포넌트**라는 작은 부품 단위로 나눠서 조립하는 방법을 제공하는 프레임워크다. 컴포넌트 하나 = `.vue` 파일 하나 = template(HTML) + script(JS) + style(CSS)을 한 곳에 묶은 것(**SFC, Single File Component**).

```vue
<template>
  <h1 :style="{color: myColor}">{{ title }}</h1>
</template>

<script setup>
const title = "안녕"
const myColor = "blue"
</script>

<style scoped>
h1 { font-size: 24px; }
</style>
```

React, Angular, Svelte도 같은 급(JS 기반 UI 프레임워크)의 경쟁 도구다.

## .vue 파일이 쪼개지는 원리

**브라우저는 `.vue` 파일을 전혀 이해하지 못한다.** 쪼개고 변환하는 건 [[03-Vite-Build-Tool|Vite]] 안에 들어있는 `@vitejs/plugin-vue`라는 컴파일러이며, 이 작업은 **브라우저에 도달하기 전, 빌드 시점에** 끝난다.

```
1. 개발자가 .vue 작성 (template+script+style 섞여있음)
                ↓ (Vite가 빌드 시점에 처리)
2. template → JS 함수(render function)로 변환
   script    → 그대로 JS 모듈로
   style     → 별도 CSS로 추출
                ↓
3. 셋을 다시 하나의 순수 JS 모듈(+CSS)로 합침
                ↓
4. 이 결과물만 브라우저로 전달 — 브라우저는 .vue의 존재 자체를 모름
```

`<style scoped>`의 `scoped`는 "이 스타일은 이 컴포넌트 안에서만 적용해라"는 뜻 — 컴파일 시 각 요소에 고유 속성(`data-v-해시값`)을 붙이고 그 속성을 셀렉터에 포함시켜서, 다른 컴포넌트의 같은 이름 스타일과 충돌하지 않게 만든다.

## 반응성(Reactivity): Proxy로 값 변경을 감시

Vue 3는 JS의 `Proxy` 객체로 데이터 객체를 감싼다. `count = count + 1`처럼 값을 바꾸면 Proxy가 그 변경을 감지해서 "이 값을 쓰던 화면 부분을 다시 그려야 한다"는 신호를 자동으로 보낸다 — 개발자가 "다시 그려라"라는 코드를 직접 쓰지 않아도 화면이 갱신되는 이유가 이 감시 메커니즘 덕분이다.

## 가상 DOM(Virtual DOM): 필요한 부분만 다시 그리기

데이터가 바뀔 때마다 실제 화면(DOM)을 통째로 다시 그리면 느리다. Vue는 메모리 안에 화면 구조를 JS 객체로 표현한 "가짜 트리"를 이전/새 상태 두 벌 만들어 비교(diffing)하고, **실제로 달라진 부분만** 진짜 DOM에 반영한다. `<template>`이 컴파일되면 결국 이 가상 트리를 만드는 `h('h1', {}, title)` 같은 JS 함수 호출이 된다 — HTML스러운 템플릿 문법은 이 함수 호출로 번역되는 문법 설탕(syntax sugar)일 뿐이다.
