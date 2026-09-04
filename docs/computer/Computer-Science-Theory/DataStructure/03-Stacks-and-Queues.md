# 1. Stack

한쪽 끝(Top)에서만 데이터의 삽입과 삭제가 이루어지는 Last-In First-Out (후입선출) 구조.

- **Top**: 데이터의 삽입과 삭제가 일어나는 지점
- **Bottom**: 스택의 가장 밑 부분

## 1-1. 추상 데이터 타입 (ADT) 및 연산

스택의 모든 기본 연산은 $O(1)$의 시간 복잡도를 가짐

| **연산** | **설명** | **시간 복잡도** |
|---|---|---|
| `CreateS(n)` | 최대 크기가 $n$인 빈 스택 생성 | $O(1)$ |
| `Push(item)` | 스택의 가장 위에 데이터를 추가 | $O(1)$ |
| `Pop()` | 스택의 가장 위 데이터를 제거 및 반환 | $O(1)$ |
| `Peek/Top()` | 가장 위 데이터를 제거하지 않고 확인만 함 | $O(1)$ |
| `IsEmpty()` | 스택이 비어있는지 확인 | $O(1)$ |
| `IsFull()` | 스택이 가득 찼는지 확인 (배열 구현 시) | $O(1)$ |

## 1-2. 구현 방식

### 배열 기반 구현 (Array-based)
- **정적 배열**: 고정된 크기를 사용하여 구현이 간단함, 크기 제한이 있음
- **동적 배열 (Array Doubling)**: 스택이 가득 차면 `realloc` 등을 통해 크기를 2배로 늘림. 개별 삽입은 $O(n)$이 걸릴 수 있지만, 평균적인 분할 상환(Amortized) 복잡도는 $O(1)$

### 연결 리스트 기반 구현 (Linked List-based)
- **특징**: 포인터로 노드를 연결하여 크기 제한 없이 동적으로 확장 가능
- **장점**: 메모리 낭비가 적고 'Stack Full' 상태를 걱정할 필요가 없음
- **단점**: 데이터 외에 포인터 저장 공간이 추가적으로 필요

# 2. Queue

한쪽 끝(Rear)에서 삽입, 반대쪽 끝(Front)에서 삭제가 이루어지는 First-In First-Out (선입선출) 구조.

- **Front**: 데이터가 삭제(dequeue)되는 지점
- **Rear**: 데이터가 삽입(enqueue)되는 지점

## 2-1. ADT 및 연산

| **연산** | **설명** | **시간 복잡도** |
|---|---|---|
| `CreateQ(n)` | 최대 크기가 $n$인 빈 큐 생성 | $O(1)$ |
| `Enqueue(item)` | Rear에 데이터를 추가 | $O(1)$ |
| `Dequeue()` | Front의 데이터를 제거 및 반환 | $O(1)$ |
| `IsEmpty()` / `IsFull()` | 상태 확인 | $O(1)$ |

## 2-2. 구현 방식

### 원형 큐 (Circular Queue)
배열을 단순 선형으로 쓰면 dequeue가 반복될수록 앞쪽 공간이 낭비됨 — front, rear 인덱스를 `(idx + 1) % n`으로 순환시켜 배열 앞쪽 빈 공간을 재사용.

### 연결 리스트 기반 구현
front/rear 포인터를 각각 유지. enqueue는 rear 뒤에 노드 추가 후 rear 갱신, dequeue는 front 노드를 제거하고 front를 다음 노드로 갱신 — 모두 $O(1)$.

# 3. Stack의 응용

## 3-1. 중위 표기법 → 후위 표기법 변환 (Infix to Postfix)

숫자와 연산자(`+ - * /`)로 이뤄진 중위식을 스택을 이용해 후위식으로 변환.

**진행 규칙** (infix를 왼쪽부터 순회하며)
1. **숫자**를 만나면 그대로 postfix 결과에 추가
2. **`)`**를 만나면 대응하는 `(`가 나올 때까지 스택에서 pop해서 postfix에 추가
3. **연산자**를 만나면, 스택 top의 연산자가 자신보다 우선순위가 높거나 같으면 pop해서 postfix에 추가한 뒤, 자신을 push
   - 단, **`(`**가 스택 top에 있으면 우선순위 비교 없이 그냥 push (괄호는 그 안에서 다시 리셋되는 개념)
4. infix를 다 순회한 후, 스택에 남은 연산자를 모두 pop해서 postfix에 추가

```c
for (int i = 0; infix[i] != 0; i++) {
    token = infix[i];
    if (isdigit(token)) {
        postfix[cnt++] = token;
    } else if (token == ')') {
        while (stack[top] != '(') {
            postfix[cnt++] = pop();
        }
        pop(); // '(' 버림
    } else {
        while (top >= 0 && stack[top] != '(' &&
               priority(stack[top]) >= priority(token)) {
            postfix[cnt++] = pop();
        }
        push(token);
    }
}
while (top >= 0) {
    postfix[cnt++] = pop();
}
```

## 3-2. 미로 탐색 (Maze Solving with Stack)

현재 위치에서 갈 수 있는 다음 칸을 스택에 쌓아가며 탐색하고, 막히면 스택을 pop해서 이전 갈림길로 되돌아가는(backtracking) 방식.

**진행 절차**
1. 시작 위치를 스택에 push, 현재 위치의 탐색 방향(`dir`)을 0으로 초기화
2. 스택이 비거나 출구를 찾을 때까지 반복:
   - 스택 top의 위치를 pop해서 `temp`로 삼음
   - `temp.dir < 8`(8방향을 다 시도하지 않았으면):
     - `dir` 방향으로 한 칸 이동한 위치를 `next`로 계산
     - `next`가 출구면 `temp`, `next`를 모두 push하고 탐색 종료
     - `next`가 갈 수 있는 빈 공간이면: 그 칸을 방문 표시하고, `temp`를 다시 push(`dir` 증가시켜서) → 새 위치(`next`)로 이동해 `dir=0`부터 재탐색
     - `next`가 갈 수 없는 공간이면 `temp.dir`만 증가시키고 같은 위치에서 다음 방향 시도
   - `temp.dir >= 8`이면(8방향 모두 막힘): 그 위치를 버리고(스택에 다시 안 넣음) 이전 위치로 자연스럽게 backtracking

스택을 쓰는 이유: 막다른 길에 다다랐을 때 **가장 최근의 갈림길로 되돌아가야 하는** 것이 정확히 LIFO 구조와 맞아떨어지기 때문.
