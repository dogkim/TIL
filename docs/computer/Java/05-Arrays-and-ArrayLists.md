## 배열(Array)

**배열**: 같은 타입의 값을 담는 변수들(**요소, element**)의 그룹. 배열은 **객체**이므로 참조 타입 변수에 저장됨. 한 번 생성하면 길이가 고정됨.

- 요소 접근: `배열명[인덱스]` (**배열 접근 표현식**) — 첫 요소의 인덱스는 항상 **0**, 최대 인덱스는 (길이 − 1)
- 모든 배열 객체는 자신의 길이를 `length`라는 **인스턴스 변수**로 가지며, `length`는 `final`이라 변경 불가

**선언과 생성** (`new` 키워드로 생성)
```java
int[] c = new int[12];      // 12개의 int 요소, 각각 기본값(0)으로 초기화
int[] c2;                    // 선언만
c2 = new int[12];            // 생성은 나중에

int[] n = {10, 20, 30};      // 배열 초기화 리스트 — 길이는 리스트 요소 개수로 자동 결정
```

**향상된 for문 (enhanced for / for-each)**
```java
for (int value : myArray) {
    System.out.println(value);
}
```
배열이나 컬렉션의 모든 요소를 순서대로 순회할 때 인덱스 없이 간결하게 사용.

**다차원 배열**
```java
int[][] grid = new int[3][4];   // 3행 4열
int[][] jagged = { {1, 2}, {3, 4, 5} };  // 각 행 길이가 다른 비정형(jagged) 배열도 가능
```

**가변 인자(varargs)**: 매개변수 타입 뒤에 `...`를 붙이면 개수가 정해지지 않은 인자를 받을 수 있음 — 메서드 내부에서는 배열처럼 취급됨
```java
public static double average(double... numbers) { ... }
```

**커맨드라인 인자**: `main(String[] args)`의 `args`로 실행 시 전달된 문자열 인자들을 받음.

**`java.util.Arrays` 클래스**: 배열 관련 유틸리티 `static` 메서드 제공 — `Arrays.sort()`, `Arrays.fill()`, `Arrays.equals()`, `Arrays.toString()`, `Arrays.binarySearch()` 등.

## ArrayList

배열과 비슷하지만 **동적으로 크기가 조정**되는 컬렉션(`java.util.ArrayList`) — 실행 중 요소가 추가될 때 자동으로 용량이 늘어남.

```java
ArrayList<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.get(0);       // "A"
list.remove(0);
list.size();       // 현재 요소 개수
```

- **제네릭(Generic)** 타입 매개변수(`<String>`)로 담을 요소의 타입을 지정 — 컴파일 시점에 타입 안전성 보장
- 배열은 원시 타입도 담을 수 있지만, `ArrayList`는 참조 타입만 담을 수 있음 (원시 타입은 자동으로 **박싱(boxing)**되어 래퍼 클래스로 저장됨, 예: `int` → `Integer`)
