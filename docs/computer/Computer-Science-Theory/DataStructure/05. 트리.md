## 개념 정리

**List Representation**: `( A ( B ( E ( K L ) F ) C ( G ) D ( H ( M ) I J ) ) )` 처럼 부모 뒤에 괄호로 자식들을 묶어 트리 구조를 문자열로 표현.

**Left Child, Right Sibling**: 자식 수가 일정하지 않은 일반 트리를, 각 노드가 "첫 번째 자식"과 "다음 형제"만 가리키는 이진 트리 구조로 변환해서 저장하는 방식.

**Tree와 Binary Tree의 차이점**
1. Empty인 Tree는 존재할 수 없지만, Binary Tree는 empty(노드가 0개)인 경우가 가능
2. Binary Tree의 자식은 왼쪽/오른쪽 **순서를 구분**하지만, 일반 Tree의 자식들은 순서가 없음

## 순회 (Traversal)

1. **Preorder**: print → left → right
2. **Inorder**: left → print → right
3. **Postorder**: left → right → print

```c
void PreOrder(NODE* h) {
    if (h) {
        printf("%d ", h->data);
        PreOrder(h->left);
        PreOrder(h->right);
    }
}

void InOrder(NODE* h) {
    if (h) {
        InOrder(h->left);
        printf("%d ", h->data);
        InOrder(h->right);
    }
}

void PostOrder(NODE* h) {
    if (h) {
        PostOrder(h->left);
        PostOrder(h->right);
        printf("%d ", h->data);
    }
}
```

## Level Order Traversal

큐를 사용해 트리를 레벨(깊이) 순서대로 순회.

```c
void level_order(NODE* h) {
    NODE* queue[100] = {0};
    int front = 0, rear = 0;
    NODE* p = NULL;

    if (h == NULL) return;

    queue[rear++] = h;
    while (front < rear) {
        p = queue[front++];
        printf("%d ", p->data);

        if (p->left)  queue[rear++] = p->left;
        if (p->right) queue[rear++] = p->right;
    }
}
```

**진행 방식**: 루트를 큐에 넣고 시작 → 큐에서 하나 꺼내(dequeue) 출력 → 그 자식들을 큐에 넣음(enqueue) → 큐가 빌 때까지 반복. FIFO 구조 덕분에 같은 레벨의 노드들이 먼저 들어온 순서대로 먼저 처리되어 자연스럽게 레벨 순서가 유지됨.

## Binary Tree 성질

- 높이 $h$인 (포화) 이진 트리의 최대 노드 수: $2^h - 1$
- Edge 개수 = Node 개수 $- 1$
- $\sum(\text{degree}) = \text{edge} \times 2$ (각 edge가 부모·자식 양쪽의 degree에 기여)
- Degree가 0인 노드(leaf) 개수 = Degree가 2인 노드 개수 $+ 1$
  - 자식이 2개인 노드가 하나 늘어날 때마다, 그 자리에 leaf가 하나 더 생겨나는 구조이기 때문

## Priority Queue

| 구현 방식 | Insertion | Deletion |
|---|---|---|
| Unordered array | $O(1)$ | $O(n)$ |
| Unordered linked list | $O(1)$ | $O(n)$ |
| Sorted array | $O(n)$ | $O(1)$ |
| Sorted linked list | $O(n)$ | $O(1)$ |
| **Max heap** | $O(\log n)$ | $O(\log n)$ |

정렬 여부와 관계없이 삽입/삭제 중 하나는 $O(n)$이 걸리는 단순 구현들과 달리, heap은 **둘 다 $O(\log n)$**으로 균형 잡힌 성능을 냄 — priority queue의 표준 구현으로 heap을 쓰는 이유.

## Heap (배열 기반 Max Heap)

**Insertion**
1. 배열의 끝자리(+1)에 새 값을 일단 넣음
2. 부모와 비교해서 자신이 더 크면, 부모 값을 현재 자리로 복사하고 한 칸 위(부모 자리)로 이동
3. 더 이상 부모보다 크지 않을 때까지 반복한 뒤, 최종 위치에 값을 삽입

**Deletion (최댓값 제거)**
1. 루트(최댓값)를 출력하고, 배열 마지막 값을 임시로 `temp`에 보관
2. `parent = root`, `child = 왼쪽 자식`으로 시작
3. 위치 찾기 반복:
   - 오른쪽 자식이 왼쪽 자식보다 크면 `child`를 오른쪽으로 변경 (두 자식 중 큰 값 선택)
   - `temp`가 선택된 `child`보다 크거나 같으면 반복 종료
   - 아니면 `child` 값을 `parent` 자리로 끌어올리고, `parent`·`child`를 한 단계씩 아래로 재지정
4. 반복이 끝난 자리에 `temp` 삽입

## BST (Binary Search Tree)

**Search**: 루트에서 시작해, 찾는 값이 현재 노드보다 작으면 왼쪽, 크면 오른쪽으로 이동하며 재귀/반복 탐색.
- **Average case**: 트리가 균형 잡혀 있다면 $O(\log n)$
- **Worst case**: 편향된(한쪽으로 치우친) 트리라면 사실상 연결 리스트와 같아져 $O(n)$ — 이 worst case를 막기 위해 나온 것이 red-black tree 같은 균형 이진 탐색 트리
