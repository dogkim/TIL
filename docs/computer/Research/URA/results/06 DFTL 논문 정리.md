---
title: "DFTL: A Flash Translation Layer Employing Demand-based Selective Caching of Page-level Address Mappings"
conference: ASPLOS 2009
authors:
  - Aayush Gupta
  - Youngjae Kim
  - Bhuvan Urgaonkar
tags:
  - Computer_Architecture
  - NAND_Flash
  - SSD
  - FTL
  - Flash_Translation_Layer
date_created: 2026-08-17
---
문제:
	기존 hybrid FTL(BAST/FAST/Superblock/LAST)은 data block(block-level 매핑)과 log block(page-level 매핑)의 매핑 단위가 서로 달라서, GC 때 이 둘을 맞춰주는 비싼 full merge가 반복적으로 발생함.
해결 방법:
	log block이라는 개념 자체를 없애고, 모든 블록을 page 단위로 매핑하는 순수 page-level FTL(DFTL)로 재설계.
2차 해결:
	그런데 page-level 매핑 테이블 전체를 SRAM에 올리기엔 너무 큼 → workload의 temporal locality를 이용해 자주 쓰는 매핑만 SRAM(CMT)에 caching하고, 나머지는 flash 자체에 저장한 뒤 GTD로 위치만 추적.

---

## I. 서론

The FTL is one of the core engines in flash-based SSDs that maintains a mapping table of virtual addresses from upper layer(s) to physical addresses on the flash.

최신 FTL은 페이지 단위 매핑과 블록 단위 매핑을 혼합하는 중간 방식을 취하며, 주로 다음과 같은 핵심 아이디어를 기반으로 합니다(개별 FTL의 복잡성은 2절에서 설명합니다). 대부분의 블록(데이터 블록)은 블록 단위로 매핑되는 반면, "업데이트" 블록이라 불리는 소수의 블록은 페이지 단위로 매핑되어 데이터 블록 내 페이지의 업데이트를 기록하는 데 사용됩니다.

**기존 hybrid FTL의 3가지 한계**
1. 이러한 하이브리드 방식은 가비지 컬렉션 동작이 비효율적입니다.
2. 성능 최적화를 위해 설정하기 어려운 워크로드별 튜닝 가능 매개변수가 많이 포함되어 있는 경우가 많습니다.
3. (가장 중요) 대부분의 엔터프라이즈급 워크로드가 나타내는 액세스의 시간적 지역성(temporal locality)을 제대로 활용하지 못합니다.

현재 지배적인 하이브리드 FTL과 달리, DFTL은 순수하게 페이지 매핑 방식을 사용합니다.

**논문 구성**
- 2장: 다양한 기존 FTL 방식의 분류를 포함한 플래시 메모리 기술의 기초
- 3장: DFTL의 설계와 하이브리드 FTL 방식과의 비교
- 4장: 시뮬레이터 FlashSim의 프레임워크
- 5장: 실험 결과
- 6장: 결론

## II. 배경 및 관련 연구
___

Moreover, the specification for large block based flash devices requires sequential programming within the block.

대형 블록 기반 플래시 장치에 대한 사양은 블록 내 순차적 프로그래밍을 요구
- Mapping table 크기를 줄이기 위해 block 내의 page를 순차적으로 적고, 따로 table에 기록하지 않음.
- Block-level/hybrid FTL의 log block 메커니즘: "log block 내 페이지 위치 = data block 내 offset" (정렬이 맞을 때만 성립 — 순차 쓰기라 오프셋이 일치하는 경우. 안 맞으면 뒤에 나오는 full merge가 필요)

### A. 기존 하이브리드 FTL의 설계

모든 방식은 페이지 수준(page-level) 방식과 블록 수준(block-level) 방식의 하이브리드 형태

데이터 블록(Data Blocks)과 로그/업데이트 블록(Log/Update Blocks)이라는 두 그룹으로 구분
- 데이터 블록은 대부분을 차지하며 블록 수준 매핑 방식을 사용하여 매핑됩니다.
- 두 번째 특수 유형의 블록은 로그 블록(log blocks)이라 불리며, 이 블록의 페이지들은 페이지 수준 매핑 스타일을 사용하여 매핑됩니다.

기본적으로 log에 넣고 다 차면 data로 옮김. 다른 경우에도 merge 발생.

**merge 종류**

![[DFTL_merge_types.png]]

1. **스위치 병합(Switch merge)**
	로그 블록 B가 데이터 블록 A에 해당하는 모든 유효한 순차 기록 페이지를 포함하고 있으므로, 간단한 스위치 병합이 수행되어 로그 블록 B가 새로운 데이터 블록이 되고 기존 데이터 블록 A는 삭제
	→ Log를 Data로 바꾸고 Data는 erase.
