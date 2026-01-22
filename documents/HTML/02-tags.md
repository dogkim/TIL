---
title: 02 각종 태그
---

## 1. 텍스트 작성하기
### 1.1 hn 태그 
제목이나 주제를 나타내는 텍스트를 표현할 때 사용
``` html
<hn>제목<hn>
```
---
``` html
<h1>Heading level</h1>
<h2>Heading level</h2>
<h3>Heading level</h3>
<h4>Heading level</h4>
<h5>Heading level</h5>
<h6>Heading level</h6>
```
---
hn 태그로 작성된 키워드는 검색 엔진에서 키워드로 인식
h1이 가장 중요도가 높으며 크고 굵게 표현 됨
### 1.2 p 태그
본문의 문단을 작성할 떄 사용
``` html
<p>내용</p>
```
---
``` html
<p>p 태그는 하나의 문단을 작성할 때 사용된다.</p>
```
---
### 1.3 br태그
문단에서 줄 바꿈 할 때 사용
``` html
<br>
```
p 태그 안에서 줄바꿈을 하더라도 br 태그를 사용하지 않으면 줄 바꿈이 되지 않은 채 출력됨

### 1.4 blockquote 태그
출처에서 인용한 문단 단위의 텍스트 작성시 사용
``` html
<blockquote cite="출처 URL">문단 단위 인용문</blockquote cite>
```
```html
<blockquote cite="https://www.google.com">
	<p>구글</p>
</blockquote cite>
```
### 1.5 q 태그
blockquote와 유사하게 문단 안의 텍스트 단위의 인용문 작성시 사용
```html
<q cite="출처 URL"> 짧은 인용문 </q>
```
### 1.6 ins, del 태그
ins는 추가된 택스트임을, del은 기존의 텍스트가 삭제 됨을 나타냄
```html
<ins>추가 텍스트</ins>
<del>추가 텍스트</del>
```
### 1.7 sub, sup 태그
sub는 아래 첨자, sup은 위 첨자에 해당하는 텍스트 작성시 사용
```html
<p>공기의 원소 기호는 H<sub>2</sub>O
<p>4<sup>2</sup>은 16입니다.</p>
```
<p>공기의 원소기호는 H<sub>2</sub>O</p>
<p>4<sup>2</sup>은 16입니다.</p>
hn, p, br을 주로 사용
## 2. 그룹 짓기
### 2.1 div 태그
블록요소와 인라인 요소를 그룹으로 묶을 때 사용.
div 태그 자체는 블록 요소
```html
<body>
	<div>
		<p>컴퓨터 공학</p>
		<p>페이지</p>
	</div>
	<div>
		<p>철학</p>
		<p>페이지</p>
	</div>
</body>
```

### 2.2 span 태그
인라인 요소를 그룹으로 묶을때 사용
span태그는 인라인 요소 -> p 태그 안에 들어가 있어도 줄바꿈이 되지 않음

```html
<div>
	<p>영화 소개</p>
	<P>이번 영화의 <span>하이라이트</span> 장면은 바로 여기입니다.</p>
<div>
```
# 3.목록
### 3.1 ul 태그
비순서형 목록을 만들때 사용되며, 목록내용은 li태그로 구성 됨
```html
<ul>
	<li>목록 내용 1</li>
	
	<li>목록 내용 2</li>
	
	<li>목록 내용 3</li>
<ul>
```
- 목록 내용 1
- 목록 내용 2
- 목록 내용 3
### 3.2 ol 태그
순서형 목록을 생성할 때 사용되며 li태그로 목록 내용을 구성함
```html
<ol>
	<li>목록 내용 1</li>
	
	<li>목록 내용 2</li>
	
	<li>목록 내용 3</li>
<ol>
```
1. 목록 내용 1
2. 목록 내용 2
3. 목록 내용 3
### 3.3 dl 태그
정의형 목록을 만들 때 사용, 목록을 생성할 때는 dt태그로, 설명을 작성할 떄는 dd태그로 작성
```html
<dl>
	<dt>용어 1</dt>
	<dd>용어 설명 1</dd>
	<dt>용어 2</dt>
	<dd>용어 설명 2</dd>
</dl>
```
용어 1
	용어 설명 1
