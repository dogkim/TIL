## 첫 Java 프로그램

```java
public class Welcome1 {
    public static void main(String[] args) {
        System.out.println("Welcome to Java!");
    }
}
```

- `public` 클래스는 반드시 클래스명과 동일한 이름의 `.java` 파일에 저장되어야 함
- `main` 메서드는 모든 Java 애플리케이션의 시작점 — `public static void main(String[] args)` 형태를 반드시 지켜야 JVM이 실행할 수 있음
- `void`는 이 메서드가 값을 반환하지 않음을 의미

**컴파일과 실행**
```bash
javac Welcome1.java   # 컴파일 → Welcome1.class (플랫폼 독립적 바이트코드)
java Welcome1          # 실행 → JVM이 .class를 로드하고 main을 호출
```

**출력**: `System.out.print`(줄바꿈 없음) / `println`(줄바꿈 포함) / `printf`(형식 지정 출력, `%s`·`%d`·`%f` 등 형식지정자 사용)

## 클래스, 객체, 메서드, 인스턴스 변수

- **클래스**: 메서드들의 집합을 담는 프로그램 단위. `class` 키워드로 선언
- **속성(attribute)**: 클래스 선언 안, 메서드 밖에 선언되는 변수 — **필드(field)**라고 부름. 각 객체가 자신만의 값을 가지면 **인스턴스 변수**
- **드라이버 클래스(driver class)**: `main`을 포함해 다른 클래스를 테스트하기 위한 별도의 클래스

```java
public class GradeBook {
    private String courseName;   // 인스턴스 변수

    public void setCourseName(String name) {
        courseName = name;
    }

    public String getCourseName() {
        return courseName;
    }
}
```

**객체 생성과 메서드 호출**
```java
GradeBook myGradeBook = new GradeBook();   // 생성자 호출 (new + 클래스명())
myGradeBook.setCourseName("CS101");        // 점(.) 구분자로 메서드 호출
```

- `static` 메서드(예: `main`)는 객체 생성 없이 호출 가능 — 그 외 메서드는 먼저 객체를 만들어야 호출 가능
- `new` 키워드는 시스템에 메모리를 요청하고, 해당 클래스의 **생성자(constructor)**를 호출해 객체를 초기화함

## import 선언과 패키지

- `System`, `String` 등은 `java.lang` 패키지 소속 — 모든 프로그램에 암묵적으로 import됨
- 그 외 클래스는 `import` 선언이 필요하거나, **완전한정 클래스명(fully qualified name)**(`패키지명.클래스명`)으로 직접 참조 가능
- 같은 디렉터리에서 컴파일된 클래스들은 **기본 패키지(default package)**에 속하며 서로 암묵적으로 import됨

## get/set 메서드와 캡슐화

- 인스턴스 변수는 보통 `private`로 선언 — 클래스 외부에서 직접 접근 불가 (**정보 은닉/데이터 은닉**)
- **클라이언트**(그 클래스를 사용하는 다른 코드)는 `public`인 **set 메서드**(값 설정)와 **get 메서드**(값 조회)를 통해서만 private 필드에 접근
- 필드는 지역 변수와 달리 명시적으로 초기화하지 않아도 **기본값**을 가짐 (`int`→0, `boolean`→false, 참조 타입→`null`)

## 기본 타입 vs 참조 타입

- **기본 타입(primitive type)**: `boolean`, `byte`, `char`, `short`, `int`, `long`, `float`, `double` — 값 자체를 저장
- **참조 타입(reference type)**: 그 외 모든 타입(클래스) — 변수는 객체가 저장된 메모리 위치(참조)를 저장

## 생성자(Constructor)

- 객체 생성 시 인스턴스 변수를 초기화하는 특별한 메서드 — 반드시 **클래스와 같은 이름**을 가지며, 반환 타입을 명시하지 않음(반환값 자체가 없음)
- 생성자를 하나도 선언하지 않으면 컴파일러가 매개변수 없는 **기본 생성자(default constructor)**를 자동 제공 — 단, 생성자를 하나라도 직접 선언하면 기본 생성자는 자동 제공되지 않음

## 부동소수점 타입

- `float`(단정밀도, 약 7자리 유효숫자) vs `double`(배정밀도, 약 15자리 유효숫자, float의 2배 메모리)
- 소수 리터럴(예: `7.33`)은 기본적으로 `double`로 취급됨
- `%.2f` 형식지정자: 소수점 둘째 자리까지 반올림 출력

## (참고) 대화상자를 이용한 GUI

`javax.swing.JOptionPane`의 `static` 메서드 `showMessageDialog(부모, 메시지)`로 간단한 메시지 대화상자를 표시할 수 있음 — 객체 생성 없이 `JOptionPane.showMessageDialog(...)` 형태로 바로 호출.
