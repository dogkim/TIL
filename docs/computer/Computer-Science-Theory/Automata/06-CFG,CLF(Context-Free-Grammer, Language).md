### CFL
Definition
 A language is said to be **context-free** iff there is a context-free grammar 𝐺 such that 𝐿 = 𝐿(𝐺), where 
 𝐿 (𝐺) = {𝑤 ∈ $T^∗$ | $\overset{\text{*}}{\underset{\text{G}}{\textstyle\Longrightarrow}}$ 𝑤 }
 따로 CFL에 대한 개별적 정의가 있는 것이 아님.
 CFG의 L이 CFL이다.

### leftmost, rightmost
linear하지 않은 CFG의 경우 우측에 1개 이상의 변수를 가질 수 있는데, 이 경우에 변수를 어떤 순서로 치환(derivation)할지 정해야함.
치환할 때, 문장 형태에서 가장 왼쪽/오른쪽에 있는 변수를 치환 함에 따라, 그 유도를 **leftmost derivation** 또는 **rightmost derivation**이라고 함

#### 예시
$G = (\{A,B,S\},\{a,b\}, S, P)$
1. $S \rightarrow AB$
2. $A \rightarrow aaA$
3. $A \rightarrow \epsilon$
4. $B \rightarrow Bb$
5. $B \rightarrow \epsilon$

- **Leftmost Derivation:** 매 단계 가장 왼쪽 변수 치환 
	$\underline{S} \Rightarrow \underline{A}B \Rightarrow aa\underline{A}B \Rightarrow aa\underline{B} \Rightarrow aa\underline{B}b \Rightarrow aab$

- **Rightmost Derivation:** 매 단계 가장 오른쪽 변수 치환
    $\underline{S} \Rightarrow A\underline{B} \Rightarrow A\underline{B}b \Rightarrow Ab \Rightarrow aa \underline{A}b \Rightarrow aab$

### Parse Trees
Definition
An ordered tree for a CFG 𝐺, is a parse tree for 𝐺 if and only if 
1. **루트 노드(Root):** 항상 시작 심볼인 $S$로 라벨이 붙는다.
2. **리프 노드(Leaf):** 모든 리프 노드는 터미널 심볼 또는 에프실론 기호의 집합($T \cup \{\epsilon\}$) 중 하나의 라벨을 가진다.
3. **내부 노드(Interior Vertex):** 리프가 아닌 모든 내부 노드는 변수 집합($V$)에 속하는 라벨을 가진다.
4. **자식 노드와의 관계:** 어떤 노드의 라벨이 $A$이고 그 자식 노드들의 라벨이 왼쪽부터 순서대로 $a_1, a_2, ..., a_n$이라면, 생성 규칙 집합 $P$에 반드시 $A \rightarrow a_1a_2...a_n$이 존재해야 한다.
5. **입실론($\epsilon$) :** 만약 어떤 리프 노드의 라벨이 $\epsilon$이라면, 그 노드는 부모 노드의 **유일한 자식**이어야 한다. ($A \rightarrow \epsilon$)

#### 속성
- String $w$에 대한 구문적 구조를 나타낸다
- derivation이나 재귀적 추론의 구조를 보여준다.
- 같은 String에 대하여 여러개의 parse tree가 존재할 수 있다. (ambiguity) / 모호성
- 이상적으로는 문자열당 하나의 Parse Tree만 존재해야 하지만, 이러한 모호성을 항상 제거할 수 있지는 않다. (선천전 모호성의 경우/ 가령, {$a^i b^j c^k$ | $i = j$ or $j = k$} 의 경우 ) 

$G = (V, T, S, P)$가 문맥 자유 문법이고, $A \in V$가 변수(Non-terminal)일 때 다음 조건들은 모두 동치

1. **재귀적 추론 (Recursive Inference):** 
	재귀적 추론(Bottom-up 방식)을 통해 문자열 $w$가 변수 $A$의 언어에 속함을 판정.
	
2. **일반 유도 (Derivation):** $A \Rightarrow^* w$ 
	변수 $A$에서 시작하여 규칙을 자유롭게 적용해 $w$를 유도할 수 있다.
	
3. **가장 왼쪽 유도 (Leftmost Derivation):** $A \Rightarrow^*_{lm} w$ 
	항상 가장 왼쪽에 있는 변수부터 문자열로 치환하는 방식을 통해 $w$를 유도