용어 2
	용어 설명 2
## 4. 링크와 이미지
### 4.1 a태그
html 내부나 외부링크를 생성
```html
<body>
	<a href="https://www.naver.com/">네이버</a>
</body>
```
<a href="https://www.naver.com/">네이버</a>
### 4.2 img 태그
이미지를 삽입하고 싶을 때 사용
```html
<img src="이미지 경로" alt="이미지 설명">
```
### 4.3 이미지 링크
a태그와 img태그를 같이 사용
```html
<body>
	<a href="https://www.naver.com/">
		<img src="이미지 경로" alt="이미지 설명"/>
	</a>
</body>
```
## 5. 텍스트 강조
### 5.1 strong 태그
텍스트를 굵게 표시
```html
<strong>중요한 텍스트!!!!</strong>
```
<strong>중요한 텍스트!!!!</strong>
### 5.2 em태그
기울임 효과
```html
<em>기울이기~</em>
```
<em>기울이기~</em>
## 6 폼 구성하기
form 이란 HTML에서 사용자와 상호작용 해서 정보를 입력받고 서버로 전송하기 위한 양식을 의미함 
### 6.1 form 태그
폼 양식을 의미하는 태그, HTML의 폼을 구성하는 태그는 모두 form 태그 안에 작성됨
```html
<form action= "서버 url" method="get 또는 post"></form>
```
action
	사용자에게 입력 받은 값을 전송한 서버의 URL주소 입력
method
	입력받은 값을 서버에 전송할 때의 송신 방식
### 6.2 input 태그
입력받는 요소를 생성할 때 input 태그를 사용
input 태그에는 type, name, value 속성이 있는데 type은 필수이며, name, value는 선택 사용 가능합니다.
```html
<input type="종류" name="이름" value="초깃값">
```
type 종류
	text, password, tel, url, image(이미지로 버튼 요소 생성), time, color 등등이 가능
name
	입력 요소의 이름을 작성. form태그에 의해 서버로 전송될때의 이름을 지정함
value
	입력 요소의 초깃값을 작성한다.
### 6.3 label 태그
form 태그 안에서의 상호작용 요소에 이름 붙일 때 사용
label 태그만 클릭해도 상호작용 요소를 선택 할 수 있음.
```html
<label>
	아이디
	<input tyoe="text">
</label>

<label for="userpw"> 비밀번호</label>
<input type="password" id="userpw">
```
<label>
	아이디
	<input tyoe="text">
</label>

### 6.4 fieldset, legend 태그
form 태그안에 사용된 상호작용 요소를 fieldset을 이용해 그룹 지을 수 있음.
이러한 그룹을 legend태그로 이름 붙힐 수 있음
```html
<body>
	<form>
		<fieldset>
			<legend>기본정보</legend>
			<label>
				아이디
				<input type="text"/>
			</label>
			<br />
			<label>
				비밀번호
				<input type="text">
			</label>
		</fieldset>
	</form>
</body>
```
<body>
	<form>
		<fieldset>
			<legend>기본정보</legend>
			<label>
				아이디
				<input type="text"/>
			</label>
			<br />
			<label>
				비밀번호
				<input type="text">
			</label>
		</fieldset>
	</form>
</body>

### 6.5 textarea 태그
여러가지 입력요소를 생성할 때는 input이 아닌 textarea태그를 사용
```html
<textarea>초깃값</textarea>
```
<textarea>초깃값</textarea>
input과 달리 닫는 태그가 있음
### 6.6 select, option, optgroup 태그
select태그로 콤보박스를 생성할 수 있음.
항목하나는 option 태그를 사용하며 항목을 그룹으로 묶을 때는 optgroup을 사용
```html
<select name="city" id="city" size="1" multiple>
	<optgroup label="서울시">
		<option value="강북구">강북구</option>
		<option value="강남구" selected>강남구</option>
		<option value="서초구">서초구</option>
	</optgroup>
	<optgroup label="경기도 성남시">
		<option value="중원구">중원구</option>
		<option value="분당구">분당구</option>
	</optgroup>
</select>
```
<select name="city" id="city" size="1" >
	<optgroup label="서울시">
		<option value="강북구">강북구</option>
		<option value="강남구" selected>강남구</option>
		<option value="서초구">서초구</option>
	</optgroup>
	<optgroup label="경기도 성남시">
		<option value="중원구">중원구</option>
		<option value="분당구">분당구</option>
	</optgroup>
