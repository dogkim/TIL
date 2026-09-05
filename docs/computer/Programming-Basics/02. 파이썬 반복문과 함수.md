## 반복문

```python
for i in range(10, 0, -1):
    print(i, end=" ")

sum = 0
n = 10
for i in range(1, n + 1):
    sum = sum + i
print("합=", sum)
```

```python
i = 1
sum = 0
# i 값이 10보다 작거나 같으면 반복
while i <= 10:
    sum = sum + i
    i = i + 1
print("합계는", sum)
```

`break`, `continue`도 동일하게 사용

```python
for i in range(1, 11):
    if i % 3 == 0:
        continue
    print(i, end="")
```

## 함수

```python
def 함수이름(매개변수1, 매개변수2):
    명령문...
```

- 변수는 **call by value**
- 리스트는 **call by address**

**가변인수**도 허용

```python
def add(*numbers):
    sum = 0
    for n in numbers:
        sum = sum + n
    return sum

print(add(10, 20))
print(add(10, 20, 30))
```

**함수 안에서 전역 변수 사용**

```python
gx = 100

def myfunc():
    global gx
    gx = 20
    print(gx)

myfunc()
print(gx)
```

