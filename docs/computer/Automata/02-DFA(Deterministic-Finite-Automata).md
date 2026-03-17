## Deterministic Finite Automata
**Definition** :
A deterministic finite automaton is quintuple (5-tuple)
DFA는 5개 튜플로 정의 된다

$M = (Q,\;\Sigma,\;\delta,\; q_0,\; F)$
$Q$ (큐) : 상태의 유한한 집합
$\Sigma$ (시그마) : 입력 가능한 심볼들의 유한한 집합
$\delta$ (델타) : $Q * \Sigma \to Q$ : 전이 함수(집합에서 다른 집합으로의 대응) 표로 나타남.
$q_0 \in Q$ : 시작 상태 (하나의 state), 기계가 가동될 때 가장 먼저 머무르는 지점
$F \subseteq Q$ : 종료 상태의 집합, 입력이 끝났을 떄 이 상태에 도달해있어야 정상

### Extended Transition Function
**Definition** :
$\delta^* : Q \times \Sigma^* \to Q$
$\delta^*$의 두번쨰 Argument는 String이고, $\delta^*$의 값은 이 String을 읽고 난 후의 Automaton의 State를 나타낸다

$\delta(q_0,a) = q_1,\; \delta(q_1,b) = q_2$이면
$\delta^*(q_0,ab) =q_2$이다

예제)
다음의 Transition Graph를 통해 String w = abba에 대하여 $\delta^*(q_0,w)$를 계산하고 String $w$
가 accept되는지 판단해라
![[ExtendedTransitionFuntionEx.png]]
	$\delta^*(q_0,abba)$
	= $\delta^*\;(\delta(q_0,b),bba) = \delta^*\;(q_0,bba)$
	= $\delta^*\; (\delta(q_0,b),ba) = \delta^*\;(q_1,ba)$
	= $\delta^*\;(\delta(q_1,b),a) = \delta^*\;(q_2,a)$
	=$\delta^*(q_2,a) = \delta(\delta^*(q_2,\epsilon),a) = \delta(q_2,a) = q_2$

### Language of DFA
**Definition**
$M = (Q,\;\Sigma,\;\delta,\; q_0,\; F)$인 경우 ($w$는 String)
$L(M) = \{ w \in \Sigma^* \;|\; \delta^*(q_0,w)\in F\}$
DFA에서 만들수 있는 모든 String중 start string에서 시작해서 F state으로 끝나는 경우의 string
## Regular Language
A language $L$ is called regular if an only if there exits a DFA $M$ such that
$L = L(M)$

Regualr language $<=>$ DFA
	어떤 Language를 accept할 수 있는 Automata를 만들 수 있으면 그 Language는 Regular Language이다

