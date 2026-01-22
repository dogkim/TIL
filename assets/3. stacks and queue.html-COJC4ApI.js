import{_ as i,o as n,c as t,a as p}from"./app-tp-6DmEu.js";const s={};function a(d,e){return n(),t("div",null,[...e[0]||(e[0]=[p(`<h3 id="maze" tabindex="-1"><a class="header-anchor" href="#maze" aria-hidden="true">#</a> Maze</h3><h3 id="post-fix" tabindex="-1"><a class="header-anchor" href="#post-fix" aria-hidden="true">#</a> Post fix</h3><p>스택으로 구현. pop, push, isdigit, priority, stackpriority</p><p>convert</p><p>stack, top 전역</p><p>postfix[cnt]</p><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>for(int i = 0; infix[i] != 0; i++){
	token = infix[i];
	if(isdigit(token)){
		postfix[cnt++] = token;
	}
	else{
		if(token == &#39;)&#39;){
				
		}
	}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>infix돌다가</p><ol><li>숫자 뜨면 일단 post에 넣기.</li><li>&#39;)&#39; 뜨면 &#39;(&#39; 뜰 때 까지 pop</li><li>기호면 우선순위 비교해서 먼저 계산 되어야할 놈이면 꺼내고(pop 하고) push <ol><li>&#39;(&#39;이 stack에 있으면 리셋 개념으로 무조건 push infix 다 돌면 stack[top] != EOS 까지 pop</li></ol></li></ol><h2 id="maze-1" tabindex="-1"><a class="header-anchor" href="#maze-1" aria-hidden="true">#</a> MAZE</h2><p>일단 받아</p><p>move만들고 stack 시작 지점 넣고</p><p>못찾거나, stack empty면 while 탈출</p><p>position pop하고 temp에 복사</p><p>못찾으면서 temp.dir&lt;8 이면 next.x 랑 next.y에 temp + move</p><pre><code>next가 탈출이면
push temp, next
found 1
</code></pre><p>다음이 갈수 있는 공간이면 (maze == 0 , make == 0) mark 다음 공간 = 1; position을 temp로 이동 position.dir 높히고 push</p><pre><code>temp = next;
temp.dir = 0;
</code></pre><p>못가는 공간이면 dir++;</p><p>다음공간 지정.</p><p>탈출이면 현재, 다음 push 다음 가지면 make = 1 temp 확정. postion = temp dir++ postion push</p><pre><code>temp = next;
temp.dir =0;
</code></pre><p>아니면 temp.dir+</p>`,23)])])}const o=i(s,[["render",a],["__file","3. stacks and queue.html.vue"]]);export{o as default};
