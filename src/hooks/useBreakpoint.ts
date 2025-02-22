import { useEffect, useState } from 'react';

export enum Breakpoint {
  Mobile,
  TabletSmall,
  Tablet,
  Desktop,
  DesktopLarge,
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(Breakpoint.Mobile);

  useEffect(() => {
    const calculateBreakpoint = (width: number) => {
      if (width <= 375) {
        return Breakpoint.Mobile;
      }
      if (width <= 640) {
        return Breakpoint.TabletSmall;
      }
      if (width <= 961) {
        return Breakpoint.Tablet;
      }
      if (width <= 1400) {
        return Breakpoint.Desktop;
      }

      return Breakpoint.DesktopLarge;
    };

    const handler = () => {
      setBreakpoint(calculateBreakpoint(window.innerWidth));
    };

    handler();
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  return breakpoint;
}
