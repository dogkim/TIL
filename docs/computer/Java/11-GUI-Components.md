## GUI 개요

**GUI(Graphical User Interface)**: 사용자 친화적인 상호작용 방식을 제공하는 화면 — 애플리케이션에 고유한 "룩앤필(look and feel)"을 부여함. **GUI 컴포넌트**(컨트롤, 위젯이라고도 함)로 구성되며 마우스·키보드 등으로 조작함.

- **Swing**: `javax.swing` 패키지 — Java의 대표적 GUI 툴킷, 크로스플랫폼 룩앤필인 **Nimbus** 등을 지원
- IDE의 GUI 디자인 도구는 컴포넌트의 위치·크기를 시각적으로 지정하면 그에 맞는 코드를 자동 생성해줌

## JOptionPane을 이용한 간단한 입출력

```java
String input = JOptionPane.showInputDialog("숫자를 입력하세요:");
int number = Integer.parseInt(input);
JOptionPane.showMessageDialog(null, "합계: " + number);
```

- `showInputDialog`: 사용자로부터 문자열 입력을 받는 대화상자
- `showMessageDialog`: 메시지를 표시하는 대화상자 (첫 인자가 `null`이면 화면 중앙에 표시)
- 둘 다 `JOptionPane`의 `static` 메서드 — 객체 생성 없이 호출

## 주요 GUI 컴포넌트 (Swing)

| 컴포넌트 | 역할 |
|---|---|
| `JFrame` | 최상위 윈도우 |
| `JPanel` | 다른 컴포넌트를 담는 컨테이너 |
| `JLabel` | 텍스트/이미지 표시 |
| `JButton` | 버튼 — 클릭 시 이벤트 발생 |
| `JTextField` | 한 줄 텍스트 입력 |
| `JComboBox` | 드롭다운 목록에서 선택 |
| `JCheckBox` / `JRadioButton` | 체크박스 / 라디오 버튼 |

## 이벤트 처리 기초

Swing은 **이벤트 기반(event-driven)** 프로그래밍 모델을 따름 — 버튼 클릭 등 사용자 동작이 발생하면 등록된 **리스너(listener)**의 메서드가 호출됨.

```java
JButton button = new JButton("Click Me");
button.addActionListener(e -> System.out.println("Clicked!"));
```

- `ActionListener`: 버튼 클릭 등에 반응하는 대표적 리스너 인터페이스, `actionPerformed(ActionEvent e)` 메서드를 구현
- Java 8 이후로는 람다 표현식으로 리스너를 간결하게 등록할 수 있음 ([[14-Lambdas-and-Streams]] 참고)
