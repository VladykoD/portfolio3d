import { MutableRefObject, useEffect } from 'react';

export const useOutsideClick = <T>(
  ref: MutableRefObject<T>,
  handler: ((e?: MouseEvent | TouchEvent) => void) | undefined,
  exclude?: Array<string>,
  safe?: Array<string>,
) => {
  useEffect(() => {
    let mounted = true;

    if (!handler) {
      return;
    }

    const refs = Array.isArray(ref) ? [...ref] : [ref];
    const listener = (event: MouseEvent | TouchEvent) => {
      // Проверяем, является ли event.target элементом DOM
      const targetElement = event.target as HTMLElement;

      if (!(targetElement instanceof HTMLElement)) {
        return;
      }

      const hasExclude = exclude && exclude.some((c) => !!(event.target as HTMLElement).closest(c));

      if (
        refs.reduce((acc, item) => {
          acc = acc || !item.current || item.current.contains(event.target);
          if (hasExclude) {
            acc = false;
          }

          return acc;
        }, false)
      ) {
        return;
      }

      if (safe && safe.some((c) => !!(event.target as HTMLElement).closest(c))) {
        return;
      }

      if (mounted) {
        // eslint-disable-next-line
        handler && handler(event);
      }
    };

    document.addEventListener('mouseup', listener);
    document.addEventListener('touchend', listener);

    return () => {
      mounted = false;

      document.removeEventListener('mouseup', listener);
      document.removeEventListener('touchend', listener);
    };

    // eslint-disable-next-line
  }, [ref, handler]); // ref, handler, exclude, safe
};
