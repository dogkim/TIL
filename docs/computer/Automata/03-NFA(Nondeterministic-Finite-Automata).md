## Non-Deterministic Finite Automata
### Definition (NFA)
A nondeterministic finite automaton is a quintuple (5-tuple)
$M = (Q,\;\Sigma,\;\delta,\; q_0,\; F)$
$Q$ (큐) : 상태의 유한한 집합
$\Sigma$ (시그마) : 입력 가능한 심볼들의 유한한 집합
$\delta$ (델타) : $Q * (\Sigma \cup\{\epsilon\}) \to 2^Q$ :  
- $\epsilon$ 이 있어 input 없이 transition이 가능
- 모든 부분의 집합으로 대응 $\to$ (여러 방향으로 나아갈 수 있으며, 어디로도 나아가지 않아도 됨)
$q_0 \in Q$ : 시작 상태 (하나의 state), 기계가 가동될 때 가장 먼저 머무르는 지점
$F \subseteq Q$ : 종료 상태의 집합, 입력이 끝났을 떄 이 상태에 도달해있어야 정상

### NFA의 차이점
델타로 부터 나오는 차이점

NFA에서 $\delta$ 는 power set $2^Q$로 나타나는데, 이는 몇가지 다른 움직임을 가능하게 한다.
1. delta의 transition을 통해 set이 나올 수 있다.
	 $\delta (q_1, a) = \{q_0,q_2\}$ 
2. input symbol을 consuming하지 않아도 transition이 가능하다
	$\delta(q_0, \epsilon) = q_1$
3. NFA의 set $\delta(q_1,a)$이 비어있는 것이 가능하다. 즉, 특정한 상황에 대한 transition이 정의되어 있지 않아도 된다.
	$\delta(q_1,a) = \emptyset$

### Language of NFA
**Definition**
$M = (Q,\;\Sigma,\;\delta,\; q_0,\; F)$인 경우
$L(M) = \{ w \in \Sigma^* \;|\; \delta^*(q_0,w)\cap F \neq \emptyset\}$

DFA에서 state로 나온것과 다르게 NFA에서는 하나만 Final state와 일치해도 가능

### Equivalence
**Definition**:
	Two finite autinmata $M_1$ and $M_2$ said to be **equivalent** if $L(M_1) = L(M_2)$
	that is, they accept the same language.
	동치면 동일한 언어를 사용

+ + 어떤 NFA가 있으면 그것과 동치인 DFA가 존재한다

### Subset Construction
부분집합 구성법

**목적**
	NFA에서 동시에 존재할 수 있는 여러 상태들의 조합을 DFA의 하나의 상태로 간주하기 위해

$Q_D = \{S\;|\;S\subseteq Q_N\}$
DFA의 state는 NFA의 모든 개별 set을 하나의 state로 간주

$F_D = \{ S \subseteq Q_N \mid S \cap F_N \neq \emptyset \}$
종료 조건은 $Q_N$중에서 $F_N$과의 교집합이 emptyset이 아닌 $Q_N$
	종료 state가 $Q_N$에 하나라도 포함

NFA의 상태 개수가 $n$개일 경우, DFA의 상태 개수는 최대 $2^n$개까지 가능
	$|Q_d| = 2^{|Q_N|}$
	| * | = Cardinality
- NFA 상태: $\{A, B\}$
- DFA 가능한 상태 조합: $\emptyset, \{A\}, \{B\}, \{A, B\}$