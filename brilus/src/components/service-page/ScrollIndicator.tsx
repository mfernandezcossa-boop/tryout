import React, { useEffect, useState } from "react";

interface Props {
  scrollRef: React.RefObject<HTMLElement>;
  count: number;
  className?: string;
}

const ScrollIndicator: React.FC<Props> = ({ scrollRef, count, className = "" }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / count;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(count - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef, count]);

  const scrollToIndex = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / count;
    el.scrollTo({ left: cardWidth * i, behavior: "smooth" });
  };

  if (count <= 1) return null;

  return (
    <div className={`md:hidden flex justify-center gap-2 mt-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => scrollToIndex(i)}
          aria-label={`Ir a tarjeta ${i + 1}`}
          className={`h-2 rounded-full transition-all duration-300 ${
            activeIndex === i ? "w-8 bg-foreground" : "w-2 bg-foreground/30"
          }`}
        />
      ))}
    </div>
  );
};

export default ScrollIndicator;
