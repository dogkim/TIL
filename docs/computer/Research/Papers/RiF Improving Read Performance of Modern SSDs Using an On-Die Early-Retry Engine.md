---
title: "RiF: Improving Read Performance of Modern SSDs Using an On-Die Early-Retry Engine"
conference: HPCA 2024
authors:
  - Myoungjun Chun
  - Jaeyong Lee
  - Myung-Seok Kim
  - Jisung Park
  - Jihong Kim
tags:
  - Computer_Architecture
  - NAND_Flash
  - SSD
  - Read-Retry
  - ODEAR
date_created: 2026-05-06
---
![[Rif_SSD_image.png|381]] - SSD그림

![[RiF_SSD_structure.png|382]] - SSD chip 구성

문제:
	기존 ECC는 고쳐보다가 안되면 전압 바꿔서 다시 읽는 식이었는데, 그러다보니 컨트롤러와 Chip사이의 데이터 이동이 많아져서 비효율적이었다.
해결 방법:
	Chip에 있는 Die에서 ECC를 하자!
	그러나 기존 LPDC가 너무 무거운 바람에 가볍게 바꾸기로 했다.
2차 해결:
	가벼운 RP 모듈에서 페이지의 일부를 검사해보고 고쳐질지 말지 견적만 재본다!
	고쳐질 것 같으면 넘기고	안될 것 같으면 즉시 다시 읽는다.

---

## I. INTRODUCTION

새로운 읽기 재시도 최적화 방식인 Retry-in-Flash(RiF)의 제안

RiF의 방식
- 기존 전압 식별 중심의 방식에서 벗어나, 재시도 필요 여부를 조기에 결정하는 방식 채택
- 온다이 조기 재시도(ODEAR) 엔진을 탑재한 독자적인 플래시 칩 설계
- 재시도 필요 판단 시 칩 내부에서 즉시 전압 조정 및 재읽기 수행으로 오프칩 전송 차단

성과: 실패한 읽기 데이터의 불필요한 전송을 방지하여 플래시 채널의 유효 읽기 대역폭 보존

## II. BACKGROUND
___
### A. Overview of NAND Flash Memory (기존 문제점)

- NAND 플래시는 셀의 문턱 전압($V_{TH}$)을 통해 데이터를 저장. (전자로 막아서 전압이 흐르지 않게 함)
- P/E 사이클(저장, 불러오기)이 반복됨에 따라 절연층이 손상되어 전하 누설이 발생
- $V_{TH}$ 분포의 이동 및 확장으로 인하여 RBER(Raw Bit Error Rate)이 증가

### B. Error Correction in SSDs (LDPC)

에러를 교정하기 위해 LDPC가 사용되어 왔음
	**LDPC**(Low-Density Parity-Check) : SSD에서 에러 교정을 위해 널리 사용되는 저밀도 패리티 검사 방식. - ECC(Error Correction Code)구현 알고리즘 중 하나

**기존 LPDC 작동 원리**:
- 패리티 체크 행렬 $H$를 통해 신드롬 벡터 $S$ 계산.
- 에러 부재 시 신드롬 비트의 합(Weight)은 0이 됨.

**디코딩 실패 및 Read-Retry**:
- RBER이 ECC의 정정 능력을 초과할 경우 디코딩 실패 발생.
- 읽기 전압($V^{Ri}_{REF}$)을 변경하여 데이터를 다시 읽는 Read-Retry 절차 진입.

- **지연 시간 공식**: $t_{READ} = (t_R + t_{DMA} + t_{ECC}) \times (N_{RR} + 1)$
    
    - $N_{RR}$: 읽기 재시도 횟수
    - $t_R$: 낸드 읽기 시간 (페이지 읽기)
    - $t_{DMA}$: 데이터 이동 시간
    - $t_{ECC}$: ECC 디코딩 시간

    $V^{Ri}_{REF}$ 값을 적절히 선택하여 평균 $N_{RR}$을 줄이는 것이 중요하다 
	$R_i$ : i번째 읽기 전압 
	$REF$ : reference (기준)

## III. READ RETRIES IN MODERN 3D-FLASH SSDS
___

**기존 오프칩 기반 Read-Retry 방식의 효율성 저하 요소 3가지**

