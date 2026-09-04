```
date -d "$(uptime -s)" +%s
```
1787197202

2026-08-20 12:40:02


```
sudo dmesg | tail -10
```

```
sudo dmesg | grep "GC-ing" > gc_log.txt
```
22
[92285.689129] NVMeVirt: tt_lines: 8192
[92285.689165] NVMeVirt: full_line_cnt: 7655
[92285.689169] NVMeVirt: free_line_cnt: 3
[92285.689172] NVMeVirt: write_credits: 192
[92285.689175] NVMeVirt: victim_line_cnt: 532
[92285.689179] NVMeVirt: gc_count: 218

134
[92646.879887] NVMeVirt: tt_lines: 8192
[92646.879892] NVMeVirt: full_line_cnt: 7655
[92646.879894] NVMeVirt: free_line_cnt: 51
[92646.879896] NVMeVirt: write_credits: 192
[92646.879898] NVMeVirt: victim_line_cnt: 484
[92646.879901] NVMeVirt: gc_count: 266

268
[93041.676330] NVMeVirt: tt_lines: 8192
[93041.676337] NVMeVirt: full_line_cnt: 7655
[93041.676341] NVMeVirt: free_line_cnt: 52
[93041.676344] NVMeVirt: write_credits: 192
[93041.676347] NVMeVirt: victim_line_cnt: 483
[93041.676351] NVMeVirt: gc_count: 267