</select>

### 6.7 button 태그
input 태그에서 type으로 button을 지정할 수 있지만, 따로 생성할 수도 있음
시작과 종료 태그가 있어 콘텐츠를 작성 할 수 있으며, 꾸미기 더욱 용이함
```html
<button type="submit">
	<img src="이미지 주소" alt="이미지 버튼">
	등록하기
<button>
```
### 6.8 폼 관련 태그에서 사용할 수 있는 추가 속성
**- disabled**
	input, textared, select, button 태그에 사용가능. 비활성화 시킴.
```html
<태그 disalbleed>
```

**- readonly**
읽기 전용으로 바뀌며, 텍스트 입력이 안되는 대신, 드래그와 복사등은 가능함
```html
<태그 readonly>
```

**- maxlength**
입력할 수 있는 글자수를 제한
```html
<태그 maxlength="숫자">
```

**- checked**
요소를 선택된 상태로 표시 (checkbox나 radio요소에서 사용)
```html
<태그 checked>
```

**- placeholder**
입력 요소에 어떤 값을 입력하면 되는지 힌트를 적는 용도
```html
<body>
	<form>
		<input type="text" placeholder="힌트"/>
	</form>
</body>
```
<body>
	<form>
		<input type="text" placeholder="힌트"/>
	</form>
</body>

## 7. 표 만들기
### 7.1 table 태그
html에서 표를 생성할 때는 table 태그를 사용하며, 표 관련 태그는 모두 table 안에서 사용 됨
```html
<table> </table>
```
### 7.2 caption 태그
표의 제목을 지정함
```html
<table>
	<caption>표 제목</caption>	
</table>
```
### 7.3 tr 태그
tr 태그는 표에서 행을 생성함
### 7.4 th, td 태그
표에서 열을 생성할 때 사용되며 th는 제목을 나타내는 열을, td는 일반적 데이터를 나타내는 열을 생성할 때 사용됨
### 7.5 rowspan, colspan
rowspan으로 행과 행을 결합, colspan으로 열과 열을 병합
```html
<body>
	<table>
		<tr>
			<th>번호</th>
			<th>상품명</th>
			<th>수량</th>
		</tr>
		<tr>
			<td>1</td>
			<td>콜라</td>
			<td>1개</td>
		</tr>
		<tr>
			<td>2</td>
			<td>사이다</td>
			<td rowspan="2">2개</td>
		</tr>
		<tr>
			<td>3</td>
			<td>환타</td>
			%% 3행 3열은 2행 3열과 병합했으므로 생성 X %%
		</tr>
		<tr>
			<td>총 개수</td>
			<td colspan="2">5개</td>
		</tr>		
	</table>
</body>
```
<body>
	<table>
		<tr>
			<th>번호</th>
			<th>상품명</th>
			<th>수량</th>
		</tr>
		<tr>
			<td>1</td>
			<td>콜라</td>
			<td>1개</td>
		</tr>
		<tr>
			<td>2</td>
			<td>사이다</td>
			<td rowspan="2">2개</td>
		</tr>
		<tr>
			<td>3</td>
			<td>환타</td>
		</tr>
		<tr>
			<td>총 개수</td>
			<td colspan="2">5개</td>
		</tr>		
	</table>
</body>

### 7.6 thead, tfoot, tbody 태그
표에서도 행을 묶어 그룹화할 수 있는데, thead, tfoot, tbody 태그를 사용
thead 태그는 헤더 영역에 해당하는 행을, tfoot 태그는 푸터 영역에 해당하는 행을, tbody 태그는 본문 영역에 해당하는 행을 그룹 지음
반드시 thead, tfoot, tbody 순서여야 함
```html
<table>
	<thead>
		<th></th>
	</thead>
	<tfoot>
		<td></td>
	</tfoot>
	<tbody>
		<td></td>
	</tbody>
</table>
```
### 7.7 col과 colgroup 태그
열을 그룹화할 때는 col 태그와 colgroup태그를 사용.
col은 하나의 열을, colgroup태그는 span속성과 함께 2개 이상의 열을 그룹화 함

