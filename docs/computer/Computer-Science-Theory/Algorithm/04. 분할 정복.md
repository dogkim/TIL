## Divide and Conquer

문제를 작은 부분문제로 **나누고(divide)**, 각각을 재귀적으로 **해결(conquer)**한 뒤, **합친다(combine)**.

## Merge Sort

정렬된 두 배열을 하나의 정렬된 배열로 합치는 방식을 재귀적으로 적용.

**Loop invariant (merge 단계)**: 매 반복 시작 시, 두 출력 서브배열은 이미 정렬되어 있고, 두 입력 서브배열의 나머지 원소들과 함께 놓고 봤을 때 원래 원소들의 정렬된 상태를 이룬다.

**Time**: $T(n) = 2T(n/2) + \Theta(n)$ → Master method Case 2 → $T(n) = \Theta(n\log n)$ (분할: $\Theta(1)$, 합치기/merge: $\Theta(n)$)

**단점**: in-place가 아니며 $\Theta(n)$의 추가 공간이 필요.

## Quick Sort

pivot을 하나 선택해, pivot보다 작은 값들과 큰 값들로 배열을 두 부분으로 나눈 뒤(partition) 각 부분을 재귀적으로 정렬.

**Loop invariant (partition 단계)**: 인덱스 $i$까지는 pivot 이하인 원소들만 모여 있고, $i+1$부터 현재 탐색 위치 전까지는 pivot보다 큰 원소들만 모여 있다.

**Time**
- **Balanced split**: 매번 절반씩 나뉘면 $T(n) = 2T(n/2) + \Theta(n) = \Theta(n\log n)$
- **Unbalanced split (worst case)**: 매번 $1$개와 $n-1$개로 나뉘면(이미 정렬된 배열에 첫/마지막 원소를 pivot으로 쓰는 경우) $T(n) = T(n-1) + \Theta(n) = \Theta(n^2)$

**Randomized Pivot**: pivot을 무작위로 선택하면 worst case를 특정 입력에 의존하지 않게 만들어 기대 실행시간을 $\Theta(n\log n)$으로 만듦.
- 증명의 핵심은 **조화급수(harmonic series)**: $\sum_{k=1}^{n} 1/k = \Theta(\log n)$를 이용해, 어떤 두 원소가 비교되는 횟수의 기댓값 합을 구하면 전체 비교 횟수 기댓값이 $O(n\log n)$이 됨.

## SELECT (순서통계량, order statistics)

정렬 없이 배열에서 $i$번째로 작은 원소를 찾는 문제.

**단순 방법**: 전체를 정렬 후 $i$번째 원소 반환 → $O(n\log n)$

**median of medians (선형시간 SELECT)**
1. 배열을 5개씩 그룹으로 나눔
2. 각 그룹을 정렬해 중앙값을 구함 ($O(n)$, 그룹 크기가 상수이므로)
3. 중앙값들의 중앙값(median of medians)을 재귀적으로 구해 pivot $x$로 사용
4. $x$ 기준으로 partition, $i$번째 원소가 있는 쪽만 재귀

**Correctness (Inductive hypothesis)**: 재귀 호출이 항상 더 작은 크기의 배열에서 올바른 $k$번째 원소를 반환한다고 가정하면, 이 알고리즘도 올바른 $i$번째 원소를 반환함 (귀납적으로).

**Runtime 분석**
- 단순 pivot 사용 시 worst case: $O(n^2)$ (quicksort와 동일한 이유)
- **Median of medians pivot 사용 시**: 최소한 전체 원소의 약 $3/10$이 pivot보다 작고, 약 $3/10$이 크다는 것이 보장됨 → 재귀는 항상 최대 $7n/10$ 크기의 배열에 대해서만 이뤄짐
- 재귀식: $T(n) \le T(n/5) + T(7n/10) + O(n)$
- **Substitution method**로 $T(n) = O(n)$ 증명: $T(n) \le cn/5 + 7cn/10 + O(n) = 9cn/10 + O(n) \le cn$ ($c$를 충분히 크게 잡으면 $O(n)$ 항을 흡수 가능, $n/5 + 7n/10 = 9n/10 < n$이므로 계수 합이 1보다 작아 수렴)
