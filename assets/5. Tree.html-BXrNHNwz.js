import{_ as n,o as i,c as d,d as l}from"./app-8p6e_3OS.js";const s={};function r(t,e){return i(),d("div",null,[...e[0]||(e[0]=[l(`<p><strong>reculsive tree</strong></p><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>void MakeTree(int n){
	NODE* node;
	node = (NODE*)malloc(sizeof(NODE));
	node-&gt;left = NULL;
	node-&gt;right = NULL;
	node-&gt;data = n;
	if(n &lt;=5){
		node-&gt;left = MakeTree(n*2);
		node-&gt;right = MakeTree(n+2);
	}
	
	return node;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Reculsive PreOrder, InOrder, PostOrder</strong></p><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>void PreOrder(NODE* h){
	if(h){
		printf(&quot;%d&quot;, h-&gt;data);
		PreOrder(h-&gt;left);
		PreOrder(h-&gt;right);
	}
	return;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>void InOrder(NODE* h){
	if(h){
		InOrder(h-&gt;left);
		printf(&quot;%d&quot;,h-&gt;data);
		Inorder(h-&gt;right);
	}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>LevelOrder traversal</strong></p><div class="language-C line-numbers-mode" data-ext="C"><pre class="language-C"><code>NODE* queue[MAX_QUEUE] ={0};
int front = 0 ;
int rear = 0 ;

void Inqueue(NODE* p){
	queue[++rear];
	return;
}

NODE* Dequeue(){
	return queue[++front];
}

void LevelOrderPrint(NODE* h){
	Inqueue(h);
	while(1){
		h = Dequeue();
		if(h){
			print(&quot;%d&quot;, h-&gt;data)
			if(h-&gt;left){
				Inqueue(h-&gt;left);
			}
			if(h-&gt;right){
				Inqueue(h-&gt;right);
			}
		}
		else{
			break;
		}
	}
	return;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>levelorder 일단 head inqueue</p><p>h에 dequeue하고 NULL아니면 print 아래있는 left, right가 NULL이 아니면 inqueue</p><p>다시 dequeue ...</p>`,10)])])}const a=n(s,[["render",r],["__file","5. Tree.html.vue"]]);export{a as default};
