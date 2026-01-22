---
title: 1. CSS 문법 살펴보기
---

### 1.1 문법 형식
CSS 문법은 선택자와 선언부로 구분됨.
**선택자**: CSS스타일을 적요할 HTML 태그를 선택하는 영역
**선언부**: 선택자에서 선택한 태그에 적용할 스타일을 작성하는 영역
```css
h1{color:red;}
선택자 {속성:값;}
		선언부
```
### 1.2 주석
HTML 처럼 코드에 주석을 넣을 수 있으며 다음 처럼 설정함
```css
/* 주석 내용 */
```
## 2. CSS 적용하기
---
### 2.1 내부 스타일 시트 사용
HTML에서 제공하는 style 태그를 통해 CSS코드를 작성하는 방식
```html
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Document</title>
		<style>
			/* CSS 코드*/
			h1{
				color: blue;
			}
		</style>
	</head>
	<body>
		<h1>외부 스타일 시트</h1>
	</body>
</html>
```

### 2.2 외부 스타일 시트 사용
CSS 코드 파일을 별도의 파일로 만들어 HTML과 CSS를 연결하는 방법
별도로 만드는 파일의 확장자는 .css가 되어야 함.
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Document</title>
		<link rel="stylesheet" herf="./style.css" />
	</head>
	<body>
		<h1>외부 스타일 시트</h1>
	</body>
</html>
```

```CSS
h1{
	color: red;
}
```
### 2.3 인라인 스타일 사용하기
h1태그 자체의 속성을 변경하여 사용
그럼에도 CSS파일을 분리하는 것이 가독성이 좋아 외부 스타일 방식을 많이 사용함
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Document</title>
	</head>
	<body>
		<h1 style="color: red; font-size: 24px">인라인 스타일</h1>
	</body>
</html>
```