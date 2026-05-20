import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { concepts } from "@/content/registry";
import { familyAccent, familyClass, familyLabel } from "@/lib/family";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAudio } from "@/audio/useAudio";
import { useApp } from "@/lib/store";
import { T, useT } from "@/i18n/T";
import { useLocalizedCurriculum } from "@/content/useLocalizedConcept";

export function HomePage() {
  const t = useT();
  const navigate = useNavigate();
  const { audio, enable, play } = useAudio();
  const completed = useApp((s) => s.completed);
  const localCurriculum = useLocalizedCurriculum();

  const handleBegin = async () => {
    if (!audio.enabled) await enable();
    const intro = concepts[0]!;
    await play(intro.motif);
    navigate(`/learn/${intro.slug}`);
  };

  const tracks = [
    {
      family: "kafka" as const,
      heading: t({ en: "Kafka", ko: "카프카" }),
      sub: t({ en: "The replayable log", ko: "재생 가능한 로그" }),
      body: t({
        en: "Brokers, topics, partitions, replication, streams, exactly-once, multi-DC.",
        ko: "브로커, 토픽, 파티션, 복제, 스트림즈, 정확히 한 번, 멀티 DC.",
      }),
    },
    {
      family: "redis" as const,
      heading: t({ en: "Redis", ko: "레디스" }),
      sub: t({ en: "The in-memory toolkit", ko: "인메모리 툴킷" }),
      body: t({
        en: "Typed data structures, pub/sub, streams, transactions, cluster, persistence, Sentinel.",
        ko: "타입 자료구조, Pub/Sub, 스트림, 트랜잭션, 클러스터, 영속화, Sentinel.",
      }),
    },
    {
      family: "pattern" as const,
      heading: t({ en: "Patterns", ko: "패턴" }),
      sub: t({ en: "Battle-tested combinations", ko: "검증된 조합들" }),
      body: t({
        en: "Cache-aside, write-through, event sourcing, outbox, rate limit, leaderboards.",
        ko: "캐시 어사이드, 라이트 스루, 이벤트 소싱, 아웃박스, 속도 제한, 리더보드.",
      }),
    },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 lg:py-16">
      <Hero onBegin={handleBegin} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {tracks.map((track) => (
          <Card key={track.family} className={familyClass[track.family]}>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ background: familyAccent[track.family] }}
              />
              <Badge tone="concept">{t(familyLabel[track.family])}</Badge>
            </div>
            <h3 className="mt-3 font-display text-2xl text-ink-50">{track.heading}</h3>
            <p className="mt-1 text-sm text-ink-200">{track.sub}</p>
            <p className="mt-3 text-[0.92rem] text-ink-100">{track.body}</p>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-300">
              <T en="Curriculum" ko="커리큘럼" />
            </div>
            <h2 className="mt-1 font-display text-title text-ink-50">
              <T en="All concepts" ko="전체 개념" />
            </h2>
          </div>
          <Link to="/credits" className="text-sm text-ink-300 underline-offset-4 hover:underline">
            <T en="Credits →" ko="크레딧 →" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {localCurriculum.map((group) => (
            <Card key={group.id} className={familyClass[group.family]}>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--concept)" }}
                />
                <span className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-300">
                  {group.label}
                </span>
              </div>
              <ul className="mt-2 flex flex-col gap-1">
                {group.slugs.map((slug) => {
                  const c = concepts.find((x) => x.slug === slug);
                  if (!c) return null;
                  const done = completed.includes(slug);
                  const localTitle = t({ en: c.title, ko: c.title_ko ?? c.title });
                  return (
                    <li key={slug}>
                      <Link
                        to={`/learn/${slug}`}
                        className="flex items-center justify-between gap-2 rounded-md px-1 py-1.5 text-[0.92rem] text-ink-100 hover:bg-white/5"
                      >
                        <span className="truncate">{localTitle}</span>
                        {done ? (
                          <span aria-label={t({ en: "completed", ko: "완료" })} className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function Hero({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="grid grid-cols-12 items-center gap-6">
      <div className="col-span-12 lg:col-span-7">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2">
            <Badge tone="concept" className="concept-kafka"><T en="Kafka" ko="카프카" /></Badge>
            <Badge tone="concept" className="concept-redis"><T en="Redis" ko="레디스" /></Badge>
            <Badge tone="concept" className="concept-pattern"><T en="Patterns" ko="패턴" /></Badge>
          </div>
          <h1 className="mt-4 font-display text-hero text-ink-50">
            <T en="High-traffic architecture," ko="고트래픽 아키텍처를," />
            <br />
            <span className="bg-gradient-to-r from-kafka-300 via-redis-300 to-pattern-300 bg-clip-text text-transparent">
              <T en="learned by touch." ko="손으로 익히다." />
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-ink-100">
            <T
              en="An interactive 2D + 3D + musical tutorial that explains Kafka and Redis from first principles up to multi-DC, exactly-once, sharding, and real architectural patterns — with leitmotifs that play as the system reacts."
              ko="카프카와 레디스를 기초 원리부터 멀티 DC, 정확히 한 번, 샤딩, 실전 아키텍처 패턴까지 설명하는 인터랙티브 2D + 3D + 음악 튜토리얼입니다. 시스템이 반응할 때마다 라이트모티프가 흘러나옵니다."
            />
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="primary" onClick={onBegin}>
              <T en="Begin the tour" ko="투어 시작하기" />
            </Button>
            <Link
              to="/learn/redis-data-types"
              className="text-sm text-ink-200 underline-offset-4 hover:underline"
            >
              <T en="Jump into Redis basics →" ko="레디스 기초로 바로 가기 →" />
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-3 text-[0.78rem] text-ink-300">
            <span className="kbd">↵</span>
            <T en="to advance" ko="다음으로" />
            <span className="opacity-50">·</span>
            <span className="kbd">M</span>
            <T en="mute" ko="음소거" />
            <span className="opacity-50">·</span>
            <span>
              <T
                en="HashRouter — runs on GitHub Pages without server config"
                ko="HashRouter — 서버 설정 없이 GitHub Pages에서 실행됩니다"
              />
            </span>
          </div>
        </motion.div>
      </div>
      <div className="col-span-12 lg:col-span-5">
        <HeroOrnament />
      </div>
    </section>
  );
}

function HeroOrnament() {
  return (
    <div className="relative aspect-square w-full max-w-md justify-self-center overflow-hidden rounded-3xl border border-white/5 bg-ink-800/70">
      <div className="absolute inset-0 animate-pulse_soft" aria-hidden>
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-kafka-500/30 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-44 w-44 rounded-full bg-redis-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-pattern-500/30 blur-3xl" />
      </div>
      <svg viewBox="0 0 200 200" className="relative h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="hg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffb454" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#e23838" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#19b5c0" stopOpacity="0.25" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="62" stroke="rgba(255,255,255,0.06)" fill="url(#hg)" />
        <g className="origin-center animate-drift">
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            const x = 100 + Math.cos(a) * 76;
            const y = 100 + Math.sin(a) * 76;
            return <circle key={i} cx={x} cy={y} r={4} fill="#5be6ee" />;
          })}
        </g>
        <g>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x1 = 100 + Math.cos(a) * 50;
            const y1 = 100 + Math.sin(a) * 50;
            const x2 = 100 + Math.cos(a) * 80;
            const y2 = 100 + Math.sin(a) * 80;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,180,84,0.45)"
                strokeWidth="0.8"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
