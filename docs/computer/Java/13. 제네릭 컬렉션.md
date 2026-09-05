## 컬렉션 프레임워크 개요

**컬렉션(Collection)**: 다른 객체들에 대한 참조를 담을 수 있는 자료구조(객체) — `java.util` 패키지. Java **컬렉션 프레임워크**는 미리 만들어진 제네릭 자료구조들을 제공함.

## 타입-래퍼 클래스와 오토박싱

컬렉션은 기본 타입 값을 직접 다룰 수 없음(모든 클래스가 궁극적으로 `Object`를 상속하는 참조 타입만 다룰 수 있음) — 이를 위해 각 기본 타입에 대응하는 **타입-래퍼 클래스**가 존재: `Boolean`, `Byte`, `Character`, `Double`, `Float`, `Integer`, `Long`, `Short` (모두 `java.lang`, 모두 `final`이라 상속 불가).

```java
Integer[] integerArray = new Integer[5];
integerArray[0] = 10;          // 오토박싱(autoboxing): int → Integer 자동 변환
int value = integerArray[0];   // 오토언박싱(auto-unboxing): Integer → int 자동 변환
```

## Collection 인터페이스와 Collections 클래스

- **`Collection` 인터페이스**: 원소 추가·삭제·비교 등의 **대량 연산(bulk operation)** 제공, `Iterator`를 얻어 순회하며 원소를 제거할 수도 있음
- **`Collections` 클래스**: 컬렉션을 검색·정렬하는 `static` 메서드 제공 (`Collections.sort()`, `Collections.max()` 등)

## List

**순서가 있고 중복을 허용**하는 컬렉션 (인덱스는 0부터 시작). `ArrayList`, `LinkedList`, `Vector`가 대표적 구현체.

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add(0, "B");     // 특정 인덱스에 삽입
list.get(0);
ListIterator<String> it = list.listIterator();  // 양방향 순회 가능
```

- `ArrayList`/`Vector`: 크기 조절 가능한 배열 기반 — 중간에 원소를 삽입/삭제하는 것은 비효율적(뒤 원소들을 이동해야 함)
- `LinkedList`: 이중 연결 리스트 기반 — 중간 삽입/삭제가 효율적이지만 임의 접근(get(i))은 순차 탐색이라 느림

## Set / Map

- **`Set`**: 중복을 허용하지 않는 컬렉션 (`HashSet`, `TreeSet` 등) — `TreeSet`은 정렬된 순서를 유지
- **`Map`**: 키-값 쌍을 저장, 키는 유일해야 함 (`HashMap`, `TreeMap` 등)

```java
Map<String, Integer> scores = new HashMap<>();
scores.put("Kim", 90);
int score = scores.get("Kim");
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

## 제네릭(Generics)

컬렉션에 타입 매개변수(`<Type>`)를 지정해 **컴파일 시점에 타입 안전성**을 확보 — 잘못된 타입의 원소를 넣으려 하면 컴파일 에러가 발생하고, 꺼낼 때 캐스팅이 불필요해짐.

```java
List<String> names = new ArrayList<>();  // String만 담을 수 있음
// names.add(123);  // 컴파일 에러

public static <T> T firstElement(List<T> list) {   // 제네릭 메서드
    return list.get(0);
}
```
