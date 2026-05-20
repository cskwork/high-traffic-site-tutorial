# Translation guide (KO ↔ EN)

This is the shared playbook for translating the tutorial to Korean. Follow it
*verbatim* so the tone stays consistent across the 23 concept pages.

## Voice and register

- **존댓말, "-ㅂ니다 / -습니다"** — instructional tone, the way a senior
  engineer would brief a junior. Never reverts to 반말.
- **자연스러운 한국어** — translate *meaning*, not word-for-word. Reorder
  clauses so they read like a Korean tech blog, not like a machine translation.
- Avoid stiff loan phrasing like "~을 위한" 남발. Prefer 자연 어순:
  - ❌ "메시지를 전달하기 위한 토픽"
  - ✅ "메시지를 전달하는 토픽" or "메시지가 흐르는 토픽"
- One thought per sentence. Cut overlong clauses.
- Use 띄어쓰기 correctly. Acronyms and English brand names keep a space
  on either side ("Kafka는", "Redis가").

## Loanword policy

**Transliterate** these common operational nouns. Do NOT translate to native
Korean (it sounds unnatural in Korean dev culture):

| English        | Korean        |
| -------------- | ------------- |
| Kafka          | 카프카          |
| Redis          | 레디스          |
| broker         | 브로커          |
| topic          | 토픽            |
| partition      | 파티션          |
| producer       | 프로듀서        |
| consumer       | 컨슈머          |
| consumer group | 컨슈머 그룹      |
| offset         | 오프셋          |
| leader / follower | 리더 / 팔로워 |
| replica        | 레플리카        |
| stream / streams | 스트림 / 스트림즈 |
| transaction    | 트랜잭션        |
| failover       | 페일오버        |
| cluster        | 클러스터        |
| sharding       | 샤딩            |
| cache          | 캐시            |
| pipeline       | 파이프라인       |
| handler        | 핸들러          |
| string / hash / list / set | 문자열 / 해시 / 리스트 / 셋 |
| sorted set     | 정렬된 셋(ZSET) |
| channel        | 채널            |
| subscriber / publisher | 구독자 / 발행자 |
| snapshot       | 스냅샷          |
| token bucket   | 토큰 버킷       |
| sliding window | 슬라이딩 윈도우 |
| materialized view | 머터리얼라이즈드 뷰 |
| projection     | 프로젝션        |
| aggregate (DDD sense) | 어그리게이트  |

**Keep verbatim** (do NOT translate, do NOT transliterate):

- All acronyms: ISR, AOF, RDB, CQRS, CRC16, SQL, JSON, KSQL, PSYNC, PEL, CDC,
  MAXLEN, MULTI/EXEC, INCR, ZSET, XADD, XACK, XREADGROUP, XCLAIM, ZINCRBY,
  ZRANGE, ZREVRANGE, HSET, SETEX, EXPIRE, SUBSCRIBE, PUBLISH, etc.
- Product / type names: KStream, KTable, Schema Registry, MirrorMaker2,
  Sentinel, Debezium, RocksDB, JetBrains Mono, Tone.js, Vite.
- Code constants and identifiers: `acks=all`, `min.insync.replicas`,
  `enable.idempotence`, `bootstrap.servers`, `transactional.id`, etc.
- All code samples inside `<CodeBlock code="..." />` — leave 100% untouched.

**Translate** these verbs/concepts to natural Korean:

| English             | Korean              |
| ------------------- | ------------------- |
| append              | 추가하다 / append    |
| publish             | 발행하다             |
| subscribe           | 구독하다             |
| commit (offsets)    | 커밋하다             |
| ack                 | ack(확인 응답)        |
| replay              | 재생                 |
| evict               | 축출                 |
| expire              | 만료                 |
| persist             | 영속화 / 디스크에 저장 |
| recover             | 복구                 |
| rebalance           | 리밸런스             |
| at-most-once / at-least-once / exactly-once | 최대 한 번 / 최소 한 번 / 정확히 한 번 |

## What to wrap in i18n

For every user-visible English string in the assigned files:

1. **JSX text children** → `<T en="..." ko="..." />`
2. **JSX string attributes** that show up in the UI (aria-label, title, label, hint, Stage label) → use the hook: at the top of the component add `const t = useT();`, then write `aria-label={t({ en: "...", ko: "..." })}`.
3. **Object literal properties** used as displayed text (Bullets items' heading/body, CounterDisplay label/hint, ActionButton label, etc.) → `t({ en: "...", ko: "..." })`.

Add this import at the top of every file you touch:

```ts
import { T, useT } from "@/i18n/T";
```

## What NOT to touch

- Code inside `<CodeBlock code={...} />` (the whole code prop value)
- URLs, paths, slugs, identifiers
- Inline `<span className="font-mono">N</span>` and similar typeset placeholders
- Tags array (handled in registry)
- Class names, prop names, type names

## Naturalization examples

| English (source)                                                    | Bad literal KO                                | Good natural KO                                |
| ------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------- |
| "Forget the words 'message queue' for a minute."                    | "한 분 동안 '메시지 큐'라는 단어를 잊으세요."   | "잠깐 '메시지 큐'라는 단어는 잊어 주세요."     |
| "Producers can only add."                                           | "프로듀서는 단지 추가할 수 있습니다."          | "프로듀서는 오직 추가만 가능합니다."            |
| "Every consumer keeps its own playback head (an offset)."           | "모든 컨슈머는 자신의 재생 헤드(오프셋)를 가집니다." | "컨슈머마다 자기만의 재생 위치(오프셋)를 가집니다." |
| "Pick the smallest that hits your write throughput."                | "쓰기 처리량을 치는 가장 작은 것을 선택하세요." | "쓰기 처리량을 감당하는 최소값을 고르세요."     |
