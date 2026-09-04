# 사전 준비 — 실험 2, 3 (6시~7시, 1시간)

> 시간이 짧으니 여기 있는 건 실험 시작 전에 다 끝내둘 것들. 서버 앞에서는 명령어만 실행하면 되게.

---

## 실험 2 — line당 block 수를 높여서 GC 주기 변화 관찰

**가설**: line당 block 수를 높이면 line 하나의 크기가 커지고, 그만큼 GC가 걸리는 주기(간격)도 길어질 것이다.

### 어떤 값을 바꿀지 미리 정하기
지금(1ch·1way·1plane)은 **line = block 1개**로 대응됨. line당 block 수를 늘리려면, 하나의 line이 여러 채널/LUN에 걸쳐 구성되도록 채널 또는 LUN 수를 늘려야 함.

```c
NAND_CHANNELS (1)      →  후보: 2, 4
LUNS_PER_NAND_CH (1)    →  그대로 두거나 같이 조정
```

**주의**: `GLOBAL_WB_SIZE (MB(1))`는 고정해뒀으니 채널/LUN을 늘려도 이전 같은 크래시(buffer_allocate)는 재발하지 않을 것으로 예상됨 — 그래도 첫 시도는 작은 배수(2)부터.

### 미리 계산해둘 것 (값 정해지는 대로 채워넣기)

| 항목 | 계산식 | 1ch(기존) | 2ch(예정) |
|---|---|---|---|
| 총 block 수 | `BLKS_PER_PLN`(고정, 8192) | 8192 | 8192 |
| line당 block 수 | `NAND_CHANNELS × LUNS_PER_NAND_CH` | 1 | 2 |
| 총 line 수 (`tt_lines`) | 총 block ÷ line당 block | 8192 | **4096으로 줄어듦(확인 필요)** |
| line 크기 | 채널 수만큼 병렬로 커짐 | 4MiB | **8MiB(추정)** |
| host accessible line 수 (OP 7% 제외) | tt_lines × 100/107 | 7656 | 재계산 필요 |
| precondition 후 남는 free line | tt_lines − accessible line | 536 | 재계산 필요 |
| GC 트리거까지 추가 write량 | (free line−2) × line크기 | 2200M | **재계산 필요 (아래 참고)** |

**미리 해둘 계산**: 채널을 2로 늘리면 line 하나가 두 블록을 병렬로 쓰므로, tt_lines 자체가 절반(4096) 근처로 줄어들 가능성이 높음 — `init_lines()`의 `lm->tt_lines = spp->blks_per_pl` 정의를 다시 보고, `blks_per_pl`이 채널 수에 영향받는지 코드에서 미리 확인해둘 것. (현장에서 계산하면 시간 낭비되니 지금 확인)

### seq_gc_invoke.sh 사이즈도 새로 계산 필요
2200M은 1ch 기준 값이라, 채널을 늘리면 이 값도 다시 계산해서 **`seq_gc_invoke_2ch.sh`** 같은 새 스크립트로 미리 만들어두기.

### 준비물 체크리스트
- [ ] `ssd_config.h`에서 NAND_CHANNELS 값 후보(2) 정하고 미리 diff 만들어두기
- [ ] 새 tt_lines/line크기 계산해서 필요한 `--size` 값 계산해두기
- [ ] `seq_gc_invoke_2ch.sh` 미리 작성 (파일명 구분해서 기존 것과 안 섞이게)
- [ ] 재빌드까지 시간 걸리니, 서버 붙자마자 바로 `make clean && make` 돌릴 수 있게 코드 수정은 미리 다 해두기

---

## 실험 3 — High/Low Watermark 적용 후 latency 관찰

**지금 상태**: `gc_thres_lines`(low, 코드상 정의만 있고 현재 미사용 확인 필요)와 `gc_thres_lines_high`(실제 GC 트리거에 쓰이는 값)가 **둘 다 2로 동일** — 즉 지금은 워터마크 "간격"이 없는 상태.

### 진짜 워터마크로 만들려면
두 값을 다르게 설정해서 **"이 정도부터 슬슬(low) / 이 정도부터 급하게(high)"** 구간을 만들어야 함:
```c
cpp->gc_thres_lines = 200;        // low watermark: 여유 있을 때부터 미리 준비 (예시값, 확정 필요)
cpp->gc_thres_lines_high = 2;      // high watermark: 지금 값 유지 (급박 기준)
```

**확인해둘 것 — `gc_thres_lines`(low)가 코드 어디서 실제로 쓰이는지**
```bash
grep -n "gc_thres_lines\b" conv_ftl.c
```
`should_gc()`(low 기준 판단 함수)가 정의만 있고 실제로 호출되는 곳이 안 보였음 — 지금 구조는 `foreground_gc()`가 `should_gc_high()`만 체크하고 있어서, **low watermark가 개입할 지점이 코드에 아직 없을 수 있음**. 이 경우 두 가지 선택지:
1. `should_gc()`(low)를 호출하는 지점을 직접 코드에 추가해야 함 (예: 여유 있을 때 background로 미리 GC 시작하는 로직)
2. 아니면 실험 목적을 "low/high 값 차이가 있을 때 free_line_cnt 추이만 비교"로 좁혀서, 코드 수정 없이 값만 바꿔 관찰

**→ 어느 쪽으로 할지 서버 붙기 전에 정해야 시간 안 씀.** 1번(코드에 low watermark 개입 로직 추가)까지 하려면 시간이 더 필요할 수 있음.

### low watermark 값 후보 미리 정해두기
```
gc_thres_lines_high = 2 (고정)
gc_thres_lines(low) 후보: 50 / 200 / 500  → 한 세션에 하나만 테스트 가능할 듯, 우선순위 정해두기
```

### 준비물 체크리스트
- [ ] `grep -n "gc_thres_lines\b" conv_ftl.c` 결과 미리 확인 — low watermark가 실제로 개입되는 코드 경로가 있는지 파악
- [ ] (필요시) low watermark 개입 로직을 어디에 추가할지 미리 코드 초안 작성 — `check_and_refill_write_credit()` 또는 별도 지점에 `should_gc()` 체크 추가하는 형태로
- [ ] low watermark 값 후보 우선순위 정하기 (시간 부족하면 하나만 테스트)
- [ ] `conv_init_params()`에서 값 수정할 정확한 위치 확인해두기

---

## 공통 — 시간 절약을 위해 미리 해둘 것
- [ ] 두 실험 다 재빌드(`make clean && make`)가 필요하므로, **코드 수정 자체는 실험 전에 다 끝내고**, 서버 붙으면 바로 빌드만 돌리기
- [ ] `--size`, 파일명 등 새로 필요한 fio 스크립트들 로컬에서 미리 작성해서, VSCode로 붙이자마자 업로드만 하면 되게 준비
- [ ] 실험 2, 3 중 시간이 부족할 경우 우선순위: (필요시 여기에 정할 것)
