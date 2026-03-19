True before and after each iteration of a loop
## Prove the correctness
불변성을 증명하기 위한 3가지 요건
### 1. Initialization: (초기)
 It is **true prior to the first iteration** of the loop
 루프가 **첫 번째 반복을 시작하기 전**에 불변성이 참인지 확인
### 2. Maintenance: (유지)
If it is true before an iteration of the loop, it **remains true before the next iteration**
**어느 한 반복의 시작 전**에 불변성이 참이라면, **다음 반복의 시작 전**에도 참인지 확인
### 3.Termination: (종료)
When the loop terminate, the **invariant gives us a useful property** that helps show that the algorithm is correct.
**루프가 종료되었을 때** 알고리즘이 의도한 목적을 달성했는지 (유용한지)확인
### 예시 (insertion sort의 경우)

**불변성 정의:** 루프의 각 반복이 시작될 때, 하위 배열 $A[1 \dots j-1]$은 **정렬된 상태**이다

**요건 확인**
1. **Initialization (초기):**
    $j=2$일 때 시작하므로, 하위 배열 $A[1 \dots 1]$은 요소가 하나뿐이다
    요소가 하나인 배열은 항상 정렬되어 있으므로 **참**
    
2. **Maintenance (유지):** 
    $A[1 \dots j-1]$이 정렬된 상태라면, 루프 내부에서 $A[j]$를 적절한 위치에 삽입하여 $A[1 \dots j]$를 정렬된 상태로 만든다
    $j$가 증가하여 다음 반복으로 넘어가도 이 성질은 **유지**
    
3. **Termination (종료):**
    $j$가 $n+1$이 되어 루프가 종료되면, 불변성에 의해 하위 배열 $A[1 \dots n]$이 정렬된 상태로 종료
    전체 배열이 정렬된 채로 종료