### 7.8 scope 속성
제목이 나타내는 셀의 범위를 지정함. 단순히 웹 접근성 향상을 목적으로 사용.
```html
<table>
	<tr>
		<th scope="col">구분</th>
		<th scope="col">중간고사</th>
		<th scope="col">기말고사</th>
	</tr>
	<tr>
		<th scope="row">전공</th>
		<td>A+</td>
		<td>B+</td>
	</tr>
	<tr>
		<th scope="row">교양</th>
		<td>C+</td>
		<td>B</td>
	</tr>
</table>
```
<table>
	<tr>
		<th scope="col">구분</th>
		<th scope="col">중간고사</th>
		<th scope="col">기말고사</th>
	</tr>
	<tr>
		<th scope="row">전공</th>
		<td>A+</td>
		<td>B+</td>
	</tr>
	<tr>
		<th scope="row">교양</th>
		<td>C+</td>
		<td>B</td>
	</tr>
</table>
## 8. 멀티미디어 설정
### 8.1 audio 태그
src 속성과 함께 사용하며, src에는 경로를 입력함. 오디오 컴트롤 패널이 웹브라우저에 노출되도록 controls 속성을 설정해야 함

```html
<audio src="오디오 파일 경로" controls></audio>
```

### 8.2 video 태그

```html
<video src="비디오 파일 경로" controls></video>
```

### 8.3 source 태그
audio 태그와 video 태그에 리소르 파일을 경로와 미디어 타입을 명사하는데 사용

```html
<audio controls>
	<source src="파일 경로" type"미디어 타입">
</audio>
```

audio와 video태그는 웹 브라우저별로 지원하는 포맷이 다름.
먼저 작성한 source 부터 확인하다 전부 지원하지 않으면 밑의 텍스트를 노출시킴.

```html
<audio controls>
	<source src="sample.wav" type"audio/wav">
	<source src="sample.mp3" type"audio/mp3">
	지원하지 않는 웹 브라우저입니다.
</audio>
```

## 9. 시맨틱 태그
**- header**
웹페이지의 헤더 영역을 구분하는데 사용

**- nav**
웹 페이지 내부의 다른 영역이나 외부를 연결하는 링크 영역을 구분하는데 사용

**- section**
웹 페이지에서 논리적으로 관련있는 내용 사이를 구분 하기 위해 사용
보통 제목을 나타내는 hn 태그를 포함

**- article**
웹 페이지에서 독립적인 영역을 구분하기 위해 사용
어떤 웹페이지에서도 독립적으로 사용될 수 있는 영역을 구분한다는 점에서 section과 차이가 있음

**- aside**
주력 내용이나 독립적인 내용이 아니라 article이나 section에 들어가기 어려운 것에 사용
ex) 홈페이지 사이드 광고 배너

**- footer**
웹 페이지의 푸터영역을 구분할 때 사용. 저작권, 연락처 등의 요소를 포함

**- main**
웹페이지의 주요 내용을 지정할 때 사용하는 태그.
문서에 반복되서 등장하는 요소를 포함해서는 안되며, main 태그를 article, aside, footer, header, nav 태그의 하위에 포함 할 수도 없음.

## 10. 태그 종류에 상관없이 사용하는 글로벌 속성
**- class**
요소에 클래스 명을 지정할 때 사용함. 클래스명은 CSS에서 클래스 선택자로 활용되며, 같은 클래스명을 여러 요소가 중복해서 가질 수 있음.
```html
<p class="red-color"> ... </p>
```

**- id**
요소에 아이디를 지정할 때 사용됩니다.
```html
<h1 ud="title" ... </h1>
```

**- style 속성**
style 속성은 CSS 코드를 인라인으로 작성할 때 사용됨

**- title**
title 속성은 요소에 추가 정보를 넣을 때 사용되며, 마우스를 올리면 툴팁으로 표시됨
```html
<body>
	<p title="사실 거짓말이야">100만원 줄게, 글자에 마우스 올려봐</p>
</body>
```
<body>
	<p title="사실 거짓말이야">100만원 줄게, 글자에 마우스 올려봐</p>
</body>
