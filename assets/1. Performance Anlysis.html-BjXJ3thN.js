import{_ as t,o as i,c as l,a as n}from"./app-Bn9LkL83.js";const a={};function r(d,e){return i(),l("div",null,[...e[0]||(e[0]=[n(`<p><strong>프로그램의 평가 기준</strong></p><ul><li>프로그램이 효과적으로 메모리를 사용하고 있는가?</li><li>프로그램이 작업에 적합한 러닝 타임을 가지고 있는가?</li></ul><p><strong>Program complexity (프로그램 복잡도)</strong> 기계 독립적인 추정치를 획득 해야 정확한 알고리즘의 실용성 파악 가능</p><ul><li>Time complexity(시간 복잡도) 프로그램이 완료되기까지 필요한 계산시간</li><li>Space complexity(공간 복잡도) 프로그램이 완료되기까지 필요한 메모리 양</li></ul><p><strong>Performance evaluation phases (성능 평가 단계)</strong></p><ul><li><p>Performance analysis(성능 분석) : 연역적 평가 / 실제로 하는 게 X</p></li><li><p>Performance measurement(성능 측정) : 귀납적 테스팅 / 실제로 걸린 시간 측정</p></li></ul><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>#include &lt;time.h&gt;
start = clock();
//~~~~~
stop = clock();
double duration = (double)(stop - start) / CLOCK_PER_SEC;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>#include &lt;time.h&gt;
//time() 함수는 초단위로 측정된 시간을 반환
start = time(NULL);
//~~~~~
stop = time(NULL);
double duration = (double) difftime(stop,start);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Perfomance measurement의 문제점</strong></p><ol><li>알고리즘을 직접 구현하고 테스트하는 과정을 거쳐야함 <ul><li>복잡한 경우 부담</li></ul></li><li>똑같은 하드웨어나 소프트웨어 환경을 사용해야함</li><li>실험에 사용하지 않은 데이터들에 대해 다른 결과가 나올 수 있음</li></ol><h2 id="performace-analysis" tabindex="-1"><a class="header-anchor" href="#performace-analysis" aria-hidden="true">#</a> Performace Analysis</h2><h3 id="space-complexity" tabindex="-1"><a class="header-anchor" href="#space-complexity" aria-hidden="true">#</a> Space Complexity</h3><p><strong>S(P)= c + Sp(n)</strong></p><ul><li>S(P) : 프로그램 P의 공간 요구량</li><li>c : 상수 (고정 공간 요구량)</li><li>Sp​(n) : 가변적 부분 : <strong>Instance characteristics</strong>에 따라 달라짐</li><li>n : 인스턴스 특성 (예: 입출력 크기, 개수)</li></ul><p><strong>Instance characteristic 예시</strong></p><ol><li><p>프로그램 실행 중 정수 a를 입력하여 a개의 실수를 저장할 수 있는 배열을 생성한다. -&gt; a에 따라 사용하는 메모리 공간의 양이 달라짐</p></li><li><p>프로그램 실행 중 정수 k를 입력하여 1부터 k까지의 합을 계산한다. -&gt; k에 따라 계산 시간이 변경됨</p></li></ol><p><strong>Space complexity 예시</strong></p><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>float abc(float a, float b, float c){
	return a+b+b*c+(a*b-c) / (a+b) + 4.00;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Variable part가 없음! S abc(n) = 0</p><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>float rsum(float list[], int n){
	if (n != 0){
		return rsum(list, n-1) + list[n-1];
	}
	return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>Type</th><th>Name</th><th>Number of bytes</th></tr></thead><tbody><tr><td>parameter: array pointer</td><td>list[]</td><td>4</td></tr><tr><td>parameter: integer</td><td>n</td><td>4</td></tr><tr><td>return address: (used internally)</td><td></td><td>4</td></tr><tr><td>TOTAL per reculsive call</td><td></td><td>12</td></tr><tr><td>n+1번 함수 호출 하기 때문에</td><td></td><td></td></tr><tr><td>최악의 경우</td><td></td><td></td></tr><tr><td>if n is MAX_SIZE</td><td></td><td></td></tr></tbody></table><pre><code>S rsum(MAX_SIZE) = 12 * (MAX_SIZE + 1)
</code></pre>`,22)])])}const c=t(a,[["render",r],["__file","1. Performance Anlysis.html.vue"]]);export{c as default};