1. **결정 지연 (Decision Latency)**
    - 오프칩 ECC 엔진이 재시도 여부를 최종 결정하는 구조적 한계 존재
    - 데이터가 컨트롤러로 완전히 전송되어 디코딩 절차를 마칠 때까지 재시도 필요성 확인 불가

2. **대역폭 낭비 (Bandwidth Wastage)**    
    - 복구가 불가능한(Uncorrectable) 페이지일지라도 에러 판단을 위해 반드시 컨트롤러로 전송되어야 함
    - 이 과정에서 불필요한 데이터가 채널을 점유하여 실제 유효 채널 대역폭(Effective Channel Bandwidth) 저하 초래

3. **디코딩 지연 (Decoding Latency)**    
    - 에러 밀도가 높은 페이지일수록 ECC 디코딩 시간($t_{ECC}$)이 기하급수적으로 증가함
    - 디코딩이 진행되는 동안 플래시 채널은 유휴(Idle) 상태가 되어 시스템 전체의 운용 효율성 감소

## IV. DESIGN OF RIF SCHEME
___

RiF는 **ODEAR(On-Die Early-Retry) 엔진**을 플래시 다이 내부에 구현하여, 에러 정정 전에 재시도 여부를 미리 예측

![[RiF_RiFdie_overview.png|580]]

### A. Overview of RiF Scheme

**ODEAR 엔진의 작동 순서**:
-  **① 데이터 감지 (RP: Read Preview):**
	셀 어레이에서 페이지 버퍼로 읽어온 데이터를 ODEAR 엔진 내의 **RP 모듈**이 먼저 훑어봄

- **Retry? (판단):** 에러가 감지된 수준이 고칠만 한지 확인
    **No (에러 없음/적음):** 곧바로 **②번**으로 이동
    **Yes (에러 많음):** 재시도가 필요하므로 **③번**으로 이동

- **② No인 경우 (Ready: 1):** 
	데이터가 정상이므로 **Status Register**에 "준비 완료" 신호를 보냄.
	이후 **⑥번** 통로를 통해 데이터를 I/O 인터페이스로 즉시 전송
    
- **③ Yes인 경우 (RVS: Read Voltage Selection):** 
	재시도가 필요하다고 판단되면, **RVS 모듈**이 다음 읽기 전압을 선택
	동시에 컨트롤러에 데이터가 준비되지 않음을 알림
    
- **④ 재시도 수행:**
	 선택된 전압을 바탕으로 셀 어레이에서 다시 데이터를 읽음
    
- **⑤ 완료:**
	재시도를 통해 깨끗한 데이터를 얻으면 **Status Register**에 신호를 보내고 데이터를 전송

### B. Read-Retry Prediction (RP Module)

RP 모듈은 LDPC 디코딩을 직접 수행하는 대신, 신드롬 웨이트(Syndrome Weight)와 RBER 사이의 상관관계를 이용

- **작동 방식**:
    1. 페이지 버퍼에서 데이터를 128bit씩 읽어 Segment Reg에 저장
	    (Reg에 담긴 값으로 연산하는 동안 buffer에 또 읽어옴)
    2. XOR 연산을 통해 신드롬 비트를 생성하고 1의 개수를 카운트(AC)
	    LPDC초기 단계와 유사, LPDC의 패리티 체크 행렬과 읽어온 데이터 연산
    3. weight counter가 신드롬 비트 중 1의 개수 검사, AC가 신드롬 weight 합산
    4. 합산된 신드롬 웨이트가 comparator에서 설정해둔 ($P_s$)을 넘으면 재시도

- **최적화**:
    - **Chunk-based Prediction**: 페이지 내 에러 분포가 균일하다는 점을 이용해 일부(4-KiB)만 검사하여 지연 시간을 줄임
    - **Syndrome Pruning**: 중복된 연산을 생략하여 하드웨어 부하를 최소화

---

## 결론

RiF 스킴은 불필요한 오프칩 데이터 전송을 차단함으로써 현대 3D NAND SSD의 I/O 성능을 크게 향상시킵니다. 실험 결과, 2K P/E 사이클 환경에서 기존 기술 대비 평균 72.1%의 대역폭 향상을 보였으며, 전력 및 면적 오버헤드는 무시할 수 있는 수준으로 나타남.