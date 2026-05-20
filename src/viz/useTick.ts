import { useEffect, useRef, useState } from "react";

interface TickOptions {
  running: boolean;
  intervalMs?: number;
  onTick?: (n: number) => void;
}

export function useTick({ running, intervalMs = 800, onTick }: TickOptions) {
  const [tick, setTick] = useState(0);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTick((n) => {
        const next = n + 1;
        onTickRef.current?.(next);
        return next;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [running, intervalMs]);

  return tick;
}
