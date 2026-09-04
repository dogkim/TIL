# NVMeV GC Watermark 실험 2차 — 변경점 및 문제 정리

## 진행 순서
### 1. 코드 확인 (수정 코드 검증)
- `foreground_gc()`에 "low 도달 시 GC" 로직을 제거한 뒤, `low = high = 2`로 두고 seq 워크로드 실행
- 목적: low에서의 GC발생 조건 제거가 기존(수정 전, 반복 없이 1회만 GC) 로직의 결과를 바꾸지 않는지 확인
- 결과: FIFO 실험에서 확보했던 기존 seq_greedy 수치(`gc_count=218` 등)와 완전히 동일 → **회귀 없음, 통과**
### 2. High/Low Watermark 값 변화 후 관찰
- precondition 종료 시점 free line의 절반(268)까지 low를 증가시켜가며 관찰
  `low = 2, 134, 268`
- high는 기본값(2) 유지, low 값만 변경

## 문제 발생
**실행 결과, GC발생 로그의 발생 시간대와 latency log 사이간의 발생 기간이 다르게 보이는 문제 확인**
___
## 추출할 데이터 목록 (수정 없음)
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
## 변경점 — opportunistic(low 단독) GC 분기 제거

1차 실험에서 `low=134`가 opportunistic GC(`force=false`, low 조건에서만 1회씩 실행)만으로 계속 평형을 유지하며 high(2)까지 전혀 안 내려가는 문제를 겪음. 이를 해결하기 위해 **low 단독으로는 아무 GC도 하지 않고, high에 도달했을 때만 while로 low까지 몰아서 처리하도록 구조를 변경**.

```c
static void foreground_gc(struct conv_ftl *conv_ftl)
{
    if (should_gc_high(conv_ftl)) {
        NVMEV_DEBUG_VERBOSE("should_gc_high passed");

        while (should_gc(conv_ftl)) {
            if (do_gc(conv_ftl, true) != 0)
                break;
        }
    }
    // } else if (should_gc(conv_ftl)) {
    //     do_gc(conv_ftl, false);
    // }
}
```

**기존(1차)과의 차이**

| | 1차 | 2차(이번) |
|---|---|---|
| low 도달 시 | opportunistic GC 1회씩 계속 실행 | 아무 것도 안 함 |
| high 도달 시 | while로 low까지 반복 | 동일 |
| 목적 | — | write 소모를 막지 않고, high에 도달할 때까지 완전히 방치했다가 한 번에 몰아서 처리 |

---

## 진행 순서
1. precondition 후 남는 free_line 개수 재확인
2. 변경된 코드로 low=high=2 데이터 재추출 (회귀 확인)
3. low=134, low=268 데이터 추출

## 결과

### 1) Precondition 직후
```
tt_lines: 8192
full_line_cnt: 7655
free_line_cnt: 535
victim_line_cnt: 0
gc_count: 0
```
1차 때 free_line_cnt 추정치(536)와 거의 일치, GC는 0번(정상).

### 2) low=2, high=2 (회귀 확인)

| 항목 | 값 |
|---|---|
| tt_lines | 8192 |
| full_line_cnt | 7655 |
| free_line_cnt | 3 |
| victim_line_cnt | 532 |
| gc_count | 218 |

`gc_count=218`로 FIFO 실험 때의 seq_greedy(218)와 동일 → 구조 변경이 low=high 조건에서는 기존 동작을 깨지 않음을 재확인.

### 3) low=134, high=2

| 항목              | 값    |
| --------------- | ---- |
| tt_lines        | 8192 |
| full_line_cnt   | 7655 |
| free_line_cnt   | 51   |
| victim_line_cnt | 484  |
| gc_count        | 266  |

**1차(opportunistic 버전) 대비 뚜렷한 차이**: 1차는 `free_line_cnt=135`(low 근처 유지), `gc_count=350`이었던 반면, 이번엔 `free_line_cnt=51`으로 low(134)보다 오히려 낮게, `gc_count=266`으로 더 적게 나옴. opportunistic 개입이 없어지면서 write가 방해 없이 진행되다가, high 도달 시에만 몰아서 처리하는 패턴으로 바뀐 결과로 해석됨.

### 4) low=268, high=2
시작 `/proc/uptime`: 345560.24
첫 GC 로그: `[345563.778499] ... free=2, write_seq=0`

| 항목 | 값 |
|---|---|
| tt_lines | 8192 |
| full_line_cnt | 7655 |
| free_line_cnt | 52 |
| victim_line_cnt | 483 |
| gc_count | 267 |

low=134일 때와 low=268일 때의 최종 `free_line_cnt`(51, 52)가 서로 거의 같음 
low 값이 다른데도 최종 상태가 비슷한 현상. 


---

## 그래프 관찰

