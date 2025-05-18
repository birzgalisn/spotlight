import { useCallback, useRef, useState } from 'react';

export default function useDebouncedState<T>(
  initialValue?: T,
  { delay = 300 }: Partial<{ delay: number }> = {},
): [debouncedValue: T | undefined, setValue: (value: T) => void] {
  const [value, setValue] = useState(() => initialValue);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSetValue = useCallback(
    (value: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setValue(value);
      }, delay);
    },
    [delay],
  );

  return [value, debouncedSetValue] as const;
}
