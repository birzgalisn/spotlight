import { useEffect, useRef, useState } from 'react';

export default function useDebouncedValue<T>(
  value: T,
  { delay = 300 }: Partial<{ delay: number }> = {},
): T | undefined {
  const [debouncedValue, setDebouncedValue] = useState<T | undefined>();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
