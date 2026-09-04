## 예외란

**예외(exception)**: 프로그램 실행 중 발생하는 문제의 표시. 예외 처리를 이용하면 문제가 생겨도 프로그램이 곧바로 종료되지 않고, 처리 후 계속 실행될 수 있음 — **견고하고(robust) 결함 허용적인(fault-tolerant)** 프로그램을 만드는 핵심 기법.

**대표적인 예외들**
- `ArrayIndexOutOfBoundsException`: 배열 범위를 벗어난 인덱스 접근
- `ClassCastException`: is-a 관계가 없는 타입으로 캐스팅 시도
- `NullPointerException`: `null` 참조를 객체가 필요한 곳에서 사용
- `ArithmeticException`: 정수 나눗셈에서 0으로 나누기 (부동소수점은 0으로 나눠도 예외 없이 `Infinity`/`-Infinity`/`NaN`을 반환)
- `InputMismatchException`: `Scanner`가 기대한 타입과 다른 입력을 받았을 때

예외 처리와 관련된 모든 클래스는 `java.lang.Throwable`을 직간접적으로 상속해야 함.

## 예외 처리 없이 vs 있이

예외 처리 없이 조건마다 "작업 수행 → 에러 확인 → 에러 처리"를 섞어 쓰면 프로그램의 주 로직과 에러 처리 로직이 뒤섞여 가독성·유지보수성이 떨어짐. 예외 처리를 사용하면 에러 처리 코드를 "메인 라인" 로직에서 분리할 수 있음 — 특정 타입의 예외만, 혹은 공통 슈퍼클래스로 묶인 관련 예외 그룹만 선택적으로 처리하는 유연성도 제공.

**예외가 처리되지 않으면(uncaught exception)** 프로그램은 **스택 트레이스(stack trace)**를 출력하고 종료됨 — 예외 이름·메시지와 발생 시점의 메서드 호출 스택(호출 경로)을 보여줘 디버깅에 도움을 줌.

## try-catch-finally

```java
try {
    result = numerator / denominator;   // 예외가 발생할 수 있는 코드
} catch (ArithmeticException ex) {
    System.out.println("0으로 나눌 수 없습니다: " + ex.getMessage());
} catch (InputMismatchException ex) {
    System.out.println("정수를 입력하세요.");
} finally {
    System.out.println("항상 실행됨 (예외 발생 여부와 무관)");
}
```

- **`try` 블록**: 예외가 발생할 수 있는 코드, 그리고 예외 발생 시 실행되면 안 되는 코드를 감쌈
- **`catch` 블록(예외 핸들러)**: `try` 다음에 위치, 특정 예외 타입을 처리. `try` 블록 뒤에는 `catch` 블록이나 `finally` 블록이 최소 하나는 있어야 함
- **`finally` 블록**: 예외 발생 여부와 관계없이 항상 실행됨 (자원 해제 등에 사용) — Java 7 이후로는 `try-with-resources` 구문이 더 권장됨
- 예외 매개변수의 타입에 맞는 첫 번째 `catch` 블록이 실행됨 (여러 `catch`는 위에서부터 순서대로 검사)

## 예외 던지기와 사용자 정의 예외

```java
public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("나이는 음수일 수 없습니다: " + age);
    }
    this.age = age;
}
```

`throw`로 명시적으로 예외를 발생시킬 수 있고, `Exception`(또는 그 하위 클래스)을 상속해 애플리케이션에 특화된 사용자 정의 예외 클래스를 만들 수도 있음.

**checked vs unchecked 예외**: `RuntimeException`을 상속하지 않는 예외(예: `IOException`)는 **checked 예외**로, 메서드 시그니처에 `throws`로 선언하거나 반드시 `try-catch`로 처리해야 컴파일됨. `RuntimeException`과 그 하위 클래스(`ArithmeticException`, `NullPointerException` 등)는 **unchecked 예외**로 처리가 강제되지 않음.
