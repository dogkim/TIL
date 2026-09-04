## Solving Recurrences

분할 정복 알고리즘의 실행 시간은 보통 재귀식(recurrence)으로 표현된다. 예: $T(n) = aT(n/b) + f(n)$. 이를 닫힌 형태(closed form)로 푸는 3가지 방법.

### 1. Substitution Method (치환법)

1. 답의 형태를 **추측**한다 (예: $T(n) = O(n\log n)$)
2. 수학적 귀납법으로 그 추측이 실제로 재귀식을 만족하는지 **증명**한다

**예시**: $T(n) = 2T(\lfloor n/2 \rfloor) + n$이 $T(n) = O(n \log n)$임을 증명

- 가정: $T(k) \le ck\log k$가 모든 $k < n$에 대해 성립
- $T(n) = 2T(n/2) + n \le 2c(n/2)\log(n/2) + n = cn\log n - cn\log 2 + n = cn\log n - cn + n$
- $c \ge 1$이면 $-cn + n \le 0$이므로 $T(n) \le cn\log n$ 성립

추측이 맞는지 확신이 안 서면 recursion tree method로 먼저 답의 형태를 가늠해본 뒤 substitution으로 증명하는 순서가 일반적.

### 2. Recursion Tree Method (재귀 트리법)

재귀식을 트리로 펼쳐서, **각 레벨에서 발생하는 비용의 합**을 구하고 이를 전체 레벨에 대해 더함.

**예시**: $T(n) = 3T(n/4) + cn^2$
- 루트에서 비용 $cn^2$, 자식 3개 각각 $n/4$ 크기
- 레벨 $i$의 비용 합: $3^i \cdot c(n/4^i)^2 = (3/16)^i cn^2$
- 트리의 깊이: $\log_4 n$
- 전체 비용: $\sum_{i=0}^{\log_4 n} (3/16)^i cn^2$ — $(3/16) < 1$인 기하급수이므로 $O(n^2)$로 수렴 (루트 비용이 지배적)

리프 개수 × 리프당 비용도 함께 확인해 upper bound가 tight한지 검증하는 것이 일반적.

### 3. Master Method (마스터 정리)

$T(n) = aT(n/b) + f(n)$ ($a \ge 1$, $b > 1$) 형태의 재귀식에 대해, $f(n)$을 $n^{\log_b a}$와 비교하여 바로 답을 구함.

세 가지 경우:
1. $f(n) = O(n^{\log_b a - \epsilon})$ (어떤 $\epsilon > 0$에 대해) → $T(n) = \Theta(n^{\log_b a})$
   (재귀 호출 비용이 지배적)
2. $f(n) = \Theta(n^{\log_b a})$ → $T(n) = \Theta(n^{\log_b a}\log n)$
   (두 비용이 같은 크기)
3. $f(n) = \Omega(n^{\log_b a + \epsilon})$이고 **regularity condition** ($af(n/b) \le cf(n)$, $c<1$)을 만족 → $T(n) = \Theta(f(n))$
   (분할 이후 합치는 비용이 지배적)

**예시**: $T(n) = 2T(n/2) + n$ → $a=2, b=2$, $n^{\log_2 2} = n$, $f(n) = n = \Theta(n^{\log_b a})$ → **Case 2** → $T(n) = \Theta(n\log n)$ (merge sort)

세 경우 중 어디에도 안 맞는 틈새(gap)가 존재할 수 있음 — 그런 경우엔 master method 대신 substitution/recursion tree로 풀어야 함.
