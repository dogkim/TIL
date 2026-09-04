# NVMeV GC 실습 — 중간 기록

> 신규 학부연구생 실습 기록. 커널 모듈 개발 사이클(수정→빌드→로드→마운트→측정→해제)을 익히고, GC가 SSD 성능에 미치는 영향을 fio로 실측한 전 과정.

---

## 0. 환경
- 연구실 서버: `155.230.118.122`, SSH 포트 `1122`
- 프로젝트: [NVMeVirt](https://github.com/snu-csl/nvmevirt) (서울대 CSL), 경로 `~/nvmevirt`
- 접속: VSCode Remote-SSH

---

## 1. 기본 개념 정리 (실습 중 학습)

- **터미널/리눅스**: `ls`, `grep`, `cat`, `mkdir`, `chmod`, `sudo`, `kill`, `ps aux`, `who`, 파이프(`|`), 리다이렉션(`>`, `>>`), 백그라운드(`&`)
- **SSD 동작 원리**: 덮어쓰기 불가 → 새 페이지에 쓰고 기존 페이지는 invalid 처리 → invalid 누적 시 GC(유효 페이지 복사 + 블록 erase)로 회수
- **NVMeVirt 구조**: `insmod`(모듈 로드, RAM 일부를 가상 SSD로 점유) → `mkfs+mount`(파일시스템 생성) → fio 측정 → `umount` → `rmmod`
- **Kbuild**: SSD 모델(970PRO 등) 선택
- **ssd_config.h**: 채널/LUN/파티션/MDTS/latency 등 SSD 세부 스펙
- **conv_ftl.c**: FTL 로직, GC 트리거 조건과 실행 로직이 담긴 핵심 파일
- **fio**: I/O 부하 생성 및 latency/IOPS 측정 도구

---

## 2. 사건 1 — 서버 크래시

### 시도
`ssd_config.h`에서 GC를 빠르게 유발하려고:
```c
SSD_PARTITIONS (4 → 1)
NAND_CHANNELS (8 → 1)
LUNS_PER_NAND_CH (2 → 1)
```

### 결과
`insmod`는 성공했으나 `mount.sh`(mkfs.ext4 journal 생성, 대량 write 발생 시점)에서 커널 크래시.
```
RIP: buffer_allocate+0x65/0x70 [nvmev]
nvme nvme1: I/O tag ... timeout, aborting
Disabling device after reset failure
```
`rmmod` 시도 시 `Killed`로 실패, `lsmod` 확인 결과 usage count `-1`(비정상 상태로 고착).

### 원인 (관리자 확인)
```c
#define GLOBAL_WB_SIZE (NAND_CHANNELS * LUNS_PER_NAND_CH * ONESHOT_PAGE_SIZE * 2)
```
채널·LUN을 1×1로 줄이며 write buffer가 64KiB로 축소됐는데, `MDTS(6)` 기준 최대 요청 크기는 256KiB까지 허용되어 버퍼보다 훨씬 큰 요청이 들어와 처리 불능 상태에 빠짐. 같은 조건으로 다른 랩원(고보민, 조은비)도 동일 계열 크래시 겪음 — 여러 명이 독립적으로 재현했다는 점에서 코드/설정 조합 자체의 문제로 확인.

### 조치
- 관리자에게 상황 보고, 서버 재부팅 요청 → 이후 서버 이용 중지 지시
- 대안으로 랩실 로컬 PC 사용 시도

---

## 3. 사건 3 — 로컬 PC에서도 크래시 (PCI BAR 문제)

### 증상
로컬 PC(RAM 13GiB)에서 `insmod` 시 `Input/output error`. dmesg 확인 결과:
```
nvme 0001:10:00.0: BAR 0: can't reserve [mem 0xc0000000-0xc0003fff 64bit]
```
`memmap_size`를 여러 값(2G, 8G 등)으로 바꿔가며 시도했으나 재현, `memmap_size=1G`에서만 우연히 성공했다가 이후 `rmmod` 시 다시 크래시(`nvmev_proc_admin_sq`에서).

### 원인
로컬 PC의 PCI 메모리 공간이 이미 다른 하드웨어(그래픽카드 등)로 채워져 있어, NVMeV가 요청한 메모리 영역을 예약하지 못함. GRUB의 `memmap=` 커널 부팅 파라미터로 사전 예약이 필요한 근본적인 하드웨어 구성 문제로 판단, 로컬 PC 실습은 보류.

### 결정
서버가 재부팅되어 정상화된 것을 확인 후, **서버로 복귀하여 재실험 진행**.

---

## 5. 최종 실험 세팅 (서버)

### Kbuild
```c
CONFIG_NVMEVIRT_SSD := y   // Samsung 970 Pro
```

### ssd_config.h (SAMSUNG_970PRO)
| 항목 | 기본값 | 최종값 |
|---|---|---|
| SSD_PARTITIONS | 4 | **4 (원복)** |
| NAND_CHANNELS | 8 | **8 (원복)** |
| LUNS_PER_NAND_CH | 2 | **2 (원복)** |
| MDTS | 6 | 4 |
| NAND_ERASE_LATENCY | 0 | 3,500,000 (3.5ms) |

채널/LUN/파티션은 크래시 재발 방지를 위해 원래 스펙으로 되돌리고, 대신 **`insmod`의 `memmap_size`로 가상 SSD 총 용량 자체를 축소**하는 방식으로 전환 (예: `memmap_size=4G` → 마운트 후 실사용 가능 용량 약 3.4G).

### nvmev.h — GC 로그 활성화
```c
#undef CONFIG_NVMEV_VERBOSE
#define CONFIG_NVMEV_DEBUG
#define CONFIG_NVMEV_DEBUG_VERBOSE
```
`conv_ftl.c`의 `do_gc()`에 있는 `NVMEV_DEBUG_VERBOSE("GC-ing line:...")`가 dmesg에 실제로 출력되도록 매크로 활성화. 이 함수가 GC 발생의 직접 증거가 됨.

---

## 6. fio 실험 설계

### 공통 옵션과 선택 이유
- `--rw=randwrite`: write만 사용(GC는 write로 인한 invalid 누적이 원인이므로 read 배제해 원인 명확화), 랜덤(같은 LBA 재사용을 유도해 invalid를 빠르게 누적시켜 GC를 확실히 유발; 순차 쓰기는 무효화가 잘 안 쌓임)
- `--bs=4k`, `--direct=1`(캐시 우회), `--time_based=1 --runtime=300`(범위를 다 채운 뒤에도 반복 덮어쓰기)
- `--write_lat_log`, `--write_iops_log`: 시계열 데이터 확보 (`--log_avg_msec`는 1000 → 0으로 조정해 더 촘촘하게)

### 핵심 변수 — `--size` (fio가 반복 쓰기하는 논리적 범위)
| 실험 | 디스크 용량 | `--size` | 비율 | GC 발생 |
|---|---|---|---|---|
| 초기 200M 실험 | 28G | 200M | 0.7% | 0건 |
| **최종 3G 실험** | 3.4G | 3G | 88% | **132,731건** |

---

## 7. GC 트리거 조건 (conv_ftl.c 분석)

```c
static bool should_gc(struct conv_ftl *conv_ftl) {
    return (conv_ftl->lm.free_line_cnt <= conv_ftl->cp.gc_thres_lines);
}
```
```c
cpp->gc_thres_lines = 2;
cpp->gc_thres_lines_high = 2;
```
- 전체 line 개수(`tt_lines = BLKS_PER_PLN`) = **8192개**
- free line이 2개 이하(전체의 99.98% 사용)로 떨어져야 트리거되는 보수적 조건
- 이 때문에 디스크를 충분히(80% 이상) 채우지 못하면 GC가 전혀 발생하지 않음 — 초기 200M 실험이 실패했던 근본 원인

---

## 8. 시행착오 — 측정 방법의 함정들

### 8-1. fio IOPS 로그 오해
- `--write_iops_log`로 얻은 파일의 두 번째 컬럼이 계속 "1"로만 나와 그래프가 깨짐
- 원인: 이 로그는 "그 순간의 IOPS 값"이 아니라 "개별 IO 완료 이벤트" 단위로 기록됨
- 해결: 시간(초) 단위로 직접 카운트(집계)해야 실제 IOPS 값을 얻을 수 있음

### 8-2. latency 스파이크의 원인을 성급히 단정한 것에 대한 교정
- 스파이크 크기(3.3ms)가 설정한 `NAND_ERASE_LATENCY`(3.5ms)와 비슷하다는 이유만으로 "GC 때문"이라 추정한 것은 근거 부족한 추론이었음
- `conv_write()` 코드 분석 결과, GC를 유발한 요청 자신은 erase를 기다리지 않고(latency 확정이 GC 실행보다 먼저 이뤄짐), erase로 인한 지연은 **같은 채널을 나중에 쓰는 다른 요청**이 부담하는 구조임을 확인
- dmesg의 실제 `GC-ing` 로그와 시계열을 직접 대조하는 방식으로 변경 (추측 대신 로그 기반 검증)

---

## 9. 최종 결과

### GC 로그
```
NVMeVirt: GC-ing line:1908,ipc=23(9),victim=3324,full=4863,free=2
```
`free=1~2`로 코드에서 확인한 트리거 조건과 정확히 일치. 300초 동안 132,731건 발생.

### Latency/IOPS 패턴
- 약 50~55초 주기의 톱니(sawtooth) 패턴이 반복
- 해석: 범위를 한 바퀴 돌 때마다 그 구간 전체가 재사용되며 대량의 invalid 페이지 발생 → GC가 몰아서 처리(버스트) → 소강 → 다음 바퀴에서 반복
- 유의미한 결과인지 아직 모르겠으나, GC가 발생한것을 로그를 통해 확인

### 통계 (3G 실험)
| 항목 | 값 |
|---|---|
| 평균 latency | 66,220 ns |
| 최대 latency | 50,422,124 ns (50.4ms) |
| p50 / p99 | 58,624 ns / 288,768 ns |
| 평균 IOPS | 14,557 |

---

## 10. 결론
1. 채널/LUN/파티션은 원래 스펙 유지 + `memmap_size`로 SSD 총 용량 조절 = 안정적이면서 GC 유발 가능한 조합
2. GC 트리거는 보수적 조건(free line ≤ 2)이라, 실험 범위가 디스크 용량을 많이 차지하여야 관찰 가능
3. dmesg 커널 로그와 fio 시계열 데이터를 함께 확보해야 GC와 성능 저하 사이의 인과관계를 확실히 입증할 수 있음(추측이 아닌 로그 기반 검증의 중요성)
---
## 수정이 필요한 사항
- fio내에서 ```--size=100%```을 사용하여 GC발생을 유도

---

## 11. 앞으로 시도해볼 만한 것 (미실행 아이디어)
-  채널/LUN/파티션을 단순화 하여 결과 도출
- `gc_thres_lines` 값 자체를 조정해 트리거 시점/빈도 변화 관찰
- GC발생은 주기적으로 일어나는데 순간적으로만 튀는 이유 

