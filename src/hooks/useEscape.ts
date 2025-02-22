import { useCallback, useEffect } from 'react';

export const useEscape = (condition: boolean, callback: () => void) => {
  const listener = useCallback(
    (e: KeyboardEvent) => {
      // @ts-ignore
      const keyCode = 'which' in e ? e.which : e.keyCode;

      if (e.key === 'Escape' || keyCode === 27) {
        callback();
      }
    },
    [callback],
  );

  useEffect(() => {
    document.removeEventListener('keydown', listener);

    if (condition) {
      document.addEventListener('keydown', listener);
    } else {
      document.removeEventListener('keydown', listener);
    }

    return () => document.removeEventListener('keydown', listener);
  }, [condition, listener]);
};
