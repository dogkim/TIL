<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

<script>
  const arr = [];
  const cw = window.innerWidth;
  const ch = window.innerHeight;

  function makeFlake(i) {
      // 1. 객체 생성 및 배열 저장
      arr.push({ i: i, x: 0, x2: 0, y: 0, s: 0 });

      // 2. GSAP 애니메이션 설정
      arr[i].t = gsap.timeline({ 
          repeat: -1, 
          repeatRefresh: true 
      })
      .fromTo(arr[i], 
          {
              x: () => Math.random() * cw, // 시작 X 위치 랜덤
              y: -20,                      // 화면 위쪽 바깥
              s: () => 0.5 + Math.random() * 2, // 크기 랜덤
          }, 
          {
              duration: () => 5 + Math.random() * 10, // 떨어지는 속도 랜덤
              ease: 'none',
              y: ch + 50,                // 화면 아래 바깥까지
              x: () => '+=' + (Math.random() * 200 - 100), // 좌우 흔들림
              onUpdate: function() {
                  // 여기에 실제 눈송이 엘리먼트가 있다면 좌표를 업데이트하는 로직이 들어갑니다.
                  // 현재 코드는 데이터(객체)만 변화시키는 로직입니다.
              }
          }
      );
  }

  // 3. 눈송이 30개 생성 예시
  for(let i = 0; i < 30; i++) {
      makeFlake(i);
  }
</script>