# NVMeV GC 기초 검증 실험

## 목적
NVMeVirt(가상 NVMe SSD)에서 fio로 write 부하를 가해 Garbage Collection(GC)을 실제로 유발시키고, 이로 인한 성능 저하(latency 증가)를 로그 기반으로 정량 검증한다.

## 설정 변천 과정

| 시도 | 방식 | 결과 |
|---|---|---|
| 1차 (200M, memmap 32G) | `--size=200M` (디스크의 0.7%) | GC 0건 — free line이 트리거 조건(≤2)까지 못 내려감 |
| 2차 (3G, memmap 4G로 축소) | `--size=3G` (디스크의 88%) | GC 132,731건 발생 — 트리거 조건 충족 |
| 3차 (Raw Device 방식) | `GLOBAL_WB_SIZE=MB(1)` 고정 + mount 없이 `/dev/nvme1n1` 직접 I/O | GC 18건 (2200M seq write 기준), 코드 계측 기반이라 신뢰도 높음 |

**GC 트리거 조건** (`conv_ftl.c`): `free_line_cnt <= gc_thres_lines` (기본값 2) — 전체 line의 약 99.98%가 채워져야 발동하는 보수적 조건. 따라서 디스크를 충분히(80% 이상) 채우지 못하면 GC가 전혀 관찰되지 않음.

## 최종 실험 세팅 (Raw Device 방식)

```c
NAND_CHANNELS = 1, LUNS_PER_NAND_CH = 1, PLNS_PER_LUN = 1
GLOBAL_WB_SIZE = MB(1)   // 채널/LUN 값과 무관하게 고정 → 초기 크래시(buffer_allocate) 원인 해소
MDTS = 6                  // 버퍼가 충분히 커서 낮출 필요 없음
NAND_ERASE_LATENCY = 3,500,000 (3.5ms)
```
- `insmod memmap_size=32G`, **mount 없이** `fio --filename=/dev/nvme1n1`로 raw device에 직접 I/O
- `conv_ftl.c`의 `do_gc()`에서 `gc_count = 0`(매번 리셋되던 버그)을 `gc_count++`로 수정

## 결과

**precondition 후 (100% 순차 쓰기)** → **seq_gc_invoke (2200M 추가 순차 쓰기)** 후 rmmod 시점 dmesg:

| 항목 | 값 |
|---|---|
| tt_lines | 8192 |
| full_line_cnt | 7655 |
| free_line_cnt | 3 |
| write_credits | 192 |
| victim_line_cnt | 532 |
| gc_count | 18 |

- `tt_lines`(8192), `full_line_cnt`(7655)가 사전 계산값과 거의 정확히 일치
- `free_line_cnt`가 임계값(2) 바로 근처(3)에서 종료 — GC가 정상적으로 임계 조건까지 작동
- 코드 레벨 `gc_count` 계측이 dmesg grep 방식보다 신뢰도 높음을 확인

**3G 실험 통계 (2차 시도, GC 132,731건 발생 구간)**

| 항목 | 값 |
|---|---|
| 평균 latency | 66,220 ns |
| 최대 latency | 50,422,124 ns (50.4ms) |
| p50 / p99 | 58,624 ns / 288,768 ns |
| 평균 IOPS | 14,557 |

Latency/IOPS는 약 50~55초 주기의 톱니(sawtooth) 패턴을 보임 — fio가 지정한 범위를 한 바퀴 돌 때마다 그 구간 전체가 재사용되며 대량의 invalid 페이지가 발생 → GC가 몰아서 처리(버스트) → 소강 → 다음 바퀴에서 반복되는 것으로 해석.

**GC 간격의 규칙성**: write credit 체크 주기(`bs=256KiB` 기준 16개 요청마다)는 threshold 값과 무관하게 항상 고정. threshold는 "체크 주기"가 아니라 "그 체크 시점마다 실제로 GC가 실행되는 비율"을 바꾼다 — threshold를 높이면 동일한 16개 간격 패턴이 초반부터 쉼 없이 반복되는 형태로 나타남.

## 결론 및 다음 계획
1. 채널/LUN/파티션은 원래 스펙 유지 + `GLOBAL_WB_SIZE` 고정 + `memmap_size`로 총 용량 조절 = 크래시 없이 GC 유발 가능한 안정적 조합
2. GC 트리거는 보수적 조건(free line ≤ 2)이라, 디스크를 충분히 채워야 관찰 가능
3. dmesg 커널 로그와 fio 시계열 데이터를 함께 확보해야 GC-성능저하 인과관계를 로그 기반으로 검증 가능

**다음 심화 실험 후보**
| # | 아이디어 | 재빌드 필요 |
|---|---|---|
| 1 | threshold를 높여 precondition 중에도 GC 유발 | 필요 |
| 2 | seq_gc_invoke의 `--size` 확대로 GC 여러 번 유발 | 불필요 |
| 3 | 2번 + threshold 상향 조합 | 필요 |
| 4 | seq_gc_invoke를 랜덤 쓰기로 전환 (순차 vs 랜덤 GC 비용 비교) | 불필요 (`--rw=randwrite`) |
