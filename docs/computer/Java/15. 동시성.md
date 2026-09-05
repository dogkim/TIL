## 동시성(Concurrency) vs 병렬성(Parallelism)

- **동시성**: 두 작업이 (번갈아 가며) 동시에 **진행**되고 있음
- **병렬성**: 두 작업이 **실제로 동시에** 실행됨 (멀티코어 등에서)

Java는 **스레드(thread)**로 동시성을 지원 — 각 스레드는 자신만의 메서드 호출 스택과 프로그램 카운터를 가지며, 메모리·파일 핸들 같은 애플리케이션 전역 자원은 다른 스레드와 공유함. 이를 **멀티스레딩**이라 함.

**권장 사항**: 대부분의 프로그래머는 동기화를 대신 관리해주는 기존 동시성 API의 컬렉션·인터페이스를 사용해야 함. 고급 프로그래머만 `synchronized` 키워드와 `wait`/`notify`/`notifyAll`을 직접 사용하고, `Lock`/`Condition`은 가장 숙련된 경우에만 사용 권장.

## 스레드의 생명주기

1. **new**: 스레드 객체 생성 직후
2. **runnable**: `start()` 호출 후 — 작업을 실행 중인 것으로 간주됨 (OS 레벨에서는 다시 **ready**(할당 대기)와 **running**(실제 실행 중)으로 나뉨)
3. **waiting**: 다른 스레드가 어떤 작업을 완료하기를 기다림 — 다른 스레드가 notify해야 runnable로 복귀
4. **timed waiting**: 지정된 시간 동안 대기 (`Thread.sleep()`으로 잠든 스레드가 여기 해당) — 시간이 지나거나 기다리던 이벤트가 발생하면 runnable로 복귀
5. **blocked**: 즉시 완료할 수 없는 작업(예: 잠긴 자원 접근)을 시도하다가 일시적으로 대기

**스레드 스케줄링**: OS가 어떤 스레드를 프로세서에 배정(**디스패치**)할지 결정하는 과정. 스레드 우선순위가 순서에 영향을 주지만 실행 순서를 보장하지는 않음. 대부분의 OS는 **타임슬라이싱**으로 같은 우선순위의 스레드들이 프로세서를 라운드로빈 방식으로 나눠 씀.

**기아(Starvation)와 무기한 연기**: 우선순위 낮은 스레드가 계속 뒤로 밀리는 현상 — OS는 **에이징(aging)** 기법으로 방지(오래 기다린 스레드의 우선순위를 점차 높임).

**데드락(Deadlock)**: 스레드1이 스레드2를 기다리고, 스레드2도 (직간접적으로) 스레드1을 기다려서 둘 다 영원히 진행하지 못하는 상태.

## Runnable과 Executor

```java
class PrintTask implements Runnable {
    public void run() {
        // 이 스레드에서 실행할 작업
    }
}
```

- `Runnable` 인터페이스: 동시에 실행 가능한 "작업"을 나타냄 — 추상 메서드 `run()` 하나만 선언
- `Thread.sleep(ms)`: 현재 스레드를 지정 시간만큼 timed waiting 상태로 둠 — checked 예외인 `InterruptedException`을 던질 수 있음
- `main` 메서드의 코드는 JVM이 만든 **메인 스레드**에서 실행됨. `main`이 끝나도, 다른 스레드가 살아있으면 프로그램은 계속 실행됨(모든 스레드가 끝나야 프로그램이 종료됨)

**Executor 프레임워크(권장 방식)**: `Thread` 객체를 직접 만들어 쓰기보다 `Executor` 인터페이스로 `Runnable` 실행을 관리하는 것이 권장됨 — 보통 **스레드 풀(thread pool)**을 만들어 관리하며, 기존 스레드를 재사용해 스레드 개수를 최적화함으로써 성능을 향상시킴.

```java
ExecutorService executor = Executors.newFixedThreadPool(4);
executor.execute(new PrintTask());
executor.shutdown();   // 더 이상 새 작업을 받지 않고, 기존 작업이 끝나면 종료
```

## 동기화 기초

여러 스레드가 같은 데이터를 동시에 변경하면 **경쟁 조건(race condition)**이 발생할 수 있음 — `synchronized` 키워드로 메서드/블록을 감싸면, 한 번에 하나의 스레드만 그 코드를 실행하도록 보장(상호 배제, mutual exclusion).

```java
public synchronized void increment() {
    count++;   // 여러 스레드가 동시에 호출해도 안전
}
```
