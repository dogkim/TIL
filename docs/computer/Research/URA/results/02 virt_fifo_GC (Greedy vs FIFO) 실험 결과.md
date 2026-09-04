# GC victim 선택 정책 비교 — Greedy(vpc) vs FIFO(write_seq)

## 목적
기존 Greedy(vpc 기준) victim 선택이 순차 쓰기 조건에서 결과적으로 FIFO처럼 동작한다는 가설을 검증하고, 랜덤 쓰기에서 두 정책의 실제 차이를 측정한다.

## 검증 방법
- `struct line`에 `write_seq`(몇 번째로 마감됐는지) 필드 추가, line이 가득 찰 때마다 전역 카운터로 순번 부여
- `#define GC_POLICY_FIFO` 매크로로 victim 우선순위 기준을 vpc(Greedy) ↔ write_seq(FIFO)로 전환
- GC 시마다 victim의 `write_seq`를 로그로 남겨, victim 선택 순서가 오름차순(역전 없음)인지 확인

**환경**: `NAND_CHANNELS=1, LUNS_PER_NAND_CH=1`, `memmap_size=32G`, precondition 후 `seq_gc_invoke`/`rand_gc_invoke` (`--bs=256k --size=3000M`)

## 결과

### 순차 쓰기 (Seq)

| 항목 | Greedy(vpc) | FIFO |
|---|---|---|
| gc_count | 218 | 218 |
| write_seq 순서 | 완전 오름차순 | 완전 오름차순 |
| clat p99 / p99.9 / max (us) | 5211 / 5342 / 5320 | 5211 / 5211 / 5286 |
| 이상값 | 없음 | 없음 |

동일한 GC 발생 횟수·선택 순서 패턴·거의 동일한 latency 분포 — **순차 쓰기 조건에서는 Greedy와 FIFO가 사실상 동일하게 동작**한다는 가설 확인.

![[seq_greedy_lat.png]]
![[seq_fifo_lat.png]]

### 랜덤 쓰기 (Random)

| 항목 | Greedy | FIFO |
|---|---|---|
| gc_count | 218 | **255** |
| free_line_cnt(최종) | 3 | 2 |
| victim_line_cnt | 532 | 533 |
| write_seq 순서 | 불규칙(무작위) | 완전 오름차순 |
| clat p99 / p99.9 / max (us) | 5211 / 5276 / 5323 | **10028 / 22152 / 31693** |

- **Greedy**: 그 순간의 vpc(valid page 개수)만 보고 victim을 고르므로, write 패턴이 순차든 랜덤이든 GC 총량·최종 free space가 동일하게 유지됨
- **FIFO**: write 패턴과 무관하게 "가장 먼저 채워진 line"을 기계적으로 선택 — 아직 valid 데이터가 많이 남은 line도 그대로 victim이 되어, 매 GC마다 옮겨야 할 데이터가 Greedy보다 커짐 → 동일 write량에서 GC가 **218회 → 255회로 증가**

![[rand_greedy_lat.png]]
![[rand_fifo_lat.png]]

Random·FIFO는 15초 이후 latency가 8000~30000us 범위에서 넓게 산개하며 스파이크 폭이 Random·Greedy보다 훨씬 크고 불규칙함.

## 결론
- **순차 쓰기**: Greedy(vpc)와 FIFO(write_seq)가 사실상 동일한 line을 선택 — 차이가 드러나지 않음
- **랜덤 쓰기**: Greedy는 워크로드 패턴과 무관하게 "정리 비용이 가장 싼 line"을 우선하므로 GC 총량이 안정적(218회 유지). FIFO는 정리 비용을 고려하지 않고 오래된 순서만 따르므로, 랜덤 쓰기에서 valid 데이터가 많이 남은 line을 GC하게 되는 경우가 늘어 **GC 횟수(255회)와 tail latency(최대 31.7ms, Greedy 대비 약 6배) 모두 크게 증가**
- FIFO는 "정리 비용을 고려하지 않는다"는 특성이 랜덤 워크로드에서 직접적인 성능 저하로 드러남을 확인
