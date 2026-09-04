# NVMeV GC Watermark 실험 진행 계획

## High/Low Watermark 적용 후관찰

## 진행 순서
### 1. 회귀 확인 (while 포함 수정 코드 검증)
- `foreground_gc()`에 "high 도달 시 low까지 반복 GC" 로직(`while` + `break` 안전장치)을 추가한 뒤, `low = high = 2`로 두고 seq 워크로드 실행
- 목적: while 반복문 추가가 기존(수정 전, 반복 없이 1회만 GC) 로직의 결과를 바꾸지 않는지 확인
- 결과: FIFO 실험에서 확보했던 기존 seq_greedy 수치(`gc_count=218` 등)와 완전히 동일 → **회귀 없음, 통과**

### 2. High/Low Watermark 값 변화 후 관찰
- precondition 종료 시점 free line의 절반(268)까지 low를 증가시켜가며 관찰
  `low = 2, 134, 268`
- high는 기본값(2) 유지, low 값만 스윕

### 3. Low watermark만으로 평형 유지되는 경우 대응 (예상되는 문제)
- free_line_cnt가 low 근처에서 opportunistic GC만으로 계속 버티고 high까지 안 내려가는 경우 발생 가능
- 이 경우 fio `bs`(블록 사이즈)를 키워서 초당 write 소모 속도를 높임
  - 목적: "쓰기 속도(소모)"가 "opportunistic GC 보충 속도"를 추월하게 만들어 high watermark까지 도달시키기
  - `bs`값을 증가, 속도 자체를 높혀 해결할 예정

 **`low=134` 실행 결과, free_line_cnt가 high(2)까지 전혀 안 내려가고 134 근처에서 GC만으로 계속 버티는 현상 확인**
 
 대응: fio `bs`(블록 사이즈)를 키워서 write의 공간 소모 속도를 높여, opportunistic GC(low 단독)의 보충 속도를 추월시켜 high watermark까지 도달시킬 계획

### 4. High/Low 값 변화에 따른 데이터 추출
- 2~3단계에서 설정한 각 (low, high) 조합마다 아래 데이터 수집

## 추출할 데이터 목록
1. **시간 기준 free_line_cnt 변화 그래프** — `do_gc()` 로그의 `free=` 값 + dmesg 커널 타임스탬프로 시계열 구성
2. **Latency 그래프** — fio `--write_lat_log` 결과, GC 발생 시점과 latency spike 타이밍 대조
3. **GC 발생 횟수 및 소요 시간** — `gc_count`, `/proc/uptime` 시작~종료 시간 차
4. **rmmod 시점 최종 상태** — `tt_lines`, `full_line_cnt`, `free_line_cnt`, `write_credits`, `victim_line_cnt`, `gc_count`

## 로그 소스
```bash
cat /proc/uptime; ./seq_gc_invoke.sh
sudo dmesg | grep "GC-ing" > gc_log.txt
sudo rmmod nvmev
sudo dmesg | grep -i "gc_count\|tt_lines\|free_line_cnt\|full_line_cnt\|victim_line_cnt\|write_credits" | tail -6
```

로그 양식: `GC-ing line:%d,ipc=%d(%d),victim=%d,full=%d,free=%d,write_seq=%llu`

___

## 수정한 코드
### 1. foreground_gc() — high/low watermark
```C
static void foreground_gc(struct conv_ftl *conv_ftl)
{
    if (should_gc_high(conv_ftl)) {
        NVMEV_DEBUG_VERBOSE("should_gc_high passed");
        /* perform GC here until !should_gc(conv_ftl) */
        while (should_gc(conv_ftl)) {           
        // low(gc_thres_lines) 밑으로 내려갈 때까지 반복
            if (do_gc(conv_ftl, true) != 0)      
            // victim 없으면 break
                break;
        }
    } else if (should_gc(conv_ftl)) {
        do_gc(conv_ftl, false);                   
        // low만 걸렸을 땐 opportunistic 1회
    }
}
```
- high watermark 밑으로 떨어지면 low까지 반복 GC(강제)
- watermark 실험전체에서 이 구조는 그대로 두고 low/high 값만 변화

**기존코드와 차이점**
- 기존: high에 걸려 GC가 여러 번 필요한 상황에서도 
	- `GC 발생 → 다른 작업 → GC 발생` 순서
- 수정 후: 여러 번 필요한 상황에서 
	- `GC 모두 처리 → 다른 작업` 순서로 진행

### 2. conv_init_params() — low/high 값
```c
static void conv_init_params(struct convparams *cpp)
{
    cpp->op_area_pcent = OP_AREA_PERCENT;
    cpp->gc_thres_lines = 2;        /* low watermark, 실험별로 2 / 134 / 268 변경 */
    cpp->gc_thres_lines_high = 2;   /* high watermark, 고정 */
    cpp->enable_gc_delay = 1;
    cpp->pba_pcent = (int)((1 + cpp->op_area_pcent) * 100);
}
```
- `gc_thres_lines`(low) 값만 실험별로 변경, `gc_thres_lines_high`는 2로 고정
- precondition 후 남는 free line(약 536개)의 절반인 268까지 증가시킬 예정 → 기존 2부터, 134, 268 순

