## 리스트 순회

```python
temps = [28, 31, 33, 35, 27, 26, 25]
for i in range(len(temps)):
    print(temps[i], end=', ')
```

## zip 함수

2개의 리스트를 받아서 항목 2개씩을 묶어서 제공

```python
questions = ['name', 'quest', 'color']
answers = ['Kim', '파이썬', 'blue']
for q, a in zip(questions, answers):
    print(f"What is your {q}? It is {a}")
```

## append()

```python
heroes = []  # 공백 리스트를 생성
heroes.append("아이언맨")  # 리스트에 "아이언맨"을 추가
heroes.append("토르")      # 리스트에 "토르"를 추가
print(heroes)
```

## insert()

```python
sunnes = ["일순이", "삼순이"]
sunnes.insert(1, "이기자부대")
# sunnes = ["일순이", "이기자부대", "삼순이"]
```

## index()

```python
sunnes = ["일순이", "이기자부대", "삼순이"]
if "이기자부대" in sunnes:
    n = sunnes.index("이기자부대")
```

## 요소 삭제하기

1. 위치를 아는 경우 → `pop(index)`
2. 값을 아는 경우 → `remove(value)` (값이 여러 개면 첫 번째 하나만 삭제됨)

```python
heroes = ["아이언맨", "토르", "헐크"]
a = heroes.pop(1)
print(a)
```

```python
heroes = ["아이언맨", "토르", "헐크"]
if "토르" in heroes:
    heroes.remove("토르")  # 삭제하려는 값이 없으면 예외가 발생해 프로그램이 종료됨
```

## 최댓값·최솟값

```python
values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
min(values)
max(values)
```

## 정렬

```python
a = [3, 2, 1, 5, 4]
a.sort()              # [1, 2, 3, 4, 5]
a.sort(reverse=True)  # [5, 4, 3, 2, 1]
# 한글 등 다른 문자열 정렬도 가능

b = sorted(a)  # 원본은 유지하고, 정렬된 새 리스트를 반환
```

## 리스트 컴프리헨션

```python
words = ["All", "good", "things", "must", "come", "to", "an", "end."]
letters = [w[0] for w in words]
# letters == ['A', 'g', 't', 'm', 'c', 't', 'a', 'e']
```

## 복사

```python
import copy

# 1차원 리스트의 경우
temps = [28, 31, 33, 35, 27, 26, 25]
values = list(temps)
# 다른 방법 2: values = temps[:]
# 다른 방법 3: values = copy.copy(temps)
temps[0] = 0
print(temps, values)  # values는 영향받지 않음 (얕은 복사로 충분한 1차원 리스트)

# 2차원 리스트인 경우 (얕은 복사로는 내부 리스트가 공유되므로 깊은 복사가 필요)
temps2 = [[28, 31, 33], [35, 27, 26, 25]]
values2 = copy.deepcopy(temps2)
temps2[0][0] = 0
print(temps2, values2)
```

## 리스트 슬라이싱

```python
temps = [1, 2, 3, 4, 5, 6, 7]
sublist = temps[2:6]
# sublist == [3, 4, 5, 6]

# 역순 만들기
sublist[::-1]

# 슬라이스 대입으로 리스트 일부 변경
lst = [1, 2, 3, 4, 5, 6, 7, 8]
lst[0:3] = ['a', 'b', 'c']
# lst == ['a', 'b', 'c', 4, 5, 6, 7, 8]

lst[::2] = [99, 99, 99, 99]
# 슬라이스 길이와 대입값 개수가 정확히 맞아야 함 (안 맞으면 에러)
# lst == [99, 'b', 99, 4, 99, 6, 99, 8]
```

## 2차원 리스트 동적 생성

```python
rows = 3
cols = 5
s = []
for row in range(rows):
    s += [[0] * cols]  # 2차원 리스트끼리 이어붙임
print("s =", s)
```
