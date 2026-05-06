![[Pasted image 20260504005455.png|440]] - SSD그림


![[Pasted image 20260504005526.png|462]] - SSD chip 구성


RBER(Raw Bit Error Rate) : 에러비트 비율

4p 
$t_{READ} = (t_R + t_{DMA} + t_{ECC}) × (N_{RR} + 1)$ (1)
$N_{RR}$ : number of read retries

$t_R$: 페이지 감지 시간 Nand read time
$t_{DMA}$ : 칩과 컨트롤러 데이터 이동시간 Direct memory access time
$t_{ECC}$ : LDPC디코더가 에러 검출 및 수정시간 포함 Error correction code time
$V^{Ri}_{REF}$ 값을 적절히 선택하여 평균 $N_{RR}$을 줄이는 것이 중요하다 
$R_i$ : i번째 읽기 전압 
$REF$ : reference (기준)

LDPC(Low-Density Parity-Check) : 에러를 고침. ECC 종류중 하나
오류 정정횟수가 기준을 넘어서면?
전압을 바꿔서 다시 읽음 ($N_{RR}$ 증가)

에러인지 판별만 하는 칩을 on die로 만들자

$t_{ECC}$ , $t_{DMA}$ 둘 다 줄여짐

## III. READ RETRIES IN MODERN 3D-FLASH SSDS

기존방식에서 효율성을 저하시키는 요소 3가지

1. 오프칩 ECC 엔진이 읽기 재시도 절차를 시작하기로 결정 하기 때문에 읽기 데이터가 디코딩될 때까지 읽기 재시도가 필요한지 알 수 없습니다.	
2. 둘째, 복구 불가능한 페이지와 디코딩 가능한 페이지(칩 외부 ECC 엔진으로 디코딩 가능) 모두 칩 외부 ECC 엔진으로 전송되어야 하므로 SSDone의 유효 채널 대역폭이 크게 저하됩니다
3. ECC 디코딩 지연 시간(즉, tECC)이 증가하면 채널 대역폭이 덜 효율적으로 활용될 수 있음을 관찰했습니다.

Flash chip 내부의 Flash die에서 지원

## IV. DESIGN OF RIF SCHEME
### A. Overview of RiF Scheme
![[Pasted image 20260506154721.png|455]] - RiF die 구성 그림

ODEAR엔진 사용.
1. 감지된 페이지가 오프칩 ECC 디코더에 의해 복구 불가능한지 예측
2. 만약 그렇다면 읽기 참조 전압 을 조정
3. 조정된 $V^{Ri}_ {REF}$ 값을 사용하여 동일한 페이지를 다시 읽을 수 있음.
### . ODEAR 엔진의 작동 순서

1. **① 데이터 감지 (RP: Read Preview):** 낸드 셀 어레이에서 페이지 버퍼로 읽어온 데이터를 ODEAR 엔진 내의 **RP 모듈**이 먼저 훑어봅니다. 이는 정식 ECC 디코딩보다 훨씬 빠르고 가벼운 에러 예측 과정입니다.
    
2. **Retry? (판단):** 에러가 감지된 수준이 재시도가 필요한 정도인지 엔진이 판단합니다.
    
    - **No (에러 없음/적음):** 곧바로 **②번** 과정으로 갑니다.
    - **Yes (에러 많음):** 재시도가 필요하므로 **③번** 과정으로 갑니다.
        
3. **② No인 경우 (Ready: 1):** 데이터가 정상이므로 **Status Register**에 "준비 완료" 신호를 보냅니다. 이후 **⑥번** 통로를 통해 데이터를 I/O 인터페이스로 즉시 전송합니다.
    
4. **③ Yes인 경우 (RVS: Read Voltage Selection):** 재시도가 필요하다고 판단되면, 엔진 내부의 **RVS 모듈**이 최적의 읽기 전압을 선택합니다. 동시에 컨트롤러에는 아직 데이터가 준비되지 않았음을 알립니다.
    
5. **④ 재시도 수행:** 선택된 전압을 바탕으로 셀 어레이에서 다시 데이터를 읽습니다.
    
6. **⑤ 최종 준비 완료:** 재시도를 통해 깨끗한 데이터를 얻으면 그제야 **Status Register**에 신호를 보내고 데이터를 전송합니다.

### B. 림 

page buffer에서 128bit씩 읽어옴
segment reg에 임시 저장
	(reg에 담긴 값으로 연산하는 동안 buffer에 또 읽어옴)

XOR, syndrome_reg : LPDC초기 단계와 유사. 
	LPDC의 패리티 체크 행렬과 읽어온 데이터 연산

weight counter가 신드롬 비트 중 1의 개수 검사, AC가 신드롬 weight 합산

comparator에서 설정해둔 $P_s$ 와 Syndrome weight 비교해서 다시 읽을지 판단