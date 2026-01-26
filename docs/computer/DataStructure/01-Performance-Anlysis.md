---
title: 01 Performance Anlysis
---
### 1. 프로그램의 평가 기준
- **공간 효율성**: 프로그램이 실행되는 동안 메모리를 얼마나 효과적으로 사용하는가?  
- **시간 효율성**: 프로그램이 특정 작업을 수행하는 데 걸리는 시간이 적절한가?
### 2. 프로그램 복잡도 (Program Complexity)
기계 독립적인 추정치를 획득 해야 정확한 알고리즘의 실용성 파악 가능
- **Time complexity(시간 복잡도)**
	프로그램이 완료되기까지 필요한 계산시간
- **Space complexity(공간 복잡도)**
	프로그램이 완료되기까지 필요한 메모리 양

### 3. 성능 평가 단계 (Performance evaluation phases)
- **Performance analysis(성능 분석)** 
	연역적 평가
	프로그램을 실제 실행하지 않고 알고리즘의 논리적 단계를 통해 복잡도를 계산

- **Performance measurement(성능 측정)**
	귀납적 테스팅
	실제 실행 시간 측정
```C
#include <time.h>
clock_t start = clock();
// 실행 코드 --
clock_t stop = clock();
double duration = (double)(stop - start) / CLOCK_PER_SEC;
```
```C
#include <time.h>
//time() 함수는 초단위로 측정된 시간을 반환
start = time(NULL);
// 실행 코드 --
stop = time(NULL);
double duration = (double) difftime(stop,start);
```

**Perfomance measurement의 문제점**
1. 알고리즘을 직접 구현하고 테스트하는 과정을 거쳐야함 (복잡한 경우 부담)
2. 하드웨어 및 컴파일러 등 실험 환경에 따라 결과가 가변적임
3. 실험에 사용하지 않은 데이터들에 대해 다른 결과가 나올 수 있음

### 4. Space Complexity (공간 복잡도) 분석
고정적 부분과 가변적 부분의 합으로 표현
$S(P) = c + S_p(n)$

- $S(P)$ : 프로그램 P의 공간 요구량
- $c$ : 인스턴스 특성에 무관한 고정 공간 (예: 코드 저장 공간, 단순 변수)
- $S_p​(n)$ : 가변적 부분 :  인스턴스 특성($n$)에 따라 크기가 결정되는 공간 (예: 재귀 함수시 쌓이는 stack frame)
- $n$ (Instance characteristics) : 인스턴스 특성(예: 입출력 크기, 개수)

**Instance characteristic 예시**
1. 프로그램 실행 중 정수 a를 입력하여 a개의 실수를 저장할 수 있는 배열을 생성한다. -> a에 따라 사용하는 메모리 공간의 양이 달라짐
    
2. 프로그램 실행 중 정수 k를 입력하여 1부터 k까지의 합을 계산한다. -> k에 따라 계산 시간이 변경됨

**Space complexity 예시**

예시 1:
```C
float abc(float a, float b, float c){
	return a+b+b*c+(a*b-c) / (a+b) + 4.00;
}
```
$a, b, c$의 크기에 상관없이 추가로 할당되는 가변 공간이 없음 (Variable part X)
$S_{abc}(n) = 0$

예시 2:
호출될 때마다 시스템 스택에 매개변수, 지역 변수, 복귀 주소 등을 포함한 스택 프레임(Stack Frame)이 쌓임
```C
float rsum(float list[], int n){
	if (n != 0){
		return rsum(list, n-1) + list[n-1];
	}
	return 0;
}
```

| Type                     | Name   | Number of bytes |
| ------------------------ | ------ | --------------- |
| parameter: Array pointer | list[] | 4               |
| parameter: Integer       | n      | 4               |
| return address: (내부 처리용) |        | 4               |
| TOTAL per reculsive call |        | 12              |
n에 대해서 n ~ 0 까지 $n+1$번 호출

최악의 경우
$S_{rsum}(MAX\_SIZE) = 12 \times (MAX\_SIZE + 1)$