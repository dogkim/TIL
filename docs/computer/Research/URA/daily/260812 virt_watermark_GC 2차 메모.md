```C
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
    //     do_gc(conv_ftl, false);
    // }
}
```

1. precondition하고 남는 free_line 개수 확인
2. 바꾼후의 2,2 데이터 추출
3. 수정후의 나머지 데이터들 추출(134, 268)

precondition
```
wherry03@mecca-WS-C621E-SAGE-Series:~/nvmevirt$ sudo dmesg | grep -i "gc_count\|tt_lines\|free_line_cnt\|full_line_cnt\|victim_line_cnt\|write_credits" | tail -6
[343538.349710] NVMeVirt: tt_lines: 8192
[343538.349717] NVMeVirt: full_line_cnt: 7655
[343538.349720] NVMeVirt: free_line_cnt: 535
[343538.349724] NVMeVirt: write_credits: 192
[343538.349727] NVMeVirt: victim_line_cnt: 0
[343538.349730] NVMeVirt: gc_count: 0
```

seq_gc_invoke 2,2
344314.51 13253096.57
```
[344425.285403] NVMeVirt: tt_lines: 8192
[344425.285411] NVMeVirt: full_line_cnt: 7655
[344425.285414] NVMeVirt: free_line_cnt: 3
[344425.285418] NVMeVirt: write_credits: 192
[344425.285422] NVMeVirt: victim_line_cnt: 532
[344425.285425] NVMeVirt: gc_count: 218
```

seq_gc_invoke 134,2
345056.50 13282009.99
```
[345123.355524] NVMeVirt: tt_lines: 8192
[345123.355530] NVMeVirt: full_line_cnt: 7655
[345123.355533] NVMeVirt: free_line_cnt: 51
[345123.355536] NVMeVirt: write_credits: 192
[345123.355539] NVMeVirt: victim_line_cnt: 484
[345123.355543] NVMeVirt: gc_count: 266
```

seq_gc_invoke 268,2
345560.24 13301458.08

```
[345601.817880] NVMeVirt: tt_lines: 8192
[345601.817886] NVMeVirt: full_line_cnt: 7655
[345601.817890] NVMeVirt: free_line_cnt: 52
[345601.817894] NVMeVirt: write_credits: 192
[345601.817897] NVMeVirt: victim_line_cnt: 483
[345601.817900] NVMeVirt: gc_count: 267
```