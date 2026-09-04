## 문자와 문자열의 기초

- **문자 리터럴**: 작은따옴표로 감싼 하나의 문자(`'A'`) — 실제로는 유니코드 문자 집합에서의 정수값
- **문자열 리터럴**: 큰따옴표로 감싼 문자들의 시퀀스(`"Hello"`) — 메모리에 `String` 객체로 저장됨
- Java의 `String`은 **불변(immutable)** — 한 번 생성되면 내용을 변경할 수 없음. `String`을 "변경"하는 것처럼 보이는 연산은 실제로는 새 `String` 객체를 만드는 것

## String 생성과 주요 메서드

```java
String s1 = new String();            // 빈 문자열(길이 0)
String s2 = new String("hello");     // 다른 String을 복사
String s3 = new String(charArray);   // char 배열로부터 생성
```

- `length()`: 문자 개수
- `charAt(index)`: 특정 위치의 문자 반환
- `getChars(start, end, dstArray, dstStart)`: 문자열 일부를 `char` 배열로 복사

**문자열 비교**
```java
s1.equals(s2);            // 내용 비교 (대소문자 구분)
s1.equalsIgnoreCase(s2);  // 대소문자 무시 비교
s1.compareTo(s2);         // 사전순 비교 (음수/0/양수)
s1 == s2;                 // 참조(주소) 비교 — 내용이 아니라 같은 객체인지 확인 (문자열 비교엔 부적합)
```
문자열은 각 문자의 유니코드 값을 기준으로 비교됨. **`==`로 문자열 내용을 비교하면 안 됨** — 반드시 `equals()` 사용.

**기타 자주 쓰는 메서드**: `substring()`, `indexOf()`, `replace()`, `split()`, `trim()`, `toUpperCase()`/`toLowerCase()`, `concat()`, `toCharArray()`.

## StringBuilder — 가변 문자열

`String`은 불변이라 문자열을 반복적으로 이어붙이면 그때마다 새 객체가 생성되어 비효율적 — 이런 경우 **`StringBuilder`**(가변) 사용.

```java
StringBuilder sb = new StringBuilder();
sb.append("Hello").append(", ").append("World!");
sb.insert(0, ">> ");
sb.reverse();
String result = sb.toString();
```

## Character 클래스

`char`에 대한 `static` 유틸리티 메서드 제공: `Character.isDigit()`, `isLetter()`, `isUpperCase()`, `toUpperCase()`, `toLowerCase()` 등.

## 정규 표현식 (Regular Expressions)

입력값을 검증하는 패턴 매칭 기능. `String`의 `matches()`, `replaceAll()`, `split()` 메서드나 `java.util.regex` 패키지의 `Pattern`/`Matcher` 클래스로 사용.

```java
"12345".matches("\\d+");             // true — 숫자만으로 구성되었는지 검사
"a-b-c".split("-");                  // ["a", "b", "c"]
"Hello World".replaceAll("o", "0");  // "Hell0 W0rld"
```

- `\d`: 숫자, `\w`: 단어 문자(영문자·숫자·밑줄), `\s`: 공백
- `+`(1개 이상), `*`(0개 이상), `?`(0개 또는 1개), `{n}`(정확히 n개)
- 복잡한 패턴은 `Pattern.compile(regex)`로 컴파일한 뒤 `Matcher`로 반복 매칭하는 것이 효율적
