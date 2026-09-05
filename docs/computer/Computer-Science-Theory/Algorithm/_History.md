# computer/Algorithm 이력

01~10번 파일(정확성, 점근 분석, 점화식, 분할정복, 선형시간 정렬, Red-Black 트리·해싱, 탐욕 알고리즘, 그래프 알고리즘, 동적계획법, 힙/힙정렬) — 시험이 끝난 뒤 "부족한 부분 채워서 깔끔하게 정리해달라"는 요청에 따라, 기존 강의 필기의 빈틈을 CLRS(Introduction to Algorithms) 수준의 표준 지식으로 보강해 완성한 노트. 원본 필기는 대부분 축약된 상태였음.

파일명을 영어 제목에서 한국어 제목으로 변경(2026-09-05).

01번(정확성)이 영문 원문과 한글 번역이 뒤섞인 채 헤더 구조도 없던 것을 표·헤더로 재구성. 02번(점근적 분석)의 산발적인 영문 헤더와 어색한 트레일링("등등..")을 정리하고 Big-O 증명 예시를 더 읽기 쉽게 다듬음. 03~10번은 이미 CLRS 수준으로 잘 정리되어 있어 별도 수정 없음(2026-09-05).

11~12번 파일(무작위 알고리즘, NP-완전성) 신규 추가 — "알고리즘1" 강의자료(2026-09-05 확보) 중 Lec6/7(Randomized Algorithms)과 Lec19(NP-Completeness)가 기존 01~10번 어디에도 다뤄지지 않은 주제였기에 CLRS 수준으로 새로 정리. 11번은 Bogo Sort의 기댓값/worst-case 대비, Randomized Quicksort의 indicator random variable을 이용한 $\Theta(n\log n)$ 기댓값 증명을 담음(SELECT의 상세 증명은 04번에 이미 있으므로 교차 참조만). 12번은 P/NP/NP-hard/NP-complete 정의, 다항 리덕션, Cook-Levin 정리, SAT/CNF/3-CNF, P vs NP-complete 문제 비교표를 담음.

07번(탐욕 알고리즘)에 "보강" 절 두 개 추가 — 같은 강의자료의 Lec17/18(Greedy Algorithms I/II)이 기존 07번보다 더 formal한 증명을 포함하고 있어(Huffman의 Lemma 1·2 형식적 귀납 증명, Prim의 cut property 형식적 증명) 그 부분만 발췌해 파일 끝에 추가. 기존 내용은 수정하지 않음.

Lec9/10(Data Structures I/II = BST, Red-Black Tree, Hashing), Lec11~13(Graph I/II/III), Lec14~16(DP I/II/III)은 확인 결과 기존 06/08/09번 및 DataStructure 폴더 내용과 실질적으로 동일해 추가하지 않음. Union-Find/Disjoint-Set은 이 강의자료 전체에 전혀 등장하지 않아(Kruskal's Algorithm 자체가 다뤄지지 않음) 새 파일을 만들지 않음. "기말 review" PDF 4종(그래프/DP/Greedy/NP)은 이미지 기반이라 텍스트 추출이 되지 않아 사용하지 못함(2026-09-05).
