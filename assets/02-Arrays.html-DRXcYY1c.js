import{_ as i,o as a,c as s,a as n}from"./app-9Yz_tOgW.js";const r={};function t(l,e){return a(),s("div",null,[...e[0]||(e[0]=[n(`<p><strong>Polynomial</strong> 그냥 배열 다 읽어서 a,b expon 비교 치고 큰쪽 coef랑 expon c에 넣고 큰 쪽 배열pos 랑 c배열 pos ++ expon 같으면 coef 더하고 0이면 전체 a,b pos ++; 돌다가 a,b둘중 하나 pos가 값보다 크면 나가서 남은 배열 복사.</p><p><strong>Fast Transpose</strong> 원본 matrix 데이터 개수 count</p><p>전치후 메트릭스 tuple res[] 열 개수 colcount = matrix[0].col</p><p>열의 데이터마다 개수 몇개인지 col_count 이후 데이터 들어가는 위치 startpos</p><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>for (int i = 1; i&lt; count; i++){
col_count[matrix[i]]++;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>startpos[0] = 1</p><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>for(int i =1; i&lt;colcount ; i++){
startpos[i] = startpos[i-1] + colcount[i-1];
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>res[0].row = matrix[0].col res[0].col = matrix[0].row res[0].data = matrix[0].data</p><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>int j = startpos[matrix[i].col]++;
res[j].col = matrix[j].row;
res[j].row = matrix[j].col;
res[j].data = matrix[j].data;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9)])])}const d=i(r,[["render",t],["__file","02-Arrays.html.vue"]]);export{d as default};
