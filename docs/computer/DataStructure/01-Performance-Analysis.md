# 01- Performance Analysis
## 1. 프로그램의 평가 기준
- **공간 효율성 (Space Efficiency)**: 프로그램이 실행되는 동안 메모리를 얼마나 효과적으로 사용하는가?  
- **시간 효율성 (Time Efficiency)**: 프로그램이 특정 작업을 수행하는 데 걸리는 시간이 적절한가?
## 2. 프로그램 복잡도 (Program Complexity)
기계 독립적인 추정치를 획득 해야 정확한 알고리즘의 실용성 파악 가능
- **Time complexity (시간 복잡도)**
    알고리즘이 문제를 해결하기 위해 수행하는 기본 연산 횟수의 총합
- **Space complexity (공간 복잡도)**
    알고리즘 실행부터 종료까지 필요한 최대 메모리 공간

## 3. 성능 평가 단계 (Performance evaluation phases)
**Performance measurement(성능 측정)**
    **귀납적 테스팅 (A Posteriori)** :실제 환경에서 실행 시간을 측정
```C
#include <time.h>
clock_t start = clock();
/* 실행 코드 */ 
clock_t stop = clock();
double duration = (double)(stop - start) / CLOCKS_PER_SEC;
```

**Perfomance measurement의 문제점**
1. 알고리즘을 직접 구현하고 테스트하는 과정을 거쳐야함 (복잡한 경우 부담)
2. 하드웨어 및 컴파일러 등 실험 환경에 따라 결과가 가변적임
3. 실험에 사용하지 않은 데이터들에 대해 다른 결과가 나올 수 있음

**Performance analysis(성능 분석)** 
       **연역적 평가(A Priori)** : 프로그램을 실제 실행하지 않고 알고리즘의 논리적 단계를 통해 복잡도를 계산
    **점근적 분석 (Asymptotic Analysis)**: 데이터의 크기 $n$이 무한대로 커질 때의 증가율을 분석합니다. ($O, \Omega, \Theta$ 표기법 사용)
### 3.1 점근적 표기법 (Asymptotic Notation)
데이터가 무한히 많아질 때($n \to \infty$) 상항선이나 하한선을 표현하는 방식

**1. Big-O ($O$) 표기법 : 점근적 상한 (Upper Bound)** 
최악의 경우를 상정

**정의 :** 모든 $n \ge n_0$에 대하여 $f(n) \le c \cdot g(n)$을 만족하는 양의 상수 $c$와 $n_0$가 존재하면, $f(n) = O(g(n))$이다.
=> 수학적으로 $f(n) = 3n + 5$라면, $n \ge 5$일 때 $3n + 5 \le 4n$이 성립하므로 $O(n)$

**2. Big-Omega ($\Omega$) 표기법 : 점근적 하한 (Lower Bound)**
최선의 경우를 상정

**정의 :** 모든 $n \ge n_0$에 대하여 $f(n) \ge c \cdot g(n)$을 만족하는 양의 상수 $c$와 $n_0$가 존재하면, $f(n) = \Omega(g(n))$이다.

**3. Big-Theta ($\Theta$) 표기법 : 점근적 상하한 (Tight Bound)**
상한과 하한이 일치, 알고리즘의 정확한 증가율 표기 가능

**정의 :** 모든 $n \ge n_0$에 대하여 $c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n)$을 만족하는 양의 상수 $c_1, c_2, n_0$가 존재하면, $f(n) = \Theta(g(n))$이다.

표기 예시: (선형 탐색의 경우)
```c
#include <stdio.h>
LinearSearch(int a[], int n, int val) {
    for(int i = 0; i < n; i++){ // 1: n + 1 회
        if(a[i] == val){ // 2: n회
            return i;
        } 
    }
    return -1;
}
```
**Big-$O$ (최악의 경우) :** 찾으려는 값이 배열에 없는 경우

| **연산 항목 (Line)** | **실행 횟수**    | **비고**                              |
| ---------------- | ------------ | ----------------------------------- |
| `int i = 0`      | 1            | 초기화 1회                              |
| `i < n`          | $n + 1$      | $n$번 성공 후, 마지막에 $n < n$ 비교(실패)까지 포함 |
| `a[i] == val`    | $n$          | 루프 내부 비교 연산 $n$회 수행                 |
| `i++`            | $n$          | 루프 끝에서 증감 연산 $n$회 수행                |
| `return -1`      | 1            | 루프 종료 후 마지막에 실행                     |
| **Total Steps**  | **$3n + 3$** | 입력 크기 $n$에 대한 전체 연산식                |
모든 $n \ge n_0$에 대하여 $f(n) \le c \cdot g(n)$을 만족하는 양의 상수 $c$와 $n_0$가 존재하면, $f(n) = O(g(n))$이다.
- $g(n) = n$
- $c = 4, n_0 = 3$일 때, $n \ge 3$인 모든 상황에서 $3n + 3 \le 4n$이 성립
    => $O(n)$

