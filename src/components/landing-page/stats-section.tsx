"use client";

import { useEffect, useRef, useState } from "react";
import { Home, Handshake, Building2 } from "lucide-react";
import { AnimatedSection } from "../animations/AnimatedSection";

const stats = [
  { icon: Home, value: 8, suffix: "+", label: "Years Experience" },
  {
    icon: Handshake,
    value: 1000,
    suffix: "+",
    label: "Happy Clients",
  },
  { icon: Building2, value: 50, suffix: "+", label: "Projects" },
];

function useCountUp(target: number, duration = 1800, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return count;
}

function StatItem({
  icon: Icon,
  value,
  suffix,
  label,
  started,
}: {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  started: boolean;
}) {
  const count = useCountUp(value, 1800, started);

  return (
    <div className="flex flex-1 items-center gap-3 px-4 py-5 sm:px-10 sm:py-8">
      {/* Icon */}
      <Icon size={44} strokeWidth={1.4} className="text-gray-800 shrink-0" />

      {/* Number + label */}
      <div>
        <p className="font-heading m-0 text-[38px] font-black leading-none text-gray-900">
          {count.toLocaleString()}
          <span className="text-primary">{suffix}</span>
        </p>
        <p className="mt-1 text-[14px] font-bold text-primary">{label}</p>
      </div>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-black py-8 sm:py-12 stats-test">
      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-6">
          <h3 className="font-heading font-black uppercase tracking-wide text-primary">
            Achievements
          </h3>
          <p className="mt-1 text-gray-500">
            Our Track Record of Excellence
          </p>
        </div>

        {/* Stats strip */}
        <div
          ref={ref}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3 overflow-hidden rounded-xl bg-primary/6
                     divide-y sm:divide-y-0 sm:divide-x divide-primary/10"
        >
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} started={started} />
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