---
## 실행 스크립트 정보

ssd_config.h
```C
#define SSD_PARTITIONS (1)
#define NAND_CHANNELS (1)
#define LUNS_PER_NAND_CH (1)
```
### insmod.sh
```
memmap_size=32G
```
### GC 유발용 fio 스크립트
- **precondition 단계**: 디스크를 (거의) 가득 채우는 write로 free_line을 최소 수준까지 소모시킴
- **seq_gc_invoke.sh / ran_gc_invoke.sh**: precondition 이후 추가 write(순차/랜덤)로 GC를 실제 유발
 ```
  --bs=256k 
  --size=3000M 
 ```

High Low 기준값
precondition 후 남는 free line(약 536개)의 절반인 268까지 증가시킬 예정.
기존인 2부터, 134, 268 순
`conv_init_parms()` 내부의 `gc_thres_line` 값만 수정

```C
static void conv_init_params(struct convparams *cpp)
{
    cpp->op_area_pcent = OP_AREA_PERCENT;
    cpp->gc_thres_lines = 2; /* Need only two lines.(host write, gc)*/
    cpp->gc_thres_lines_high = 2; /* Need only two lines.(host write, gc)*/
    cpp->enable_gc_delay = 1;
    cpp->pba_pcent = (int)((1 + cpp->op_area_pcent) * 100);
}
```



___
## 결과

**rmmod 최종 통계**:

| 항목 | 값 |
|---|---|
| tt_lines | 8192 |
| full_line_cnt | 7655 |
| free_line_cnt | 3 |
| write_credits | 192 |
| victim_line_cnt | 532 |
| gc_count | 218 |

- FIFO 실험 때의 seq_greedy 결과(`gc_count=218`, `free_line_cnt=3` 등)와 **완전히 일치** → while 반복문 추가가 기존 동작을 깨뜨리지 않음을 재확인
- Latency 그래프: precondition 구간(0~15초, ~1700~2000us 평탄) 이후 GC 진입(15초~)부터 ~5600us 수준으로 계단식 상승.
- free_line_cnt 그래프: 처음부터 끝까지 `free=2`에 고정되어 움직임(회복이 즉시 재소진되는 steady state). 


seq_gc_low2_lat
![[seq_gc_low2_lat.png]]

low2_free line
![[seq_gc_low2_free 3.png]]

### 2) low=134, high=2

**rmmod 최종 통계**:

| 항목 | 값 |
|---|---|
| tt_lines | 8192 |
| full_line_cnt | 7655 |
| free_line_cnt | 135 |
| write_credits | 192 |
| victim_line_cnt | 400 |
| gc_count | 350 |

- `free_line_cnt`가 실행 내내 **134 근처에서만 유지**되고, high(2)까지 한 번도 안 내려감 → while 반복(강제 몰아치기) 구간이 관찰되지 않고, opportunistic GC(`force=false`, 1회씩)만 계속 발동
- `gc_count`가 218 → **350**으로 오히려 더 많음: low watermark가 미리 개입해 여유 공간을 지속적으로 확보
- `victim_line_cnt`가 532 → 400으로 감소: 대기 중이던 청소 대상 중 상당수가 미리 처리됨
- 실행 시간도 53초 → 117초로 늘어남: opportunistic GC가 잦아지면서 전체 처리 시간이 증가

low134_lat
![[seq_gc_low2.png]]

low134_freeline![[seq_gc_low134_free 1.png]]


___
## 원인 분석 및 다음 계획

### 원인 — low watermark만으로 평형 유지
`low=134`에서 free_line_cnt가 high(2)까지 못 내려가고 134 근처에 머무는 이유:
```
opportunistic GC(force=false, low 조건에서 1회씩)가 공간을 회수하는 속도
   ≥
현재 write 워크로드(--bs=256k)가 공간을 소모하는 속도
```

opportunistic GC가  따라잡을 수 있는 수준이라, free line이 위험 수준(high=2)까지 몰릴 일 자체가 없어 보임. 
그 결과 while 반복 구간을 아직 한 번도 관찰하지 못함 — `low=268`도 같은 이유로 high 도달이 더 어려울 것으로 예상됨.

### 다음 계획 — fio bs 증가
- 요청 하나가 소모하는 write credit이 커지면, 같은 시간에 더 많은 공간이 한 번에 소진될 것이라고 예상
- opportunistic GC가 이 소모 속도를 못 따라가게 되면, free_line_cnt가 결국 high(2)까지 떨어지면서 **while 반복(강제 몰아치기) 구간**도 함께 관찰 가능해질 것으로 예상

- 이 조건에서 `low=134`, `low=268` 각각 재실행하여, high watermark가 실제로 개입하는 순간의 free_line_cnt 변화(급격한 회복)와 그 구간의 latency 패턴을 확보하는 것이 다음 실험 목표

___

low에 걸렸을 때는 GC자체를 하지 않게 수정