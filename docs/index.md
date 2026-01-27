---
title: My TIL
---

# Welcome to My TIL

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 2. 외부 라이브러리를 동적으로 불러오거나, 이미 로드된 gsap을 사용합니다.
  // VitePress 환경에서는 아래처럼 작성하는 것이 빌드 에러를 막는 가장 좋은 방법입니다.
  const script = document.createElement('script')
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
  script.onload = () => {
    
    // 여기서부터 애니메이션 로직 시작
    const arr = [];
    const cw = window.innerWidth;
    const ch = window.innerHeight;

    // 눈송이를 담을 컨테이너 생성
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999;';
    document.body.appendChild(container);
    
    // shadow 눈 주위에 하얀 광채를 주어 입체감 부여
    function makeFlake(i) {
      const flake = document.createElement('div');
    //   flake.style.borderRadius = '50%';
      flake.innerHTML = '●';
      flake.style.cssText = `
        position:absolute;
        color:white;

        text-shadow: 0 0 5px #fff;  
        opacity:${Math.random()};
        font-size:${10 + Math.random() * 10}px;
      `;
      container.appendChild(flake);

      arr.push({ el: flake, x: 0, y: 0 });

      gsap.fromTo(flake, 
        { x: Math.random() * cw, y: -30 }, 
        {
          duration: 5 + Math.random() * 10,
          y: ch + 30,
          x: "+=" + (Math.random() * 200 - 100),
          repeat: -1,
          ease: "none",
          delay: Math.random() * 5
        }
      );
    }

    for(let i = 0; i < 50; i++) { makeFlake(i); }
  }
  document.head.appendChild(script)
})
</script>