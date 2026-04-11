import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const AnimatedCounter = ({ to, duration = 1200, suffix = "", className }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (to === 0 || hasRun.current) return;
    hasRun.current = true;

    const steps = 40;
    const increment = to / steps;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [to, duration]);

  return (
    <span className={className}>
      {count}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