2. **부분 병합(Partial merge)**
	데이터 블록 A의 유효한 페이지만 로그 블록 B로 복사되고 원래의 데이터 블록 A는 삭제되며 블록 B의 상태가 데이터 블록으로 변경
	→ 부분 복사 + switch
3. **전체 병합(Full merge)**
	로그 블록 B가 가비지 컬렉터에 의해 희생 블록(victim block)으로 선택. 로그 블록 B와 그에 대응하는 데이터 블록 A의 유효한 페이지들은 새로운 빈 블록 C로 복사되고 블록 A와 B는 삭제
	→ 완전히 새로운 빈 block을 하나 잡아서, data block과 log block 양쪽에서 유효 페이지들을 순서 맞춰 하나하나 읽어다가 새 block에 재배치

희생 로그 블록이 여러 데이터 블록에 해당하는 페이지를 가지고 있고, 이러한 각 데이터 블록이 여러 로그 블록에 업데이트된 페이지를 가지고 있는 완전 연관(fully-associative) 로그 블록 방식의 경우 길고 재귀적인 작업이 될 수 있습니다.

![[DFTL_full_merge_example.png]]

(주로 BAST 방식의 문제) 작은 규모의 랜덤 쓰기가 존재할 경우, data block:log block이 1:1로 고정된 방식은 로그 블록의 비효율적인 활용으로 인해 발생하는 전체 병합(full merge) 비용 증가를 초래하는 로그 블록 스래싱(log block thrashing) 문제에 시달립니다.

### B. 최신 하이브리드 FTL 기법

**1. BAST (Block Associative Sector Translation)**
- 가장 초기 hybrid FTL
- data block 하나당 log block **하나만** 배정 (1:1 대응)
- 문제점: 특정 data block에 랜덤 write가 몰리면 그 log block만 계속 쓰이고, 나머지 log block들은 놀고 있어도 못 씀 → log block pool 활용이 비효율적
- 여러 data block에 흩어진 hot page들에 write가 오면, 그만큼 많은 log block이 동시에 필요해짐 → log block 부족 상황이 쉽게 생김 → merge가 자주 일어남
- data block:log block = 1:1 이라서, 작은 랜덤 쓰기가 여러 data block에 흩어져 들어오면 그만큼 많은 log block이 필요해짐
- 근데 각 log block은 조금씩만 채워진 채로 다 점유당함 → 활용률 낮음 → 결국 다 못 버티고 full merge 자주 발생 (thrashing = 자원은 다 쓰는데 실제 일은 못 하는 상태)

**2. FAST (Fully Associative Sector Translation)**
- BAST의 1:1 한계를 풀어서, log block pool을 **모든 data block이 공유**하도록 개선 (논문 Table 2 기준, 랜덤용 로그블록은 N개의 data block : (M-1)개의 log block으로 묶인 다대다 pool, 순차용 로그블록 1개만 별도로 1:1 고정)
- log block 하나에 여러 data block의 업데이트 페이지들이 섞여서 들어갈 수 있음
- 근데 순차 쓰기 전용으로 log block **딱 하나만** 고정 배정해놓음. (나머지는 랜덤용)
- 그래서 순차적인 쓰기 흐름(stream)이 **동시에 여러 개** 들어오면 (예: 파일 A도 순차 쓰기 중, 파일 B도 순차 쓰기 중) 이 하나의 순차 log block으로는 감당 못 함
- 랜덤 쓰기 쪽 log block들에도 "최근에 자주 쓰인 영역"같은 temporal locality를 활용하는 별도 메커니즘이 없음 → 그냥 뭉뚱그려 처리

**순차 log block의 역할**
"이 쓰기 요청들은 순차적이다"라고 판단되면, 그것들을 **랜덤 log block이랑 섞이지 않게 따로** 순차 전용 log block에 몰아넣는 거임. 그러면:
- 그 log block 안은 처음부터 끝까지 순서가 깔끔하게 유지됨 (다른 스트림이랑 안 섞이니까)
- merge할 때 무조건 제일 싼 switch merge로 처리 가능
- 결과적으로 전체 시스템의 merge 비용(성능 오버헤드)이 크게 줄어듦

**순차가 아니면? → Full merge (제일 흔한 케이스)**
- 랜덤 쓰기는 논리주소가 여기저기 흩어져서 들어오니까, log block 안에 페이지들이 원본 data block의 offset 순서랑 **안 맞게** 쌓임
- offset이 안 맞으면 switch merge도 partial merge도 못 씀 (뒤에 이어붙이는 것도 순서가 맞아야 가능하니까)
- 그래서 data block + log block 양쪽에서 valid page들을 다 읽어다가, 논리 순서에 맞게 **새로운 block에 재배치**해서 씀
- 다 끝나면 원본 data block + log block 둘 다 erase

