## 조건문

```python
if price > 20000:
    shipping_cost = 0
else:
    shipping_cost = 3000

print("배송비 = ", shipping_cost)
```

## 문자열 비교

문자열끼리도 `==`로 비교 가능

```python
s1 = "Audrey Hepburn"
s2 = "Audrey Hepburn"

print(s1 == s2)
# True
```

## 실수 비교

부동소수점 연산은 오차가 생길 수 있으므로 `==`로 직접 비교하면 안 됨

```python
from math import sqrt
n = sqrt(3.0)
if n * n == 3.0:
    print("sqrt(3.0)*sqrt(3.0)은 3.0과 같다.")
else:
    print("sqrt(3.0)*sqrt(3.0)은 3.0과 같지 않다.")

# 대신 오차 허용범위(epsilon)를 두고 비교
if abs(n * n - 3.0) < 0.00001:
    print("sqrt(3.0)*sqrt(3.0)은 3.0과 같다.")
```

## 난수(random)

```python
import random
x = random.randint(1, 100)  # 1 ~ 100 사이의 정수형 난수 생성
y = random.randint(1, 100)

answer = int(input(f"{x} + {y} = "))

flag = (answer == (x + y))
print(flag)
```