4. **가장 오른쪽 유도 (Rightmost Derivation):** $A \Rightarrow^*_{rm} w$ 
	항상 가장 오른쪽에 있는 변수부터 문자열로 치환하는 방식을 통해 $w$를 유도

5. **파스 트리 (Parse Tree):** 
	루트(Root) 노드가 $A$이고 단말 노드들의 나열(Yield)이 $w$인 파스 트리가 존재한다.

#### 증명 스케치 (Parse Tree ⇒ Derivation, induction on tree height)

$A$를 루트로, $w$를 yield로 갖는 parse tree가 존재하면 $A \Rightarrow^*_{lm} w$가 성립함을 트리 높이 $h$에 대한 귀납법으로 보임.

- **$h=1$**: $A$ 바로 아래에 리프만 있고, 그 리프들의 나열이 $w$. Parse tree 정의(4번 조건)에 의해 $A \to w$가 생성 규칙에 존재해야 하므로 $A \Rightarrow w$.
- **$h \ge 2$ (귀납 가정: 높이 $h$ 이하의 parse tree는 항상 대응하는 derivation이 존재)**: $A$의 자식이 $X_1, X_2, \dots, X_k$이고 ($A \to X_1X_2\cdots X_k \in P$), 각 $X_i$를 루트로 하는 서브트리의 높이는 $h$ 이하이며 각각 $w_i$를 yield한다고 하자 ($w = w_1w_2\cdots w_k$).
  - 귀납 가정에 의해 각 $X_i \Rightarrow^*_{lm} w_i$
  - 이를 이어붙이면 $A \Rightarrow_{lm} X_1X_2\cdots X_k \Rightarrow^*_{lm} w_1X_2\cdots X_k \Rightarrow^*_{lm} w_1w_2\cdots X_k \Rightarrow^*_{lm} \cdots \Rightarrow^*_{lm} w_1w_2\cdots w_k = w$
- 따라서 임의의 높이에 대해 parse tree가 존재하면 그에 대응하는 leftmost derivation이 항상 구성 가능함 (반대 방향, derivation ⇒ parse tree도 유사하게 derivation 길이에 대한 귀납으로 보일 수 있음).

이 동치성 덕분에, CFG는 **문맥(앞뒤에 뭐가 오는지)과 무관하게** 오직 하나의 변수가 어떻게 바뀌어 가는지만 보면 되므로 parse tree라는 문맥과 무관한 구조로 표현이 가능함 — "context-free"라는 이름의 근거.

> 주의: 하나의 parse tree에서 leftmost derivation과 rightmost derivation처럼 **서로 다른 여러 derivation이 나올 수 있음**. 반대로 하나의 derivation은 항상 정확히 하나의 parse tree에 대응됨.

### 유용한 변수(Useful Variable)의 조건

- **생성성(Generating):** 변수 $A$로부터 시작해서 최종적으로 터미널 문자열($w \in T^*$)을 만들어낼 수 있는가?

- **도달 가능성(Reachable):** 시작 변수 $S$에서 유도(Derivation)를 시작했을 때, 그 과정 중에 변수 $A$가 나타날 수 있는가?

**결론:** $S \xrightarrow{*} xAy \xrightarrow{*} w$
시작 기호에서 $A$로 갈 수 있고, $A$에서 다시 끝(터미널)으로 갈 수 있어야만 **유용(Useful)**

### 2. 문법 정리(Simplification)시 주의사항

문법에서 쓸모없는 기호를 제거할 때, 적용 순서를 지켜야함

1. **첫 번째:** **생성되지 않는(Non-generating)** 기호를 먼저 찾아서 제거
2. **두 번째:** 그 결과물에서 **도달 불가능한(Unreachable)** 기호를 제거

**순서가 바뀌면 안 되는 이유:**
만약 도달 가능성을 먼저 체크하고 생성성을 나중에 체크하면, 생성성이 없는 변수를 지우는 과정에서 특정 변수가 '고립(Unreachable)'되어 버리는 상황을 놓칠 수 있음.
반드시 **생성성 → 도달 가능성** 순서로 필터링

### 요약 예시

- $S \to AB \mid a$
- $A \to a$
- $B \to bB$

위 문법에서 $B$는 터미널로 끝날 수 없으므로 **비생성적**
$B$를 제거하면 $S \to AB$라는 규칙도 제거 됨.
그러면 $A$는 터미널을 만들 수 있지만($A \to a$), $S$로부터 갈 수 있는 방법이 없어져 **도달 불가능**한 상태가 됨.
결국 최종적으로 살아남는 유용한 규칙은 $S \to a$ 뿐
