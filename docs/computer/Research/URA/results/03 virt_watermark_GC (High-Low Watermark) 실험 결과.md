# High/Low Watermark GC 실험 (1~3차)

## 목적
`gc_thres_lines`(low)와 `gc_thres_lines_high`(high) 두 임계값을 분리해, GC를 "필요할 때 조금씩" 처리할지 "몰아서 한 번에" 처리할지에 따라 latency 패턴이 어떻게 달라지는지 검증한다.

## 핵심 코드 변경 — high 도달 시 low까지 몰아서 GC

```c
static void foreground_gc(struct conv_ftl *conv_ftl)
{
    if (should_gc_high(conv_ftl)) {
        while (should_gc(conv_ftl)) {          // low(gc_thres_lines) 밑으로 내려갈 때까지 반복
            if (do_gc(conv_ftl, true) != 0)    // victim 없으면 중단
                break;
        }
    }
    // low 단독으로는 opportunistic GC를 실행하지 않도록 분기 제거 (2차에서 확정)
}
```

- **기존**: high에 걸려 GC가 여러 번 필요해도 `GC 발생 → 다른 작업 → GC 발생` 순서
- **변경 후**: `GC 모두 처리 → 다른 작업` 순서로, high~low 사이를 한 번에 몰아서 처리

## 1차 결과 (low=2/134, high=2 고정)

| low | free_line_cnt(최종) | victim_line_cnt | gc_count |
|---|---|---|---|
| 2 | 3 | 532 | 218 |
| 134 | 135 | 400 | 350 |

- `low=134`: free_line_cnt가 실행 내내 **134 근처에서만 유지**되고 high(2)까지 한 번도 안 내려감 — while 반복(강제 몰아치기) 구간이 관찰되지 않고, opportunistic GC(`force=false`, 1회씩)만 계속 발동
- `gc_count`가 218 → **350**으로 오히려 증가: low watermark가 미리 개입해 여유 공간을 지속적으로 확보
- **원인**: opportunistic GC가 공간을 회수하는 속도 ≥ 워크로드(`--bs=256k`)가 공간을 소모하는 속도 → free line이 위험 수준(high=2)까지 몰릴 일 자체가 없음
- **다음 계획**: fio `bs`를 키워 소모 속도를 높이면 high watermark 개입(강제 몰아치기) 구간을 관찰할 수 있을 것으로 예상

![[seq_gc_low2_lat.png]]
![[seq_gc_low134_free 1.png]]

## 2차 결과 — opportunistic 분기 제거 후 (low=2/134/268, high=2 고정)

1차의 "low 단독 opportunistic GC가 계속 개입해 high까지 안 내려가는" 문제를 해결하기 위해, **low 단독으로는 아무 GC도 하지 않고 high 도달 시에만 while로 몰아서 처리**하도록 구조 변경.

| low | free_line_cnt(최종) | victim_line_cnt | gc_count |
|---|---|---|---|
| 2 (회귀 확인) | 3 | 532 | 218 — 기존과 완전 일치, 회귀 없음 |
| 134 | 51 | 484 | 266 |
| 268 | 52 | 483 | 267 |

- `low=134`: 1차(opportunistic 버전) 대비 `free_line_cnt`가 135→**51**로 오히려 낮아지고 `gc_count`는 350→**266**으로 감소 — opportunistic 개입이 없어져 write가 방해 없이 진행되다가 high 도달 시에만 몰아서 처리하는 패턴으로 바뀐 결과
- `low=134`와 `low=268`의 최종 `free_line_cnt`(51, 52)가 서로 거의 같음 — low 값이 달라도 최종 상태가 비슷하게 수렴하는 현상 관찰

**Latency/free_line 그래프 관찰**
- `low=2,high=2`(회귀): GC 진입부터 상승, free_line_cnt가 전 구간에서 정확히 `2`로 고정 (GC 1회로 확보한 여유가 바로 다음 요청에서 소진)
- `low=134,high=2`: 큰 latency 스파이크가 **두 번**(약 400~500ms) 관찰, free_line_cnt가 `2→134`로 수직 점프하는 버스트가 캡처 구간(0~10초) 안에서 두 번 — latency 스파이크 횟수와 free_line 버스트 횟수가 정확히 대응
- `low=268,high=2`: latency 스파이크가 **한 번**(약 10⁶us, 다른 두 실험보다 훨씬 큼), free_line 버스트도 **한 번만** — 버스트가 드문 대신 훨씬 크게 발생

![[seq_gc_low2_lat 1.png]] ![[seq_low2_freeLine_whole.png]]
![[seq_gc_low134_lat 1.png]] ![[seq_low134_freeLine_whole.png]]
![[seq_gc_low268_lat.png]] ![[seq_low268_freeLine_whole.png]]

**정리**: low를 낮게 잡으면 자주·작게 몰아치고, 높게 잡으면 드물게·크게 몰아친다는 트레이드오프가 그래프로 명확히 확인됨.

## 3차 결과 (재검증, low=2/134/268)

| low | free_line_cnt | write_credits | victim_line_cnt | gc_count |
|---|---|---|---|---|
| precondition 직후 | 535 | — | 0 | 0 |
| 2 | 3 | 192 | 532 | 218 |
| 134 | 51 | 192 | 484 | 266 |
| 268 | 52 | 192 | 483 | 267 |

2차와 완전히 동일한 수치로 재현 — 구조 변경(opportunistic 분기 제거)의 효과가 안정적으로 재현됨을 확인.

## 시간 측정 관련 이슈와 해결

- `/proc/uptime`을 수동으로 찍어 계산한 `START_TIME`과 실제 dmesg GC 발생 시점 사이에 예상보다 큰 오차 발견 (명령어 실행 사이의 입력 지연 등이 원인으로 추정)
- **해결 방향**: `/proc/uptime` 수동 측정 대신 fio `--output-format=json` 결과의 `job_start`를 사용하고, `uptime -s`(서버 부팅 시각)와 조합해 절대 시각을 계산하는 방식으로 전환 예정

## 결론
- Watermark 구조(high 도달 시 low까지 while로 몰아서 GC)는 의도한 대로 "필요할 때만 몰아서 처리"하는 패턴을 안정적으로 만들어냄
- low 값이 커질수록 GC가 드물지만 한 번에 크게 발생하는 방향으로 트레이드오프가 이동하며, 일정 수준 이상에서는 최종 상태가 low 값에 덜 민감해짐(134·268에서 유사한 수렴)