시간(x축)이 정확한 절대값은 아니지만(위 "문제 발생" 참고), **버스트 발생 여부·횟수·상대적 간격, latency 스파이크 크기 자체는 유효한 관찰 대상**이라 판단해 함께 정리.

### low=2, high=2 (회귀)![[seq_gc_low2_lat 1.png]]
 
 GC 진입부터 상승. 기존(1차) 패턴과 동일.
 
 GC발생시마다의 free_line![[seq_low2_freeLine_whole.png]]

free_line_cnt가 전 구간에서 정확히 `2`로 고정되어 관찰됨. low=high=2라 GC 1회로 확보한 여유(3)가 바로 다음 요청에서 소진되어 그래프상 계속 2로 보임 — 회귀 확인과 일치.

### low=134, high=2![[seq_gc_low134_lat 1.png]]
큰 latency 스파이크가 **두 번**(약 4~5×10⁵us, 즉 400~500ms 수준) 관찰됨.

GC발생시마다의 free_line
![[seq_low134_freeLine_whole.png]]

GC 앞부분, 뒷부분 확대
![[seq_low134_freeLine_pre.png]]
![[seq_low134_freeLine_post.png]]


 free_line_cnt가 `2 → 134`로 수직 점프하는 버스트가 **캡처된 구간(0~10초) 안에서 두 번** 나타남.

→ latency 스파이크 두 번과 free_line 버스트 두 번이 서로 대응됨. 
이번 실행에서 low=134는 Low에 두 번 닿았음이 확인됨 표시 구간 밖(10~22초)에서도 추가적인 스파이크는 없었음

### low=268, high=2

latency
![[seq_gc_low268_lat.png]]

latency 스파이크가 **한 번**, 약 10⁶us 수준으로 다른 두 실험보다 훨씬 큼. 

GC발생시마다의 free_line
![[seq_low268_freeLine_whole.png]]— free_line_cnt가 `2 → 268`로 수직 점프하는 버스트가 **한 번만** 관찰됨.

→ low=268은 버스트가 한 번뿐이고, 대신 그 한 번이 low=134보다 훨씬 크게 일어남. 

확대분
![[seq_low268_freeLine.png]]

## 정리
low를 낮게 잡아 자주·작게 몰아칠지, 높게 잡아 드물게·크게 몰아칠지의 트레이드오프가 그래프로 시각적으로 확인됨.

---

## 문제 발생 및 해결 방안

### 1) 시간 기준(START_TIME) 불일치
`cat /proc/uptime; ./seq_gc_invoke.sh`로 수동 측정한 시작 시각과, 실제 dmesg 로그의 GC 발생 시점 사이에 예상보다 큰 오차 발견.

**결론**: fio 자신이 기록하는 상대 시간(latency 로그의 1번째 컬럼)은 신뢰할 수 있으나, 사람이 별도로 `/proc/uptime`을 찍어 계산한 `START_TIME`에는 오류가 있었음 명령어 실행 사이의 입력 지연, 이전 실행 잔여 등이 원인으로 추정.

**해결 방향 (적용 예정)**: 
	이전 1차실험에서는 문제가 없었던 것으로 확인했으나 수정할 계획.
	
`/proc/uptime` 수동 측정 대신, fio 실행 시 `--output-format=json`을 켜서 결과의 `job_start`를 가져다 쓰는 방식으로 전환. 
이후 `uptime -s`(서버 부팅 실제 시각)와 조합하여 계산할 계획

### 2) 서버 디스크 풀로 인한 VSCode 접속 장애
실험 도중 VSCode Remote-SSH 접속이 `Could not establish connection` / `Failed to parse remote port from server output` 오류로 실패. 

`~/.vscode-server` 재설치를 시도했으나 `failed to create the remote server's install directory` 오류
실험 중인 것으로 확인하여, 다음날 조속히 처리할 계획..

### 3) 그래프의 GC이후에 free_line_cnt를 주기적으로 기록하여 그래프에 찍을 예정

`check_and_refill_write_credit()` 함수 안, 
`foreground_gc()` 호출 앞에 로그 한 줄 추가:
```c
static inline void check_and_refill_write_credit(struct conv_ftl *conv_ftl)
{
    struct write_flow_control *wfc = &(conv_ftl->wfc);
    if (wfc->write_credits <= 0) {
        NVMEV_INFO("TRACE: free=%d\n", conv_ftl->lm.free_line_cnt); // 추가
        foreground_gc(conv_ftl);
        wfc->write_credits += wfc->credits_to_refill;
    }
}
```

이 함수가 credit 소진 시점마다(16개 요청) 한 번씩 호출되어, 
GC 발생 여부와 무관하게 그 지점을 지날 때마다 free_line_cnt를 남길 수 있음.

```bash
sudo dmesg | grep -E "GC-ing|TRACE" > gc_log.txt
```
