# NVMeV GC 실험

## 1. 실험 목적
NVMeVirt(가상 NVMe SSD)에서 fio로 write 부하를 가해 SSD의 Garbage Collection(GC)을 실제로 유발시키고, 이로 인한 성능 저하(latency 증가, IOPS 하락)를 정량적으로 관측·증명한다.

---

## 2. 환경 설정

### 2-1. Kbuild
```c
#CONFIG_NVMEVIRT_NVM := y
CONFIG_NVMEVIRT_SSD := y     // Samsung 970 Pro 모델 사용
#CONFIG_NVMEVIRT_ZNS := y
#CONFIG_NVMEVIRT_KV := y
```

### 2-2. ssd_config.h (SAMSUNG_970PRO 블록)

| 항목                   | 기본값 | 변경값               |
| -------------------- | --- | ----------------- |
| `SSD_PARTITIONS`     | 4   | **4 (유지)**        |
| `NAND_CHANNELS`      | 8   | **8 (유지)**        |
| `LUNS_PER_NAND_CH`   | 2   | **2 (유지)**        |
| `MDTS`               | 6   | 6 (유지)            |
| `NAND_ERASE_LATENCY` | 0   | 3,500,000 (3.5ms) |

 **가상 SSD의 총 용량 자체를 `insmod`의 `memmap_size` 옵션으로 조절**하는 방식으로 전환.

### 2-3. nvmev.h — GC 로그 활성화
```c
#undef CONFIG_NVMEV_VERBOSE
#define CONFIG_NVMEV_DEBUG          //undef
#define CONFIG_NVMEV_DEBUG_VERBOSE  //undef
```
`conv_ftl.c`의 `do_gc()` 함수 내 `NVMEV_DEBUG_VERBOSE("GC-ing line:...")` 로그를 실제로 dmesg에 출력시키기 위해 두 매크로를 활성화. (수정 후 반드시 `make clean && make` 재빌드)

### 2-4. insmod — 가상 SSD 크기 조절
```bash
sudo insmod nvmev.ko memmap_start=128G memmap_size=4G cpus=7,8
```
- `memmap_size`를 4G로 설정해 가상 SSD 자체의 물리적 총 용량을 작게 만듦
- 마운트 후 `df -h` 확인 결과 실제 가용 용량 약 3.4G(3.7G 중)

---

## 3. fio 실험 설계

### 3-1. 공통 옵션
```bash
sudo fio --directory=/home/wherry03/nvmevirt/mnt \
  --direct=1 --ioengine=libaio --rw=randwrite --bs=4k \
  --numjobs=1 --time_based=1 --runtime=300 \
  --disable_lat=0 --disable_clat=0 --disable_slat=0 \
  --lat_percentiles=1 \
  --percentile_list=1:5:10:20:30:40:50:60:70:80:90:95:99:99.9:99.99 \
  --write_lat_log=./logfiles/... \
  --write_iops_log=./logfiles/... \
  --output=..._result.json --output-format=json
```

**옵션 선택 이유**
- `--rw=randwrite` (write 100%, read 없음): GC는 오직 write로 인한 무효(invalid) 페이지 누적으로 트리거되므로, read를 섞으면 latency 스파이크의 원인이 write인지 read인지 해석이 모호해짐. write만 사용해 원인을 명확히 함.
- **랜덤(random) vs 순차(sequential)**: 순차 쓰기는 항상 새 주소에만 기록되어 같은 LBA가 재사용되기까지 디스크를 한 바퀴 다 돌아야 하므로 무효 페이지가 잘 안 쌓임. 랜덤 쓰기는 같은 LBA가 자연스럽게 자주 재사용되어 무효 페이지가 빠르게 누적 → GC를 더 빠르고 확실하게 유발하기 위해 랜덤 선택.
- `--bs=4k`: NAND 페이지 단위와 비슷한 크기의 표준 벤치마크 블록 크기.
- `--direct=1`: OS 페이지 캐시를 우회해 디스크(가상 SSD) 자체의 실제 성능을 측정.
- `--time_based=1 --runtime=300`: 정해진 `--size` 범위를 다 채운 뒤에도 5분 동안 반복적으로 덮어쓰도록 함 → 지속적인 GC 유발.
- `--log_avg_msec`: 1000(1초 평균, 최초 시도)에서 100(더 촘촘한 시계열 확보)으로 조정.

### 3-2. 핵심 변수 — `--size` (실험 범위)
같은 가상 SSD(3.4G) 위에서 fio가 반복 쓰기할 논리적 범위를 다르게 설정해 GC 발생 여부를 비교:

| 실험 | `--size` | 디스크 대비 비율 | 결과 |
|---|---|---|---|
| 200M 실험 (초기, memmap 32G일 때) | 200M | 디스크(28G)의 0.7% | GC 로그 0건 |
| **3G 실험 (최종)** | **3G** | **디스크(3.4G)의 88%** | **GC 로그 다수 확인** |

---

## 4. GC 트리거 조건 (코드 분석)

`conv_ftl.c`:
```c
static bool should_gc(struct conv_ftl *conv_ftl) {
    return (conv_ftl->lm.free_line_cnt <= conv_ftl->cp.gc_thres_lines);
}
static inline bool should_gc_high(struct conv_ftl *conv_ftl) {
    return conv_ftl->lm.free_line_cnt <= conv_ftl->cp.gc_thres_lines_high;
}
```
```c
cpp->gc_thres_lines = 2;
cpp->gc_thres_lines_high = 2;
```
- free line(비어 있는 블록 단위)이 **2개 이하**로 떨어지면 GC 발동
- 전체 line 개수(`tt_lines`) = `BLKS_PER_PLN` = **8192개** (970PRO 모델 기준)
- 즉 전체의 약 99.98%가 채워져야 트리거되는 보수적인 조건. 디스크를 충분히 채우지 못하면(200M 실험처럼) 절대 도달하지 못함.

GC를 유발하려면 → SSD 자체를 작게 만들거나(`memmap_size` 축소), fio `--size`를 디스크 용량 대비 충분히 크게(80% 이상) 잡아야 함.





