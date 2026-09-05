## Max-Heap

완전 이진 트리(complete binary tree) 구조이면서, **부모가 항상 자식보다 크거나 같은** 성질(max-heap property)을 만족하는 자료구조. 배열로 구현하면 인덱스 $i$의 자식은 $2i, 2i+1$, 부모는 $\lfloor i/2 \rfloor$.

### MAX-HEAPIFY(A, i)

배열 $A$와 인덱스 $i$에 대해, $i$의 왼쪽·오른쪽 서브트리는 이미 max-heap이지만 $A[i]$ 자체는 자식보다 작을 수 있는 상황에서, $i$를 루트로 하는 서브트리 전체가 max-heap 성질을 만족하도록 만듦.

- $i$, `left(i)`, `right(i)` 중 가장 큰 값을 찾아 `largest`로 지정
- `largest`가 $i$가 아니면 $A[i]$와 $A[\text{largest}]$를 교환하고, `largest` 위치에 대해 재귀적으로 MAX-HEAPIFY 호출
- **Time**: $O(\log n)$ (트리 높이만큼 아래로 내려갈 수 있음)

### BUILD-MAX-HEAP(A)

정렬되지 않은 배열 $A$를 max-heap으로 만듦.

- 리프가 아닌 마지막 노드($\lfloor n/2 \rfloor$)부터 인덱스 1까지 역순으로 MAX-HEAPIFY 호출
- 리프 노드는 이미 그 자체로 heap이므로 건너뜀
- **Time**: 얼핏 $O(n\log n)$처럼 보이지만, 각 노드의 MAX-HEAPIFY 비용이 트리에서 아래로 내려갈 수 있는 높이에 비례하고 높이가 낮은 노드(리프에 가까운 노드)가 대부분이므로 합산하면 **$O(n)$**으로 tight하게 bound됨

### HEAPSORT(A)

1. BUILD-MAX-HEAP(A)로 전체를 max-heap으로 만듦
2. 루트(최댓값, $A[1]$)를 배열의 마지막 유효 위치와 교환하고, heap 크기를 1 줄임
3. 줄어든 heap에 대해 MAX-HEAPIFY(A, 1) 호출로 다시 max-heap 성질 복원
4. heap 크기가 1이 될 때까지 2~3 반복 — 매번 최댓값이 뒤에서부터 확정되며 정렬 완성

**Time**: BUILD-MAX-HEAP $O(n)$ + (MAX-HEAPIFY $O(\log n)$) × $(n-1)$번 = $O(n\log n)$

**공간**: in-place 정렬 ($O(1)$ 추가 공간) — 다만 merge sort와 달리 **stable하지 않음**.
