---
title: 01 프로그램 평가 기준
---

**프로그램의 평가 기준**
- 프로그램이 효과적으로 메모리를 사용하고 있는가?
- 프로그램이 작업에 적합한 러닝 타임을 가지고 있는가?

**Program complexity (프로그램 복잡도)**
기계 독립적인 추정치를 획득 해야 정확한 알고리즘의 실용성 파악 가능
- Time complexity(시간 복잡도)
	프로그램이 완료되기까지 필요한 계산시간
- Space complexity(공간 복잡도)
	프로그램이 완료되기까지 필요한 메모리 양

**Performance evaluation phases (성능 평가 단계)**
- Performance analysis(성능 분석) : 연역적 평가 / 실제로 하는 게 X

- Performance measurement(성능 측정) : 귀납적 테스팅 / 실제로 걸린 시간 측정
```C
#include <time.h>
start = clock();
//~~~~~
stop = clock();
double duration = (double)(stop - start) / CLOCK_PER_SEC;
```
```C
#include <time.h>
//time() 함수는 초단위로 측정된 시간을 반환
start = time(NULL);
//~~~~~
stop = time(NULL);
double duration = (double) difftime(stop,start);
```
**Perfomance measurement의 문제점**
1. 알고리즘을 직접 구현하고 테스트하는 과정을 거쳐야함
	- 복잡한 경우 부담
2. 똑같은 하드웨어나 소프트웨어 환경을 사용해야함
3. 실험에 사용하지 않은 데이터들에 대해 다른 결과가 나올 수 있음

## Performace Analysis
### Space Complexity
**S(P)= c + Sp(n)**

- S(P) : 프로그램 P의 공간 요구량
- c : 상수 (고정 공간 요구량)
- Sp​(n) : 가변적 부분 :  **Instance characteristics**에 따라 달라짐 
- n : 인스턴스 특성 (예: 입출력 크기, 개수)

**Instance characteristic 예시**
1. 프로그램 실행 중 정수 a를 입력하여 a개의 실수를 저장할 수 있는 배열을 생성한다. -> a에 따라 사용하는 메모리 공간의 양이 달라짐
    
2. 프로그램 실행 중 정수 k를 입력하여 1부터 k까지의 합을 계산한다. -> k에 따라 계산 시간이 변경됨

**Space complexity 예시**
```C
float abc(float a, float b, float c){
	return a+b+b*c+(a*b-c) / (a+b) + 4.00;
}
```
Variable part가 없음!
S abc(n) = 0
```C
float rsum(float list[], int n){
	if (n != 0){
		return rsum(list, n-1) + list[n-1];
	}
	return 0;
}
```

| Type                              | Name   | Number of bytes |
| --------------------------------- | ------ | --------------- |
| parameter: array pointer          | list[] | 4               |
| parameter: integer                | n      | 4               |
| return address: (used internally) |        | 4               |
| TOTAL per reculsive call          |        | 12              |
n+1번 함수 호출 하기 때문에
최악의 경우
if n is MAX_SIZE
	S rsum(MAX_SIZE) = 12 * (MAX_SIZE + 1)