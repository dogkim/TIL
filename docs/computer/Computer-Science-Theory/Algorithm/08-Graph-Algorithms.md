## 그래프 표현 방식

| | Edge membership 확인 | Neighbor query | Space |
|---|---|---|---|
| **인접 행렬 (Adjacency Matrix)** | $O(1)$ | $O(n)$ | $O(n^2)$ |
| **인접 리스트 (Adjacency List)** | $O(\deg(v))$ | $O(\deg(v))$ | $O(n+m)$ |

간선이 적은(sparse) 그래프에서는 인접 리스트가, 조밀한(dense) 그래프나 edge membership을 자주 확인해야 하면 인접 행렬이 유리.

## DFS (Depth-First Search)

`DFS(w, time)`: $w$를 방문 시작(discover) 시점을 기록하고 time++, $w$를 in-progress 상태로 표시. $w$의 이웃을 순회하며 아직 방문 안 한(unvisited) 이웃 $u$에 대해 `time = DFS(u, time)` 재귀 호출 후 time++. 모든 이웃 탐색이 끝나면 $w$를 done 상태로 옮기고 종료(finish) 시점 기록.

- **Connected component 판별**: 하나의 DFS 호출로 도달 가능한 정점들이 하나의 컴포넌트 — $O(n+m)$
- **전체 시간**: $O(n+m)$ (모든 정점과 간선을 정확히 한 번씩 처리)

### Topological Ordering

DAG(Directed Acyclic Graph)에서 DFS를 돌려 **종료 시간(finish time)의 내림차순**으로 정점을 나열하면 위상 정렬이 됨.

- 간선 $A \to B$가 있으면 항상 $A$의 finish time이 $B$보다 커야 함
  - $A$가 먼저 발견되어 $B$가 $A$의 DFS 트리 자손이 되는 경우: $A$가 $B$보다 나중에 끝남 ($A$ finish $>$ $B$ finish)
  - $B$가 먼저 발견되는 경우: $B$와 연결된 요소를 모두 탐색한 뒤 $A$로 이동하므로 $B$가 먼저 끝남. 만약 $A$가 $B$의 자손이라면 $B \to \cdots \to A \to B$의 사이클이 생기므로 DAG 가정에 모순 — 즉 이 경우는 애초에 발생할 수 없음

## SCC (Strongly Connected Components) — 코사라주 알고리즘

**단순한 방법**: 모든 정점에서 DFS를 돌려 도달 가능한 정점 집합을 비교 → 최소 $\Omega(n^2)$

**코사라주 알고리즘 ($O(n+m)$)**
1. 원래 그래프에서 DFS를 돌려 각 정점의 **finish time**을 기록 (시작 정점은 상관없음)
2. 모든 간선의 방향을 뒤집은 그래프 $G^T$를 만듦
3. finish time이 가장 큰 정점부터 순서대로 $G^T$에서 DFS 수행 — 이때 각각의 DFS 트리가 하나의 SCC

**Lemma 1**: 각 SCC를 하나의 노드로 압축하면 만들어지는 그래프는 항상 DAG. (DAG가 아니면 사이클을 이루는 두 SCC가 실제로는 하나의 SCC로 합쳐져야 함 — 모순)

**Lemma 2**: 두 SCC $A, B$ 사이에 $A \to B$ 방향의 간선이 있다면, $A$의 (원래 그래프 DFS에서의) 최대 finish time이 $B$의 최대 finish time보다 큼.
- 증명: $A$에서 처음 발견된 정점을 $z$, $B$에서 finish time이 가장 큰 정점을 $y$라 하면, $A \to B$ 간선 덕분에 $z$의 DFS 도중 $y$가 발견되어 $z.finish > y.finish$가 됨. $A$의 최대 finish는 $z.finish$ 이상이므로 $A.finish \ge z.finish > y.finish = B.finish$.

**정당성**: Lemma 2에 의해, $G^T$에서 finish time이 가장 큰 정점부터 DFS를 시작하면 — 그 정점이 속한 SCC는 (뒤집힌 그래프 기준으로) 다른 미방문 SCC로 나가는 간선이 없으므로, 그 DFS는 정확히 자신의 SCC만 발견하고 끝남. 이를 귀납적으로 반복하면 뒤집힌 DFS forest의 각 트리가 정확히 하나의 SCC와 일치함이 보장됨.

- **전체 시간**: DFS를 두 번 도므로 $O(n+m)$

## BFS (Breadth-First Search)

레벨 배열 $L_0, L_1, \dots$을 사용: $L_0$에 시작 정점, $L_1$에 그 이웃들, $L_1$을 순회하며 미방문 이웃을 $L_2$에 넣는 식으로 계속 확장.

- **Time**: $O(n+m)$
- **성질**: 최단경로(shortest path)의 부분경로(subpath)도 항상 최단경로 — Dijkstra의 정당성 증명에도 쓰이는 핵심 성질(optimal substructure)

## Dijkstra's Algorithm (음이 아닌 가중치 최단경로)

시작 정점의 거리 $d[s]=0$, 나머지는 $\infty$로 초기화. "not sure" 상태의 정점 중 $d$ 값이 가장 작은 정점을 "sure"로 확정하고, 그 이웃들의 $d$ 값을 갱신(relax): $d[v] = \min(d[v], d[u] + w(u,v))$.

**핵심 성질**
- **No path property**: 도달 불가능하면 $d[v] = \infty$
- **Upper bound property**: 항상 $d(s,v) \le d[v]$ (실제 최단거리 이하로 절대 내려가지 않음)
- **Triangle inequality**: $d(s,v) \le d[u] + w(u,v)$
- **Convergence property**: 최단경로가 $s \rightsquigarrow u \to v$ 형태이고 $d(s,u) = d[u]$라면, $u \to v$를 relax한 이후 $d(s,v) = d[v]$가 성립

**Correctness (귀납법)**: 매 반복 종료 후, sure list에 있는 모든 $v$는 $d[v] = d(s,v)$를 만족함을 보임.
- $u$를 sure list에 새로 추가한다고 하고, $d(s,u) \ne d[u]$라고 가정(모순을 노림)
- $u=s$이거나 도달 불가능한 경우는 자명하게 $d[u]$가 맞음
- 그 외의 경우 최단경로 $P$가 존재. $P$에서 sure list를 벗어나는 첫 정점을 $x$, 그 다음 정점을 $y$라 하면(가정에 의해 $d(s,x)=d[x]$), convergence property로 $d(s,y)=d[y]$
- $P$가 최단경로이므로 $d[y] = d(s,y) \le d(s,u) < d[u]$
- 하지만 $u$는 not sure 중 $d$값이 가장 작은 정점으로 선택되었으므로 $d[u] \le d[y]$ — 모순
- 따라서 not sure list가 빌 때까지 반복하면 모든 정점이 $d[v]=d(s,v)$를 만족

**Time**
- 반복 $n$번, 매 반복 find-min + delete-min + 이웃 relax(총 $m$번)
- 배열 구현: find-min $O(n)$, update $O(1)$, delete-min $O(n)$ → 전체 $O(n^2+m)$
- red-black tree / binary heap: 모든 연산 $O(\log n)$ → 전체 $O((n+m)\log n)$
- 해시 기반: find-min에 전체를 훑어야 해서 비효율적 ($O(n)$)
