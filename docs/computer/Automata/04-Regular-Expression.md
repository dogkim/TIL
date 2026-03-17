One type of language-defining notation
무한한 개수의 Regular Language를 Regular Expression을 통해 유한한 규칙으로 정의할 수 있음

- DFA, NFA는 machine-like description이다. (기계를 인식하기 위한 regular language 표현법)
- Regular expression은 algebraic(대수적인) description이다 (사용자 친화적인 regular language 선언법)

## 구성 요소
### **1. 기본 요소 (Primitive elements)** 
- **공집합 ($\emptyset$):** 아무 문자열도 포함하지 않는 set
- **빈 문자열 ($\epsilon$):** 길이가 0인 문자열
- **단일 문자 ($a \in \Sigma$):** 알파벳에 포함된 문자 하나
- **괄호**
### **2. Operators**
- Union: $L\cup M = \{w \;|\; w \in L \;or\; w \in M\}$
- Concatenation: $LM = \{w\; |\; w = xy,x\in L,y\in M\}$
- Powers: $L^0 = \{ \epsilon \}, L^1 = L, L^{n+1} =LL^n$
- Keleene Closure (start-closure): $L^* = L^0 \cup L^1 \cup L^2 ... = \cup^\infty_{i=0} L^i$

### $\emptyset^i$
- $\emptyset^0 = \{\epsilon\}$ empty set으로 길이가 0인 String을 만들 수 있다..
- $\emptyset^i, i \ge 1$ is empty 
- $\emptyset^* = \{\epsilon\}$ -> $\emptyset^0 \cup \emptyset^1 \cup \emptyset^2 ...$

## Example
$\{a,b,c\}$ (regular language) $\Longleftrightarrow$ $a + b + c$ (regular expression)
$(a + b \cdot c)$ (regular expression) $\Longleftrightarrow$ $\{\epsilon, a,bc,abc,bca,bcbc,aaa,...\}$ (regular language)

## Inductive Definition
귀납적으로 정의

$\Sigma$를 alphabet으로 정의해보자.
1. $\emptyset,\; \epsilon,\; a \in \Sigma$ 는 모두 regular expression이다. (Primitive regular expressions.)
2. 만약 $r_1$과 $r_2$ 모두 regular expression이면, $r_1 + r_2,\; r_1 \cdot r_2,\; r_1^1,\; (r_1)$ 또한 동일하다.
3. 어떤 String이 regular expression이면, 그리고 그 경우에만 2번의 규칙들을 유한한 횟수만큼 적용할 수 있다.

## Language $L(r)$
**Definition**
Regular expression으로 표시된 $r$은 다음의 규칙을 따른다.

1. $\emptyset$ 은 regular expression에서 emptyset을 나타낸다.
2. $\epsilon$은 regular expression에서 $\{\epsilon\}$을 나타낸다.
3. 모든 $a \in \Sigma$에 대하여 $a$는 $\{a\}$를 나타낸다.
