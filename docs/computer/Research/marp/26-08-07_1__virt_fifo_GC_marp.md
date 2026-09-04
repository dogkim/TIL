---
marp: true
theme: default
paginate: true
size: 16:9
---
# NVMeV GC: Greedy vs FIFO
### 순차/랜덤 쓰기 조건에서의 victim 선택 정책 비교

---

## 진행 순서 (1) 검증 코드 작성

순차 쓰기에서 기존 Greedy가 결과적으로 FIFO처럼 동작하는지 확인

- 각 line이 "몇 번째로 마감(full)됐는지" 기록하는 `write_seq` 필드 추가
- GC가 victim으로 고른 line의 `write_seq`를 로그에 남겨, 오름차순으로 선택되는지 확인
- **목적**: 순차 쓰기 조건에서는 "먼저 채워진 line"과 "invalid가 가장 먼저 쌓이는 line"이 항상 일치 → Greedy(vpc 기준)와 FIFO가 같은 line을 고를 것이라는 가정 확인

---

## 진행 순서 (2), (3)

**(2) FIFO 구현 후 1번과 비교**
- 같은 조건(순차 쓰기)에서 Greedy 결과와 동일하게 나오는지 비교
- 같으면 가설 검증 완료, 다르면 원인 분석

**(3) Random Write로 전환 후 FIFO vs Greedy 비교**
- 순차 쓰기에서는 두 정책이 구분되지 않으므로, 같은 LBA 재사용 패턴이 불규칙한 랜덤 쓰기로 전환해 실제 차이가 드러나는지 확인

---

## 추출할 데이터 목록

1. **write_seq 시퀀스** — GC가 victim을 고르는 순서가 오름차순(역전 없음)인지 확인
2. **GC 발생 횟수 (`gc_count`)** — Greedy와 FIFO 간 총 GC 횟수 비교
3. **rmmod 시점 최종 상태**
   - `tt_lines`, `full_line_cnt`, `free_line_cnt`
   - `write_credits`, `victim_line_cnt`, `gc_count`

> line 하나가 통째로 다 채워질 때마다 번호가 매겨지고 `do_gc()`에서 출력

---

## 수정 코드 — conv_ftl.h

```C
struct line {
    int id;
    int ipc;
    int vpc;
    struct list_head entry;
    size_t pos;
    uint64_t write_seq;   // 추가: line이 몇 번째로 마감됐는지
};

struct conv_ftl {
    ...
    uint64_t line_seq_counter;   // 추가: line 마감마다 증가하는 전역 카운터
};
```

---

## 수정 코드 — GC 정책 스위치

`conv_ftl.c` 최상단, `#include` 이전

```C
#define GC_POLICY_FIFO 1   // 1=FIFO, 0=greedy
```

`conv_init_ftl()` 내부 초기화

```C
conv_ftl->line_seq_counter = 0;
```

---

## 수정 코드 — Victim 우선순위 함수

```C
static inline pqueue_pri_t victim_line_get_pri(void *a)
{
#if GC_POLICY_FIFO
    return ((struct line *)a)->write_seq;
#else
    return ((struct line *)a)->vpc;
#endif
}

static inline void victim_line_set_pri(void *a, pqueue_pri_t pri)
{
#if GC_POLICY_FIFO
    ((struct line *)a)->write_seq = pri;
#else
    ((struct line *)a)->vpc = pri;
#endif
}
```

---

## 수정 코드 — mark_page_invalid()

우선순위 값을 새로 지정(set_pri) + 큐 안 재정렬

- **greedy**: 기존 `pqueue_change_priority` 유지 (vpc 감소 시 pqueue 재정렬 필요)
- **FIFO**: 재정렬 호출 시 `write_seq`가 `vpc-1`로 오염되는 문제 발견 → `line->vpc--`만 직접 수행

```C
if (line->pos) {
    /* Note that line->vpc will be updated by this call */
    //DG Modded start : FIFO
#if GC_POLICY_FIFO
    line->vpc--;
#else
    pqueue_change_priority(lm->victim_line_pq, line->vpc - 1, line);
#endif
    //DG Modded end
} else {
    line->vpc--;
}
```

---

## 수정 코드 — advance_write_pointer()

line 마감 시 `write_seq` 부여

```C
if (wpp->curline->vpc == spp->pgs_per_line) {
    NVMEV_ASSERT(wpp->curline->ipc == 0);
    wpp->curline->write_seq = conv_ftl->line_seq_counter++;   // DG Modded
    list_add_tail(&wpp->curline->entry, &lm->full_line_list);
    lm->full_line_cnt++;
} else {
    NVMEV_ASSERT(wpp->curline->vpc >= 0 && wpp->curline->vpc < spp->pgs_per_line);
    NVMEV_ASSERT(wpp->curline->ipc > 0);
    wpp->curline->write_seq = conv_ftl->line_seq_counter++;   // DG Modded
    pqueue_insert(lm->victim_line_pq, wpp->curline);
    lm->victim_line_cnt++;
}
```

---

## 수정 코드 — do_gc() 로그

```C
conv_ftl->gc_count++;
NVMEV_INFO("GC-ing line:%d,ipc=%d(%d),victim=%d,full=%d,free=%d,write_seq=%llu\n",
    ppa.g.blk,
    victim_line->ipc, victim_line->vpc,
    conv_ftl->lm.victim_line_cnt,
    conv_ftl->lm.full_line_cnt,
    conv_ftl->lm.free_line_cnt,
    victim_line->write_seq);
```

---

## 실행 스크립트 정보

**ssd_config.h**
```C
#define SSD_PARTITIONS (1)
#define NAND_CHANNELS (1)
#define LUNS_PER_NAND_CH (1)
```

