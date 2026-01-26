---
title: 03 Stacks and Queues
---

### Maze 

### Post fix

스택으로 구현.
pop, push, isdigit, priority, stackpriority

convert

stack, top 전역

postfix[cnt]
```C
for(int i = 0; infix[i] != 0; i++){
	token = infix[i];
	if(isdigit(token)){
		postfix[cnt++] = token;
	}
	else{
		if(token == ')'){
				
		}
	}
}
```

infix돌다가 
1. 숫자 뜨면 일단 post에 넣기.
2. ')' 뜨면 '(' 뜰 때 까지 pop
3. 기호면 우선순위 비교해서 먼저 계산 되어야할 놈이면 꺼내고(pop 하고) push
	1. '('이 stack에 있으면 리셋 개념으로 무조건 push
infix 다 돌면 stack[top] != EOS 까지 pop

## MAZE
일단 받아

move만들고
stack 시작 지점 넣고

못찾거나, stack empty면 while 탈출

position pop하고
temp에 복사

못찾으면서 temp.dir<8 이면
next.x 랑 next.y에 temp + move

	next가 탈출이면
	push temp, next
	found 1
	
다음이 갈수 있는 공간이면 (maze == 0 , make == 0)
	mark 다음 공간 = 1;
	position을 temp로 이동
	position.dir 높히고 push

	temp = next;
	temp.dir = 0;

못가는 공간이면 
	dir++;

다음공간 지정.

탈출이면 현재, 다음 push
다음 가지면
	make = 1
	temp 확정. postion = temp
	dir++
	postion push
	
	temp = next;
	temp.dir =0;
아니면 temp.dir+