**Big-$\Omega$ (최선의 경우) :** 첫 번째 인덱스에서 바로 찾는 경우

| **연산 항목**          | **실행 횟수** | **비고**        |
| ------------------ | --------- | ------------- |
| `i = 0` (초기화)      | 1회        |               |
| `i < n` (조건 검사)    | 1회        | 첫 번째 루프 진입    |
| `a[i] == val` (비교) | 1회        | 바로 참(True) 발생 |
| `return i` (반환)    | 1회        | 즉시 종료         |
| **Total Steps**    | **4회**    |               |
모든 $n \ge n_0$에 대하여 $f(n) \ge c \cdot g(n)$을 만족하는 양의 상수 $c$와 $n_0$가 존재하면, $f(n) = \Omega(g(n))$이다.
$n$의 값과 관계 없이 $f(n)$ = 4
- $g(n) = 1$
- $c = 1, n_0 = 1$일 때, 모든 $n \ge 1$에 대하여 $f(n) \ge c \cdot g(n)$ = ( $4 \ge 1$ )이 성립
    => $\Omega(1)$

**Big-$\Theta$ :** 입력 데이터의 상태에 따라 실행 시간의 차이가 극명하므로 전체 성능을 하나의 $\Theta$로 정의할 수 없음
## 4. Space Complexity (공간 복잡도)
고정적 부분과 가변적 부분의 합으로 구성

$S(P) = c + S_p(n)$

- $S(P)$ : 프로그램 P의 공간 요구량
- $c$ : 인스턴스 특성에 무관한 고정 공간 (예: 코드 저장 공간, 단순 변수)
- $S_p​(n)$ : 가변적 부분 :  인스턴스 특성($n$)에 따라 크기가 결정되는 공간 (예: 재귀 함수시 쌓이는 stack frame)
- $n$ (Instance characteristics) : 인스턴스 특성(예: 입출력 크기, 개수)

### 4.1. Instance characteristic 예시
1. 프로그램 실행 중 정수 a를 입력하여 a개의 실수를 저장할 수 있는 배열을 생성한다. -> a에 따라 사용하는 메모리 공간의 양이 달라짐
    
2. 프로그램 실행 중 정수 k를 입력하여 1부터 k까지의 합을 계산한다. -> k에 따라 계산 시간이 변경됨
### 4.2. Space complexity 예시
**예시 1:**
```C
float abc(float a, float b, float c){
    return a+b+b*c+(a*b-c) / (a+b) + 4.00;
}
```
$a, b, c$의 크기에 상관없이 추가로 할당되는 가변 공간이 없음 (Variable part X)
$S_{abc}(n) = 0$

**예시 2:**
호출될 때마다 시스템 스택에 매개변수, 지역 변수, 복귀 주소 등을 포함한 스택 프레임(Stack Frame)이 쌓임
```C
float rsum(float list[], int n){
    if (n <= 0) return 0;
    return rsum(list, n-1) + list[n-1];
}
```

n에 대해서 n ~ 0 까지 $n+1$번 호출

| Type                     | Name   | Number of bytes |
| ------------------------ | ------ | --------------- |
| parameter: Array pointer | list[] | 4               |
| parameter: Integer       | n      | 4               |
| return address: (내부 처리용) |        | 4               |
| TOTAL per reculsive call |        | 12              |

최악의 경우
$S_{rsum}(MAX\_SIZE) = 12 \times (MAX\_SIZE + 1)$

## 5. Time Complexity (시간복잡도) 예시
입력 데이터의 크기($n$)에 따라 알고리즘이 수행하는 연산횟수를 분석

```c
float sum(float list[], int n) { 
    float s = 0; // 1: 1회 
    for (int i = 0; i < n; i++){ // 2: n+1회 (마지막 조건 체크 포함) 
        s += list[i]; // 3: n회 연산
    }
    return s; // 4: 1회
}
```
**Total:** $1 + (n+1) + n + 1 = 2n + 3$
Time Complexity: $O(n)$

