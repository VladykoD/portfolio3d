import { useEffect, useState } from 'react';

export default function useIsSafari() {
  const [safari, setSafari] = useState(false);

  useEffect(() => {
    setSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));

    return () => {};
  }, []);

  return safari;
}
