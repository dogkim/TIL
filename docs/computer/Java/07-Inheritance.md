## 상속이란

**상속(inheritance)**: 기존 클래스의 멤버를 흡수하고 새롭거나 수정된 기능을 덧붙여 새 클래스를 만드는 소프트웨어 재사용 방식. 이미 검증된 고품질 소프트웨어를 바탕으로 새 클래스를 만들 수 있어 개발 시간을 절약함.

- **슈퍼클래스(superclass)**: 기존(기반) 클래스
- **서브클래스(subclass)**: 상속받는(파생) 클래스 — 슈퍼클래스보다 더 **구체적/특화된(specialized)** 그룹을 나타냄 (그래서 상속을 **specialization**이라고도 부름)
- 서브클래스는 슈퍼클래스의 동작을 그대로 물려받으면서, 자신만의 필드·메서드를 추가할 수 있음
- **직접 슈퍼클래스**: `extends`로 명시적으로 상속받는 대상. **간접 슈퍼클래스**: 클래스 계층에서 그보다 더 위에 있는 클래스
- Java의 모든 클래스는 직간접적으로 `Object` 클래스를 상속함 (아무것도 `extends`하지 않으면 암묵적으로 `Object`를 상속)
- Java는 **단일 상속(single inheritance)**만 지원 — 클래스는 정확히 하나의 직접 슈퍼클래스만 가짐 (다중 상속은 인터페이스로 대체)

## is-a vs has-a

- **is-a 관계** = 상속. 서브클래스 객체는 슈퍼클래스 객체로도 취급될 수 있음 (예: `Rectangle` **is-a** `Shape`)
- **has-a 관계** = 합성. 한 객체가 다른 객체를 멤버로 포함 (예: `Employee` **has-a** `Date`)

## 슈퍼클래스와 서브클래스

슈퍼클래스는 더 일반적이고, 서브클래스는 더 구체적 — 슈퍼클래스가 나타내는 객체의 집합이 서브클래스가 나타내는 집합보다 보통 더 큼. 클래스들을 계층으로 나타낸 것을 **상속 계층(inheritance hierarchy)**이라 하며, 계층의 화살표는 is-a 관계를 나타냄.

**오버라이딩(Overriding)**: 서브클래스가 상속받은 메서드가 자신에게 맞지 않으면, 같은 시그니처로 메서드를 **재정의**해 적합한 구현으로 바꿀 수 있음.

## protected 멤버

`public`과 `private`의 중간 수준 접근 제어 — 그 슈퍼클래스 자신, 서브클래스들, 그리고 같은 패키지의 다른 클래스에서 접근 가능. 서브클래스가 오버라이드한 슈퍼클래스 메서드를 호출하려면 `super.메서드명()` 형태로 접근.

```java
class Base {
    protected int value;
    void show() { System.out.println("Base: " + value); }
}
class Derived extends Base {
    @Override
    void show() {
        super.show();   // 슈퍼클래스 버전 호출
        System.out.println("Derived: " + value);
    }
}
```

## 생성자와 상속

- **생성자는 상속되지 않는다.**
- 서브클래스 생성자가 가장 먼저 하는 일은 (명시적이든 암묵적이든) 직접 슈퍼클래스의 생성자를 호출하는 것 — 슈퍼클래스로부터 물려받은 인스턴스 변수가 제대로 초기화되도록 보장
- 명시적으로 슈퍼클래스 생성자를 호출하지 않으면, Java가 암묵적으로 슈퍼클래스의 기본(무인자) 생성자를 호출함

```java
class Employee {
    Employee(String name) { this.name = name; }
}
class CommissionEmployee extends Employee {
    CommissionEmployee(String name, double sales) {
        super(name);   // 반드시 첫 문장에서 슈퍼클래스 생성자 호출
        this.sales = sales;
    }
}
```

**`toString`**: 모든 클래스가 `Object`로부터 직간접적으로 상속받는 메서드 중 하나 — 객체를 나타내는 `String`을 반환. 보통 오버라이드해서 사람이 읽기 좋은 형태로 재정의함.
