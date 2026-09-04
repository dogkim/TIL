## 다형성이란

**다형성(polymorphism)**: "구체적으로" 프로그래밍하는 대신 "일반적으로" 프로그래밍할 수 있게 해줌 — 같은 슈퍼클래스를 공유하는 객체들을, 마치 모두 그 슈퍼클래스의 객체인 것처럼 하나의 방식으로 처리할 수 있음.

**예시**: `Fish`, `Frog`, `Bird`가 모두 `Animal`을 상속하고 각자 `move()`를 구현. 프로그램은 `Animal` 배열에 여러 종류의 객체를 담아두고, 매번 똑같이 `move()`를 호출하기만 하면 각 객체가 자신에게 맞는 방식으로 반응함.

**다형성의 장점 — 확장성**: 새로운 클래스를 상속 계층에 추가할 때, 그 계층을 범용적으로 처리하는 코드는 거의 수정할 필요가 없음 — 새 클래스와 직접 관련된 부분만 손보면 됨.

## 동적 바인딩(Dynamic Binding)

슈퍼클래스 타입 변수가 서브클래스 객체를 참조하고 있을 때, 그 변수로 메서드를 호출하면 **실행 시점**에 실제 객체의 타입에 따라 알맞은(오버라이드된) 서브클래스 버전이 호출됨.

```java
Animal a = new Bird();
a.move();   // 컴파일 시점엔 Animal.move()로 보이지만, 실행 시점엔 Bird.move()가 호출됨
```

- **is-a 관계는 위쪽으로만 성립**: 서브클래스 객체는 슈퍼클래스 객체로 취급될 수 있지만, 그 반대는 성립하지 않음 (슈퍼클래스 객체를 서브클래스 객체로 취급할 수 없음)
- **다운캐스팅(downcasting)**: 슈퍼클래스 참조를 명시적으로 서브클래스 타입으로 캐스팅해, 슈퍼클래스에 없는 서브클래스 고유 메서드를 호출할 수 있게 하는 기법
- `instanceof` 연산자로 다운캐스팅 전에 실제 객체의 타입을 확인하는 것이 안전함

```java
if (currentEmployee instanceof BasePlusCommissionEmployee) {
    BasePlusCommissionEmployee e = (BasePlusCommissionEmployee) currentEmployee;
    e.setBaseSalary(e.getBaseSalary() * 1.10);
}
```

## 추상 클래스 (Abstract Class)

객체를 생성할 의도가 없는, **상속 계층의 슈퍼클래스 역할만** 하는 클래스 — `abstract` 키워드로 선언하며, `new`로 인스턴스화할 수 없음.

```java
public abstract class Employee {
    public abstract double earnings();   // 추상 메서드 — 구현 없음, 세미콜론으로 끝남
}
```

- **추상 메서드**: 구현이 없는 메서드 선언 (`abstract` 키워드, 본문 없이 세미콜론) — 추상 메서드를 하나라도 포함하면 그 클래스는 반드시 `abstract`여야 함
- **구체 클래스(concrete class)**: 모든 추상 메서드를 구현해 인스턴스화 가능한 클래스 — 추상 슈퍼클래스의 각 구체 서브클래스는 상속받은 추상 메서드를 반드시 구현해야 함
- 생성자와 `static` 메서드는 `abstract`로 선언할 수 없음
- 추상 슈퍼클래스 타입을 매개변수로 받는 메서드는, 그 슈퍼클래스를 직간접적으로 상속하는 **어떤 구체 클래스의 객체든** 받을 수 있음 — 다형성을 통한 확장성의 대표적 사례

## 인터페이스 (Interface)

클래스가 인터페이스를 **구현(implements)**하면, 그 클래스의 모든 객체는 그 인터페이스 타입과 is-a 관계를 가지며, 인터페이스가 정의한 기능을 반드시 제공하게 됨. 서로 무관한 클래스들에 공통 기능을 부여하는 데 특히 유용 — 같은 인터페이스를 구현한 서로 다른 클래스의 객체들도 다형적으로 처리 가능(같은 인터페이스 메서드를 호출할 수 있음).

```java
public interface Movable {
    void move();
}
public class Bird implements Movable {
    public void move() { /* ... */ }
}
```

## 실전 사례 — 급여 시스템

`abstract class Employee`(추상 슈퍼클래스) → `SalariedEmployee`, `HourlyEmployee`, `CommissionEmployee`(구체 서브클래스), `BasePlusCommissionEmployee`(`CommissionEmployee`의 간접 서브클래스). `Employee` 배열에 다양한 서브클래스 객체를 담아두고 `toString()`·`earnings()`를 호출하면, 각 객체 타입에 맞는 버전이 **동적 바인딩(늦은 바인딩)**으로 실행 시점에 결정됨 — 슈퍼클래스 참조로는 슈퍼클래스에 선언된 메서드만 "호출"할 수 있지만, 실제로 "실행"되는 것은 다형적으로 서브클래스 구현임.
