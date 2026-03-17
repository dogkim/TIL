## Set
**subset : 부분 집합**
$A \subseteq B$
A의 모든 원소가 B에 포함

**proper subset : 진 부분 집합**
$A \subset B$

**complementation : 여집합**
$\overline{A}$

**intersection : 교집합**
$A \cap B$

**union : 합집합**
$A \cup B$

**difference : 차집합**
$A - B$

**powerset : 멱집합**
$S = \{a,b\}$ 일 때,
$2^S = \{\emptyset,\{a\},\{b\},\{a,b\}\}$

**Cartesian product : 데카르트 곱**
$S = S_1 * S_2 = \{(x,y) \mid x \in S_1,y \in S_2\}$

### Function
**domain:** 정의역

**codomain:** 공역

**range:** 치역

**one to one:**
    domain에서 codomain으로 가는 것 중에 겹치는게 없음
    
**onto:** 
    codomain에 선택 받지 못한게 없음

## Central Concepts of Automata Theory

**Alphabet:** 
    A finite nonempty set $\Sigma$ of symbols
    심볼들의 합으로 이뤄진 집합 (nonempty)
___
**string**:
    A finite sequence of symbols chosen from some alphabet
    일부 알파벳을 골라 만들어진 심볼들의 유한한 나열
___
**Empty string**: $\epsilon$ (입실론)
    The string with zero occurrences of symbols
    아무런 심볼이 없는 string
    어떤 알파벳을 선택하더라도 그 알파벳으로 만들 수 있는 string
___
**Length of string**:
    The number of positions for symbols in the string
    문자열 내에 심볼이 들어 있는 위치의 개수
    $w = 001,\, |w| = 3$
    $|\epsilon| =\, 0$
___
**Powers of an alphabet**: $\Sigma^k$ 
    The set of strings of length $k$, each of whose symbols is in $\Sigma$.
    알파벳 $\Sigma$ 에서 길이가 $k$인 Strings의 집합
    Ex) $\Sigma = \{0,1\}$ 인 경우
    $\Sigma^1 = \{0,1\}$
    $\Sigma^2 = \{00,01,10,11\}$
    $\Sigma^0 = \{\epsilon\}$
___
**Kleene Star**: $\Sigma^*$
    the set of all strings over $\Sigma$
    알파벳에서 만들 수 있는 모든 String의 set
___
**Positive Closure**: $\Sigma^+$
    $\Sigma^*$에서 $\epsilon$만 제외한 집합
___
**Language**:
    $\Sigma^*$중에서 특정 규칙을 만족하는 문자열들만 따로 모은 부분집합
    $L \subseteq \Sigma^*$
___
**Concatenation**: 연쇄
    $w = a_1a_2 \dots a_n$
    $v = b_1b_2 \dots b_m$ 인 경우
    
    $wv = a_1a_2 \dots a_nb_1b_2 \dots b_m$
    그냥 $w$ 뒤에 $v$를 적어
___
**Powers of a String**: $w^n$ 
    string $w$를 n번 적어
    $w = ab$ 일 때, $w^3 = ababab$
    어떤 문자열이든 0번 반복하면 빈 문자열($\epsilon$)
    $w^0 = \epsilon$
___
**Empty Language**: $\emptyset$
A language over any alphabet
어떤 알파벳도 없는 language
$\epsilon$과는 다름.
$\epsilon$만으로 구성된 set도 language가 될 수 있음 != $\emptyset$
