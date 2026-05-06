## Criteria for Analysis
Correctness(정확성)을 증명한 이후에, 다음 지표들을 통해 해당 알고리즘이 얼마나 "좋은" 알고리즘인지 판단 할 수 있다.
1. **Efficiency(효율성)**:
    - 얼마나 적은 메모리사용을 통해 빠르게 결과를 내는지 (최소한의 자원으로 최대한 빠른 결과)
    - 시간 복잡도와 공간 복잡도로 나눌 수 있다.
2. **Simplicity(단순성)**:
    - 알고리즘이 얼마나 이해하기 쉽고 구현하기 용이한지 
3. **Generality(일반성)**:
    - 다양한 input에 대하여 일관된 성능을 보이는지
4. **Optimality(최적성)**:
    - 이론적으로 존재할 수 있는 가장 낮은 비용의 알고리즘인지
등등..

시간 효율성 측면에서 어떤 방법을 통해 복잡도를 기술 할 수 있는가

## Asymptotic Analysis (점근적 분석)
**정의**:
입력 크기 $n$이 무한히 커짐에 따라($n \to \infty$), 알고리즘이 소모하는 시간이나 자원의 증가율(Growth Rate)을 분석하여 효율성과 확장성을 평가하는 방법
- $f(n) \sim g(n) \; (N \leq n_0,\; n \to \infty)$
- $\lim\limits_{n \to \infty} \frac{f(n)}{g(n)} = 1 \;(\forall n \leq n_0)$ 
충분히 큰 $n$이 무한히 증가함에 따라 두 함수의 함수 값의 격차가 줄어든다

## Big-O Notation
$T(n), g(n)$이 n에 대한 증가함수 일 떄,
- $O(g(n)) = \{T(n) \;|\; \exists c > 0,\; n_0 > 0 \; s.t. \forall n \geq n_0,\; T(n) \leq c \cdot g(n)\}$
= 양의 상수 $c$와 $n$이 존재한다 / 모든 $n \leq n_0$에 대하여 $T(n) \geq c \cdot g(n)$일 경우 

Big-O 표기법은 upper bound의 역할을 한다
### **Prove $T(n) = O(g(n))$**
정의에 맞는 $c$와 $n_0$이 존재함을 보임으로 정의

**예시**:
$T(n) = n$, $g(n) = n\;log_2 n$일때 
$c =1,\; n_0 =2$이라고 가정
$n \geq n_0$ 인 $n \leq cn\; log_2 n$이 있음
$n \geq 2$ 일 경우 $n$이 양수이며, $1 \leq log_2n$ 또한 만족
- $T(n) = O(n\;\log n)$

### Prove $T(n) \neq O(g(n))$
같다고 가정을 하고 이후, 모순을 통해 증명

**예시**:
$T(n) = n^2$, $g(n) = n$일때 
- **가정:** $T(n) = O(g(n))$이라고 가정
    즉, 모든 $n \ge n_0$에 대하여 $n^2 \le cn$을 만족하는 양의 상수 $c$와 $n_0$가 존재
- 반례: $n = \max\{c, n_0\} + 1$인 $n$을 고려
    이 $n$은 $n \ge n_0$인 동시에 $n > c$를 만족
- $n > c$이므로 양변에 $n$을 곱하면 **$n^2 > cn$이 성립

이 경우 $n \ge n_0$인 동시에 $n > c$가 성립하며, 이는 $n^2 > cn$임을 의미