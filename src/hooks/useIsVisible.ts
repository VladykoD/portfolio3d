import { MutableRefObject, useEffect, useState } from 'react';

export function useIsVisible(
  ref: MutableRefObject<HTMLElement | HTMLDivElement | null>,
  threshold = 0,
  rootMargin = '0%',
) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && ref.current) {
      const elem = ref.current;
      const observer = new IntersectionObserver(
        (items) => {
          for (const entry of items) {
            if (entry.target === elem) {
              setActive(entry.isIntersecting);
            }
          }
        },
        { threshold, rootMargin },
      );
      observer.observe(elem);

      return () => {
        observer.unobserve(elem);
        observer.disconnect();
        setActive(false);
      };
    }
  }, [ref, threshold]);

  return active;
}
