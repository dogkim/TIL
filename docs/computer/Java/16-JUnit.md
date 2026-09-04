## JUnit이란

Kent Beck이 90년대 중반 Smalltalk용으로 첫 xUnit 자동화 테스트 도구를 개발했고, 이후 Beck과 Gamma(GoF 디자인 패턴 저자 중 한 명)가 JUnit을 만듦 — Java에서 **테스트 주도 개발(TDD)**의 표준 도구가 됨. Eclipse 등 주요 IDE에 테스트 생성 기능이 내장되어 있음.

## 왜 JUnit인가

기존 방식: `main()` 안에서 프로그램을 실행하고 사람이 결과를 눈으로 확인.

JUnit 기반 테스트: **기존 프로그램 코드를 건드리지 않고** 별도의 테스트 클래스에서 테스트를 수행 — 사람이 매번 결과를 직접 확인할 필요 없이, 조건이 자동으로 검증됨.

## 기본 테스트 케이스 작성

```java
import static org.junit.Assert.*;
import org.junit.Test;

public class CalculatorTest {
    @Test
    public void testAdd() {
        Calculator calculator = new Calculator();   // 1. precondition 설정
        double result = calculator.add(1, 1);        // 2. 코드 수행
        assertEquals("Calculator Addition", 2, result); // 3. 결과값 확인
    }
}
```

각 테스트 메서드는 (1) 사전 조건 설정 → (2) 테스트 대상 코드 실행 → (3) `assert` 계열 메서드로 결과 검증, 세 단계로 구성되는 것이 일반적.

## Assert 메서드

```java
assertEquals(expected, actual)
assertEquals(message, expected, actual)
assertEquals(expected, actual, delta)     // 부동소수점 비교 시 오차 허용범위
assertTrue(condition) / assertFalse(condition)
assertNull(object) / assertNotNull(object)
assertSame(expected, actual) / assertNotSame(expected, actual)  // 참조(주소) 비교
```

## Eclipse에서 JUnit 사용하기

1. `Window → Show View → Other → Java → JUnit`으로 JUnit 뷰를 표시
2. 테스트 대상 클래스에서 우클릭 → `New → JUnit Test Case` → "New JUnit 4 Test" 선택 후 이름 입력
3. 반드시 **"JUnit Test Class"**로 생성해야 함 (일반 Class로 만들면 안 됨)
4. `import static org.junit.Assert.*;`와 `import org.junit.*;`(또는 개별 import)를 잊지 말 것
5. 테스트 클래스 선택 후 실행 아이콘 클릭, 또는 `Run As → JUnit Test`

## 테스트 픽스처 (Test Fixture)

여러 테스트가 **공통으로 사용하는 객체**가 있을 때, 초기화·정리 코드의 중복을 없애기 위해 사용.

```java
public class SimpleTest {
    private Collection<Object> collection;

    @Before
    public void setUp() {
        collection = new ArrayList<>();   // 매 테스트 전에 새로 초기화
    }

    @Test
    public void testEmptyCollection() {
        assertTrue(collection.isEmpty());
    }

    @Test
    public void testOneItemCollection() {
        collection.add("itemA");
        assertEquals(1, collection.size());
    }
}
```

각 테스트는 독립적으로 `@Before`에서 초기화된 객체를 사용하므로, 테스트 간에 상태가 공유되지 않음(순서에 무관하게 안전).

## 예외 발생을 기대하는 테스트

```java
@Test(expected = IndexOutOfBoundsException.class)
public void testIndexOutOfBoundsException() {
    ArrayList<Object> emptyList = new ArrayList<>();
    emptyList.get(0);   // 이 줄에서 예외가 발생해야 테스트 통과
}
```

## void 메서드(부작용) 테스트

반환값이 없는 메서드는 그로 인한 **부작용(side effect)**을 검증 — 예: `Collection.add()` 호출 전후로 `size()`가 바뀌는지 확인.

```java
@Test
public void testCollectionAdd() {
    Collection<String> collection = new ArrayList<>();
    assertEquals(0, collection.size());
    collection.add("itemA");
    assertEquals(1, collection.size());
}
```

## 주요 어노테이션 정리

| 어노테이션 | 설명 |
|---|---|
| `@Test` | 테스트 케이스 — 여러 개 있으면 모두 실행됨 |
| `@Test(timeout=10)` | 지정한 밀리초 내에 끝나지 않으면 실패 |
| `@Test(expected=E.class)` | 해당 예외가 발생해야 테스트 통과 |
| `@Ignore` / `@Ignore("이유")` | 이 테스트를 실행에서 제외 (이유 명시 가능) |
| `@Before` | 각 테스트 실행 **전에 매번** 수행 |
| `@After` | 각 테스트 실행 **후에 매번** 수행 |
| `@BeforeClass` | 클래스의 전체 테스트 시작 **전 한 번만** 수행 |
| `@AfterClass` | 클래스의 전체 테스트 종료 **후 한 번만** 수행 |
