## 알고리즘과 의사코드

**알고리즘(algorithm)**: 문제를 해결하기 위한 절차 — 실행할 동작들과 그 실행 순서로 구성. 같은 동작이라도 순서가 다르면 결과가 달라질 수 있음.

**의사코드(pseudocode)**: Java 문법의 엄격한 세부사항에 얽매이지 않고 알고리즘을 설계하도록 돕는 비형식적 언어 — 일상 영어(또는 한국어)와 비슷하며, 프로그램으로 옮기기 전에 먼저 "생각을 정리"하는 데 사용.

## 제어 구조 (Böhm과 Jacopini)

모든 프로그램은 **`goto` 없이** 세 가지 제어 구조만으로 작성할 수 있음:
1. **순차 구조(sequence)**: 문장을 작성된 순서대로 실행
2. **선택 구조(selection)**: `if`(단일 선택), `if...else`(이중 선택), `switch`(다중 선택)
3. **반복 구조(repetition)**: `while`, `for`(0회 이상 반복), `do...while`(1회 이상 반복)

제어문은 **단일 진입/단일 출구**(entry/exit point가 하나씩)를 가지며, 이를 이어붙이는 것을 **제어문 스태킹(stacking)**, 하나의 제어문 안에 다른 제어문을 넣는 것을 **네스팅(nesting)**이라 함.

## if / if-else

```java
if (studentGrade >= 60)
    System.out.println("Passed");
else
    System.out.println("Failed");
```

**삼항 연산자(조건 연산자, `?:`)**: `if-else`의 축약형, 유일하게 피연산자 3개를 갖는 연산자
```java
System.out.println(studentGrade >= 60 ? "Passed" : "Failed");
```

**중첩 if-else / else-if 체인**
```java
if (studentGrade >= 90)
    System.out.println("A");
else if (studentGrade >= 80)
    System.out.println("B");
else
    System.out.println("F");
```

**댕글링 else 문제**: 컴파일러는 `else`를 항상 **가장 가까운 앞의 `if`**와 짝지음 — 의도와 다르게 짝지어질 수 있으므로, 중괄호 `{}`로 명시적으로 범위를 지정해야 안전함.

## switch

```java
switch (day) {
    case 1: System.out.println("Mon"); break;
    case 2: System.out.println("Tue"); break;
    default: System.out.println("Unknown");
}
```
`break`가 없으면 다음 case로 **흘러내림(fall-through)**이 발생함에 유의.

## while / do-while / for

```java
int product = 3;
while (product <= 100)
    product = 3 * product;
```

- **카운터 제어 반복(counter-controlled / definite repetition)**: 반복 횟수를 루프 시작 전에 미리 알고 있는 경우 (예: 10명의 성적 입력)
- **센티널 제어 반복(sentinel-controlled / indefinite repetition)**: 반복 횟수를 미리 알 수 없어, 입력의 끝을 알리는 특별한 **센티널 값(sentinel/signal/flag value)**으로 종료를 판단하는 경우 — 센티널 값은 정상적인 입력값과 절대 혼동되지 않는 값이어야 함

```java
for (int i = 1; i <= 10; i++) {
    // i가 1부터 10까지 반복
}
```
`for`는 초기화·조건·증감을 한 줄에 모아 표현하는 카운터 제어 반복에 적합.

```java
do {
    // 최소 1회 실행됨
} while (condition);
```

## 복합 대입 연산자 / 증감 연산자

```java
c += 3;   // c = c + 3; 의 축약형 (+=, -=, *=, /=, %=)
++count;  // 전위 증가 — 먼저 증가시킨 후 값을 사용
count++;  // 후위 증가 — 먼저 값을 사용한 후 증가시킴
```

## 중첩 제어문

하나의 제어문 안에 다른 제어문을 넣어 더 복잡한 로직을 표현 (예: 학생별 합격/불합격 집계 안에서 각 학생을 순회하는 반복문 + 합격 여부를 판단하는 선택문을 중첩).