**insmod.sh**
```
memmap_size=32G
```

**GC 유발용 fio 스크립트**
- precondition: 디스크를 (거의) 가득 채워 free_line을 최소 수준까지 소모
- `seq_gc_invoke.sh`: precondition 이후 추가 순차 write로 GC 실제 유발
```
--rw=write --bs=256k --size=3000M
```

---

## 실험 결과 (a) Seq, Greedy

`write_seq`가 역전 없이 오름차순으로만 나옴:
```
0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 532, 533, 534, ..., 739
```

| 항목 | 값 |
|---|---|
| tt_lines | 8192 |
| full_line_cnt | 7655 |
| free_line_cnt | 3 |
| write_credits | 192 |
| victim_line_cnt | 532 |
| gc_count | 218 |

**결론**: 순차 쓰기에서 vpc 기준 victim 선택이 "가장 먼저 채워진 line부터" 도출됨

---

## 실험 결과 (b) Seq, FIFO

`mark_page_invalid()` 수정(`line->vpc--`만 수행) 후 재실행:
```
0, 1, 2, 3, ..., 217
```

> `pqueue_change_priority` 호출이 기존 greedy의 erase 순서를 바꾼 것으로 보임

| 항목 | 값 |
|---|---|
| tt_lines | 8192 |
| full_line_cnt | 7655 |
| free_line_cnt | 3 |
| write_credits | 192 |
| victim_line_cnt | 532 |
| gc_count | 218 |

---

## Greedy vs FIFO — 순차 쓰기 비교

| 항목 | Greedy(vpc) | FIFO |
|---|---|---|
| gc_count | 218 | 218 |
| write_seq 순서 | 완전 오름차순 | 완전 오름차순 |
| clat p99 / p99.9 / max | 5211 / 5342 / 5320 us | 5211 / 5211 / 5286 us |
| 이상값 | 없음 | 없음 |

동일한 GC 발생 횟수(218)와 선택 순서 패턴, 거의 동일한 latency 분포
→ **순차 쓰기 조건에서는 Greedy(vpc)와 FIFO가 사실상 동일하게 동작**

---

## Latency 그래프 (Seq)

precondition 구간(0~15초, ~1700us대 평탄) → seq_gc_invoke 진입 후(15초 이후) GC로 인한 latency가 약 5500~5600us 수준으로 계단식 상승, Greedy/FIFO 유사한 패턴

![bg right:60% fit](../URA/daily/assets/seq_greedy_lat.png)

---

## Random Write 비교 (a) Greedy

```
558, 191, 64, 484, 65, 305, 308, 102, 218, 694, ...(불규칙)
```

| 항목 | 값 |
|---|---|
| tt_lines | 8192 |
| full_line_cnt | 7655 |
| free_line_cnt | 3 |
| write_credits | 192 |
| victim_line_cnt | 532 |
| gc_count | 218 |

Seq, Greedy와 gc_count·free_line_cnt·victim_line_cnt 등 **최종 수치가 완전히 동일**, `write_seq` 순서만 뒤섞여 나타남

**해석**: Greedy는 그 순간의 vpc만 보고 victim을 고르므로, 워크로드와 무관하게 GC 총량·최종 free space는 동일

---

## Random Write 비교 (b) FIFO

랜덤 쓰기에서도 완전한 오름차순 유지:
```
0, 1, 2, 3, ..., 254
```

| 항목 | 값 |
|---|---|
| tt_lines | 8192 |
| full_line_cnt | 7655 |
| free_line_cnt | 2 |
| write_credits | 448 |
| victim_line_cnt | 533 |
| gc_count | 255 |

**해석**: FIFO는 "가장 먼저 채워진 line"을 기계적으로 고름 → valid 데이터가 많이 남은 line도 선택하게 되어 매 GC마다 옮길 데이터量 증가 → GC가 218회(Greedy) → **255회(FIFO)**로 더 자주 발생

---

## Greedy vs FIFO — 랜덤 쓰기 비교

| 항목 | Random, Greedy | Random, FIFO |
|---|---|---|
| gc_count | 218 | **255** |
| free_line_cnt(최종) | 3 | 2 |
| victim_line_cnt | 532 | 533 |
| write_seq 순서 | 불규칙(무작위) | 완전 오름차순 |
| clat p99 / p99.9 / max | 5211 / 5276 / 5323 us | **10028 / 22152 / 31693 us** |

---

## Latency 그래프 (Random)

Random·Greedy는 Seq와 거의 동일한 형태(15초 이후 ~5500us 평탄 상승)

Random·FIFO는 15초 이후 8000~30000us 범위로 넓게 산개, 스파이크 폭이 훨씬 크고 불규칙

![bg right:60% fit](../URA/daily/assets/rand_fifo_lat.png)

---

## 결론 — 순차 쓰기

Greedy(vpc)와 FIFO(write_seq)가 사실상 동일한 line을 선택, 큰 차이가 드러나지 않음

---

## 결론 — 랜덤 쓰기

1. **Greedy**는 어떤 워크로드든 "정리 비용이 가장 싼 line"을 우선 → GC 총량이 워크로드 패턴과 무관하게 안정적(218회로 동일)

2. **FIFO**는 정리 비용을 고려하지 않고 오래된 순서만 따름 → 랜덤 쓰기에서 valid 데이터가 많이 남은 line을 GC하게 되는 경우가 늘어
   - GC 횟수 **255회**
   - tail latency 최대 **31.7ms** (Greedy 대비 약 6배)

**즉, FIFO는 선택 순서가 항상 write_seq 순이므로 "정리 비용을 고려하지 않는다"는 점이 랜덤 워크로드에서 성능 저하로 직접 드러남**
