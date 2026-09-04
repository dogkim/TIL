## 문자열 포매팅

```python
print(f"{x}와 {y}의 합={x+y}")
print("x is %d and y is %s" % (x, y))
```

## type / 주소값

```python
type(12.30)
```

```python
x = 3
id(x)  # x가 가리키는 객체의 메모리 주소값
```

## 올림·내림·반올림

소수점 둘째 자리까지 계산, 1의 자리에서 반올림 시 `round(tax, -1)`

```python
import math

math.ceil(tax)     # 올림
round(tax, 2)       # 반올림 (소수점 2자리까지)
math.floor(tax)     # 내림
```

## 대소문자 변환

```python
test = "TEST"
lower = test.lower()  # lower == "test"
```

## 문자열 쪼개기 — split()

- `split('인자')`
- 인자를 전달하지 않으면 공백을 기준으로 쪼갬
- 인자를 전달하면 해당 인자를 기준으로 쪼갬

```python
date = "2024-04-03"
split = date.split('-')  # split == ['2024', '04', '03']
print(split)
```

## 문자열 공백 제거 — strip()

문자열 앞뒤 공백을 제거

```python
variable = "           1234           "
code = variable.strip()  # code == '1234'
print(code)
```

## 문자열 변경 — replace()

`replace(변경할 문자열, 변경될 문자열)`

```python
code = "12, 100, 500, 242"
print(code.replace(",", ""))  # 콤마(,)가 제거된 "12 100 500 242" 출력
```

## os

```python
import os
os.getcwd()  # 현재 작업 디렉토리 경로 반환
```

## set 함수

![[Python_set_function_example.png]]

## dict — items()

```python
car = {"name": "BMW", "price": "7000"}
car.items()
# dict_items([('name', 'BMW'), ('price', '7000')])

for key, val in car.items():
    print("key : {} value : {}".format(key, val))
```

## 정렬

```python
mylist = [3, 2, 1, 5, 4]
mylist.sort()             # mylist 자체를 정렬
new_list = sorted(mylist) # 정렬된 새 리스트를 반환
```

## random

```python
abc = ['e', 'd', 'a', 'c', 'b']
random.choice(abc)   # 리스트에서 무작위로 하나 선택
random.shuffle(abc)  # 리스트 순서를 무작위로 섞음 (원본 변경)

range(1, 7)

random.random()  # 0.0 이상 1.0 미만의 실수 난수, 예: 0.90389642027948769
```
