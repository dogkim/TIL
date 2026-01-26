---
title: 02 Arrays and Structures (Polynomial, Fast Transpose)
---
## Array (배열)
동일한 타입의 데이터를 연속적으로 배치하여 관리

**특징**
1. 연속 메모리 할당: 데이터들이 메모리 공간에 빈틈없이 붙어서 저장
2. 인덱스 활용: 데이터의 위치를 나타내는 번호(0부터 시작)를 사용
3. 임의 접근(Random Access): 원하는 위치의 데이터를 즉시 읽거나 쓸 수 있음 $O(1)$
### ADT of Array (배열의 추상 데이터 타입)
1. 순서쌍의 집합 <index, value>
2. 핵심 연산
	Retrival (참조): 배열의 특정위치에 있는 값을 추출
	Store (저장): 배열의 특정위치에 새로운 데이터를 넣거나 수정 
## 다항식 (Polynomial)

### 다항식의 추상 데이터 타입 (ADT)
- $a_i x^i$ 형태의 항(term)들의 집합
- $a_i$는 계수(coefficient), $i$는 지수(exponent)

### 다항식의 저장 방식 (Representation)

1. **모든 차수의 계수를 배열에 저장 (Dense Representation)**
	- **예**: $P(x) = 10x^5 + 6x^2 + 3$
	- **저장**: `[10, 0, 0, 6, 0, 3]` (특정 index의 data가 coefficient를 의미)
	    (지수에 index를 맞추는게 좋아보임)
	    
	- **장점**: 특정 항의 계수를 찾는 속도가 빠름.
	- **단점**: $x^{1000} + 1$ 처럼 희소한(Sparse) 다항식의 경우 비효율적 메모리 사용

2. **0이 아닌 항만 구조체 배열로 저장 (Sparse Representation)**
	계수가 0이 아닌 항의 `<계수, 지수>` 쌍만 모아서 저장하는 방식
	```c
	typedef struct {
		float coef;
		int expon;
	} term;
	```
	- **장점**: 항의 개수가 적은 경우 메모리를 효율적으로 사용
### Polynomial Addition (다항식 덧셈)
(구조체 배열의 경우)
배열을 순회하며 각 항의 지수를 비교하여 합산하는 방식의 알고리즘.

- **지수(Exponent) 비교 및 처리**:   
    - **지수가 같을 경우**: 두 항의 계수(`Coefficient`)를 가산.
        - 연산 결과가 0일 경우 삽입 없이 A와 B의 인덱스만 증가.
        - 연산 결과가 0이 아닐 경우 배열 C에 삽입하고 A, B, C의 모든 인덱스 증가.
    
	- **지수가 다를 경우**: 지수가 큰 쪽의 항을 결과 배열 C에 저장. 이후 해당 다항식의 인덱스(`pos`)와 결과 배열 C의 인덱스를 각각 증가.

- **루프 종료 후**: 두 다항식 중 한쪽의 순회가 먼저 종료되면, 나머지 다항식에 남은 항들을 결과 배열 C로 일괄 복사.

```c
typedef struct {
    float coef; // 계수
    int expon;  // 지수
} Term;

// 다항식 덧셈 함수
// 배열 A, B를 받아 결과인 배열 C리턴
// sizeA, sizeB 각각 배열의 크기기
Term* addPolynomials(Term A[], int sizeA, Term B[], int sizeB) {
    Term* C = (Term*)malloc(sizeof(Term) * (sizeA + sizeB));
    
    // A,B,C의 위치
    int posA = 0; 
    int posB = 0; 
    int posC = 0; 

    // 두 다항식 중 하나라도 끝날 때까지 반복
    while (posA < sizeA && posB < sizeB) {
    
		// 1. A의 지수가 더 큰 경우
        if (A[posA].expon > B[posB].expon) {
            C[posC++] = A[posA++];
        } 
        
		// 2. B의 지수가 더 큰 경우
        else if (A[posA].expon < B[posB].expon) {
            C[posC++] = B[posB++];
        } 
        
		// 3. 지수가 같은 경우 (계수 합산)
        else {
            float sum = A[posA].coef + B[posB].coef;
            if (sum != 0) {
                C[posC].coef = sum;
                C[posC++].expon = A[posA].expon;
            }
            posA++;
            posB++;
        }
    }

    // 4. 남은 항들 복사 (A 혹은 B가 먼저 끝났을 때)
    for (; posA < sizeA; posA++) {
	    C[posC++] = A[posA];
	}
	
    for (; posB < sizeB; posB++) {
	    C[posC++] = B[posB];
	}
	
    return C;
}
```

### Fast Transpose (희소 행렬의 빠른 전치)
희소 행렬의 전치 연산 시, 각 열의 데이터 개수를 파악하여 데이터가 삽입될 위치를 미리 결정하는 방식으로 진행.

$O(columns + elements)$의 시간이 걸림
일반적인 2차원 배열 전치는 $O(row \times col)$의 시간이 걸리지만, 메모리를 더 사용함으로 한 번의 순회로 전치를 끝낼 수 있음

**알고리즘 상세**
- **기초 데이터 구성**:
    - 원본 `matrix`의 데이터 개수(`count`) 파악.
    - 전치 후 결과 값을 담을 구조체 배열 `res[]` 준비.
    - 열의 개수(`colcount`) 파악.
        
- **열 빈도수 및 시작 위치 계산**:
    - 각 열에 속한 유효 데이터의 개수를 카운트.
    - 원본의 열이 결과의 행이 되기 때문에, 전치된 행렬의 각 행의 데이터 개수를 미리 계산
```c
for (int i = 1; i < count; i++){
	col_count[matrix[i].col]++;
}
```

**startpos**: 각 열이 결과 배열에서 시작될 인덱스 설정.
```C
startpos[0] = 1
for(int i =1; i<colcount ; i++) {
	startpos[i] = startpos[i-1] + colcount[i-1];
}
```

**데이터 재배치 및 전치**
- 결과 행렬 `res[0]`에 행/열 크기 및 데이터 수 저장.
- 원본을 순회하며 `startpos`를 참조하여 위치 결정 후 데이터 삽입. 삽입 시마다 해당 열의 `startpos` 값을 증가시켜 다음 삽입 위치 확보.
```C
res[0].row = matrix[0].col
res[0].col = matrix[0].row
res[0].data = matrix[0].data

for (int i = 1; i <= count; i++) {
	int j = startpos[matrix[i].col]++;
	res[j].row = matrix[i].col;
	res[j].col = matrix[i].row;
	res[j].data = matrix[i].data;
}
```