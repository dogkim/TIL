## 모듈화와 분할 정복

큰 프로그램을 작고 단순한 조각(**모듈**)으로 나누어 구성하는 것이 개발·유지보수에 유리함 — **분할 정복(divide and conquer)** 접근. 메서드 본문의 문장은 한 번만 작성되고, 다른 메서드로부터 숨겨지며(구현 세부사항 은닉), 프로그램 여러 곳에서 재사용될 수 있음.

**계층적 관리 비유**: 보스(호출자, caller)가 워커(호출된 메서드, called method)에게 작업을 요청하고 결과를 돌려받음(return) — 보스는 워커가 그 작업을 *어떻게* 수행하는지 알 필요가 없음. 워커가 다시 다른 워커를 호출할 수도 있음(보스는 모름).

## static 메서드와 static 필드

**static 메서드(클래스 메서드)**: 특정 객체의 상태에 의존하지 않는 작업을 수행 — 클래스 전체에 적용됨. 객체를 만들지 않고 `클래스명.메서드명(인자)` 형태로 호출.

```java
double result = Math.sqrt(4);   // Math의 static 메서드 — 객체 생성 불필요
```

**static 필드(클래스 변수)**: 그 클래스의 모든 객체가 공유하는 단일 사본을 가지는 필드 (반면 **인스턴스 변수**는 객체마다 별도의 사본을 가짐).

```java
Math.PI   // public static final — 상수(final)이자 클래스 변수(static)
Math.E
```
`final` 키워드로 선언된 필드는 초기화 후 값이 변경될 수 없는 **상수**.

**`main`이 static인 이유**: JVM이 프로그램을 시작할 때는 아직 어떤 객체도 생성되지 않은 상태이므로, 객체 생성 없이 호출 가능한 `static` 메서드여야 `main`을 실행할 수 있음.

## 여러 매개변수를 가진 메서드

매개변수는 쉼표로 구분된 목록으로 선언하며, 메서드 호출 시 인자(argument) 개수와 타입이 매개변수(형식 매개변수, formal parameter) 목록과 일치해야 함.

```java
public static int maximum(int x, int y, int z) {
    int maxValue = x;
    if (y > maxValue) maxValue = y;
    if (z > maxValue) maxValue = z;
    return maxValue;
}
```

## 메서드 호출 스택과 스코프

메서드가 호출되면 **메서드 호출 스택**에 그 메서드의 실행 정보(지역 변수, 반환 주소 등)가 쌓이는 **스택 프레임**이 push되고, 메서드가 종료되면 pop됨 — 재귀 호출도 이 메커니즘으로 동작.

## 메서드 오버로딩 (Overloading)

같은 이름의 메서드를 매개변수의 **개수나 타입이 다르게** 여러 개 선언 가능 — 컴파일러가 호출 시 전달된 인자에 맞는 버전을 선택(**시그니처**로 구분: 메서드 이름 + 매개변수 타입 목록).

```java
public static int square(int x) { return x * x; }
public static double square(double x) { return x * x; }
```

반환 타입만 다르고 매개변수 목록이 같으면 오버로딩이 성립하지 않음(컴파일 에러) — 오버로딩 판별은 매개변수 목록 기준.

## 난수를 이용한 시뮬레이션

`java.util.Random` 클래스로 난수를 생성해 게임·시뮬레이션 등을 구현. `random.nextInt(6) + 1`처럼 범위를 조정해 주사위 눈(1~6) 같은 값을 얻는 패턴이 일반적.
