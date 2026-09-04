## 배열 복사

**얕은 복사 (Shallow Copy)** — 참조만 복사되어 같은 배열을 가리킴

```java
int intArray[] = new int[5];
int myArray[] = intArray;  // myArray와 intArray는 같은 배열을 가리킴
```

**깊은 복사 (Deep Copy)** — 실제 배열 데이터를 새로 복사

```java
int[] Arrays.copyOf(int[] original, int newLength);
// (원본, 원본 배열 길이)

int[] Arrays.copyOfRange(int[] original, int from, int to);

System.arraycopy(Object src, int srcPos, Object dest, int destPos, int length);
// (원본 배열, 원본 시작위치, 타겟 배열, 타겟 배열 복사 시작위치, 복사할 길이)
```

2차원 배열은 행(row) 단위로 복사.

## String 메서드

**비교**

```java
boolean result = str1.equals(str2);  // 값 비교는 반드시 equals() (==는 참조 비교)
```

**특정 위치의 문자 추출**

```java
String subject = "자바 프로그래밍";
char charValue = subject.charAt(3);
```

**길이**

```java
subject.length();
```

**문자열 대체**

```java
String oldStr = "자바 문자열은 불변입니다. 자바 문자열은 String입니다.";
String newStr = oldStr.replace("자바", "JAVA");
```

**문자열 잘라내기**

```java
String substring(int beginIndex);
String substring(int beginIndex, int endIndex);

String birthDate = ssn.substring(7);     // 7부터 끝까지
String birthDate2 = ssn.substring(0, 6); // 0~5까지
```

**위치 찾기 / 포함 여부**

```java
int indexOf(int ch);              // 한 문자 찾기
int indexOf(int ch, int fromIndex);

String subject = "가나다라";
int location = subject.indexOf(keyword);
// fromIndex 이후부터 검색, 찾으면 위치값 반환, 없으면 -1
// 여러 개 찾으려면 반복문 필요

int indexOf(String str);
int indexOf(String str, int fromIndex);

boolean result = subject.contains("자바");  // 포함 여부만 boolean으로 확인
```

**문자열 분리 — split()**

```java
String str1 = "boo:and:foo";
String[] splited1 = str1.split(":");
// 콜론(:)을 기준으로 분리, 공백도 가능, | 연산자로 여러 구분자 조건 지정 가능

for (int i = 0; i < splited1.length; i++) {
    System.out.println(splited1[i]);
}
```

**정규표현식 매칭 예시**

![[Java_regex_match_example.png]]

## 객체 배열

```java
Circle[] c = new Circle[5]; // Step 1: 객체 배열 선언 및 생성
for (int i = 0; i < c.length; i++) {
    c[i] = new Circle(i);   // Step 2: 배열 원소마다 Circle 객체 생성
}
```