**3. Superblock FTL**
- data block과 log block을 각각 따로 안 보고, 여러 block을 논리적으로 묶어서 "superblock" 단위로 관리
- 여러 개의 물리 block을 하나의 논리 단위로 묶어 병렬성(channel/plane 병렬 write) 활용도를 높이는 데 초점
- BAST/FAST가 단일 block 기준 매핑 정책이었다면, superblock은 거기에 **병렬 access 최적화**를 얹은 형태 — 여러 block에 동시에 write 분산시켜서 처리량 늘림
- **한계**: superblock 크기가 고정값이라, 워크로드가 바뀔 때마다 이 크기를 명시적으로 다시 튜닝해줘야 함 (동적으로 자동 조정되지 않음)

**SuperBlock FTL에서 왜 OOB를 여러 번 읽고 써야 하는가**
SuperBlock FTL은 3단계 주소변환을 씀 (예: 논리주소 → superblock 매핑 → superblock 내부 block 매핑 → block 내부 page 매핑, 이런 식의 계층 구조).

문제는 이 계층 구조에서 각 단계의 매핑 정보 일부가 SRAM/DRAM에 다 올라가 있지 않고, **일부는 OOB 영역에 저장**해두고 필요할 때 읽어와야 하는 구조라는 것.

**4. LAST (Locality-Aware Sector Translation)**
→ 개선: 다중 순차 log block + hot/cold 분리, 근데 문제: 외부 탐지기 의존 + 정렬 요구

- FAST의 "순차 log block 하나뿐" 문제를 다중 순차 log block으로 완화
- 랜덤 log block도 hot/cold로 나눠서 full merge 비용 줄임
- 근데 이 hot/cold, 순차/랜덤 구분을 **외부 locality detector**가 해줘야 함 — 근데 이 detector 자체가 "작은 크기의 쓰기가 사실은 순차적 패턴일 때"는 잘 못 잡아냄 (논문 저자들이 스스로 인정)
- 그리고 여전히 block-level 매핑을 쓰다 보니, switch merge를 하려면 순차 스트림이 log block의 시작 offset과 정확히 정렬되어야 함 (아까 얘기했던 "offset 정렬 안 되면 full merge" 그 문제가 LAST에도 여전히 남아있음) → 워크로드가 동적으로 바뀌면 이 정렬 요구사항 때문에 효율이 떨어짐
- hot 데이터는 hot 데이터끼리 같은 log block에, cold 데이터는 cold 데이터끼리 같은 log block에 모으는 거임.

**Hot/cold를 안 나누면 무슨 일이 생기냐**
hot 데이터(자주 업데이트됨)랑 cold 데이터(어쩌다 업데이트됨)가 **같은 log block에 섞여서** 쌓인다고 하자.
- hot 데이터는 계속 업데이트되니까 그 log block이 금방 valid page로 가득 참 (근데 실제로는 그 안의 valid page들이 자꾸 새로 덮어써지면서 old version은 invalid 됨)
- log block이 다 차면 merge를 해야 하는데, 이 안에 **cold 데이터도 같이 껴있어서** cold 데이터까지 통째로 끌려가서 merge 대상이 됨
- cold 데이터는 사실 안 건드려도 됐는데, hot 데이터 때문에 log block이 찼다는 이유로 **불필요하게 같이 복사/재배치됨**
- 이게 반복되면, cold 데이터가 merge될 때마다 계속 다시 옮겨지는 낭비가 생김 (cold인데 왜 자꾸 옮겨지냐 → hot이랑 한 block에 있었으니까)

**Hot/cold를 나누면**
- hot 데이터끼리만 모아놓은 log block: 계속 업데이트되다가 merge가 필요해져도, 옮겨야 할 대상이 **hot 데이터만** 있음. cold가 안 껴있으니까 불필요한 데이터까지 같이 옮기는 낭비가 없어짐
- cold 데이터끼리 모아놓은 log block: cold는 업데이트가 드무니까, 이 log block은 **거의 안 채워지고 merge 자체가 잘 안 일어남**. hot이랑 안 섞여있으니 hot 때문에 억지로 끌려가서 merge당하는 일도 없음

**정리하면 "비용이 줄어든다"는 건 두 가지 의미**
1. **merge 발생 빈도 감소**: cold 데이터가 hot 때문에 불필요하게 자주 merge에 휘말리지 않음
2. **merge 한 번당 옮기는 데이터 양 감소**: merge가 일어나도, 섞여있던 것보다 훨씬 적은 양(진짜 필요한 것만)만 재배치하면 됨

## III. DFTL 설계: 수요 기반 페이지 매핑 FTL
___

**저자들의 주장(thesis)**: 고성능 FTL은 로그 블록 개념을 완전히 없애고 처음부터 다시 설계되어야 한다.

페이지 수준 매핑을 통해 플래시의 모든 물리적 페이지에서 요청을 처리할 수 있습니다. 그러나 제한된 SRAM 크기에서 세밀한 매핑 방식을 실현 가능하게 하려면 특별한 주소 변환 메커니즘을 개발해야 합니다.

### 3.1 DFTL 아키텍처

SRAM에 모든 주소 변환 엔트리를 저장하는 전통적인 방식 대신, 워크로드 접근 패턴에 따라 페이지 수준 매핑을 동적으로 로드하고 언로드합니다.
또한 페이지 기반 매핑 테이블의 전체 이미지를 플래시 장치 자체에 유지합니다.

이미지를 저장하는 방법에는 (i) OOB 영역 또는 (ii) 물리적 페이지의 데이터 영역이라는 두 가지 옵션이 있습니다.

우리는 매핑을 OOB 영역에 저장하는 것보다 데이터 영역에 저장하는 방식을 선택했는데, 이는 OOB 영역에 저장하는 것과 비교하여 더 많은 수의 매핑을 단일 페이지로 그룹화할 수 있게 해주기 때문입니다.

발생하는 추가적인 공간 오버헤드는 전체 플래시 크기에 비해 무시할 수 있는 수준입니다. 1GB 플래시 장치는 모든 매핑을 저장하는 데 약 2MB(1GB의 약 0.2%)의 공간만 필요로 합니다.

**데이터 페이지(Data-Pages)와 변환 페이지(Translation-Pages)를 분리**

![[DFTL_architecture.png]]

변환 블록은 로그 블록과는 완전히 다르며 주소 매핑을 저장하는 데에만 사용됩니다.

맵핑테이블을 플래시 메모리에 넣어두고 SRAM에 일부만 저장. SRAM에 존재하는 이러한 활성 매핑들은 캐시된 매핑 테이블(Cached Mapping Table, CMT)을 구성하며, CMT가 다 차면 교체 알고리즘(세그먼트 LRU 등)에 따라 기존 엔트리가 밀려나고(evict) 새 엔트리로 덮어써짐.

변환 페이지는 전체 플래시 메모리에 물리적으로 흩어지게 됩니다. DFTL은 글로벌 변환 디렉터리(GTD)를 사용하여 플래시상의 이러한 모든 변환 페이지를 추적합니다. GTD는 SRAM에 영구적으로 유지되지만, 상당한 공간 오버헤드를 유발하지는 않습니다.

GTD 원본은 SSD 고정 위치, 복사본은 SRAM.

**글로벌 매핑 테이블(Global Mapping Table) 및 글로벌 변환 디렉터리(Global Translation Directory)**

전체 논리적-물리적 주소 변환 세트는 항상 플래시의 논리적으로 고정된 일부 영역에 유지되며, 이를 글로벌 매핑 테이블이라 부릅니다. 이러한 매핑 중 일부만 SRAM에 존재 → 캐시된 매핑 테이블(Cached Mapping Table, CMT).

- GMT = **논리적으로는 고정된 영역**(translation block들이라는 구역)에 있지만, **물리적 위치는 out-of-place update로 계속 바뀜**
- GTD = 그 "물리적 위치가 지금 어디인지"를 추적하는 인덱스, GTD 자신은 flash의 **고정된 물리 주소**에 원본을 둠 (GTD는 자주 안 바뀌니까 진짜 물리적으로도 고정 가능)

그러니까 "고정"이라는 단어가 GMT랑 GTD 각각에 대해 **다른 의미**로 쓰이는 거임 — GMT는 "논리적 영역"이 고정, GTD는 "물리적 주소"까지 고정.

### 3.2 논리-물리 주소 변환

**Algorithm 1: DFTL Address Translation**

![[DFTL_address_translation_example.png|417]]

주어진 읽기/쓰기 요청에 필요한 매핑 정보가 SRAM(CMT 내)에 존재하면, 이 매핑 정보를 사용하여 플래시의 데이터 페이지를 직접 읽거나 써서 요청을 처리합니다.

정보가 SRAM에 존재하지 않으면(CMT miss) 플래시에서 CMT로 가져와야 합니다. 그러나 CMT의 상태와 사용 중인 교체 알고리즘에 따라 SRAM에서 엔트리를 퇴거(evicting)해야 할 수도 있습니다.
