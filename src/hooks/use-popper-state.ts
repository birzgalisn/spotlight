import { useEffect, useState } from 'react';

type UsePopperStateProps<T> = {
  ref: React.RefObject<T | null>;
  isInitiallyOpen?: boolean;
  eventType?: 'mousedown' | 'click' | 'touchstart';
  onOpen?: () => void;
};

export default function usePopperState<T extends HTMLElement>({
  ref,
  isInitiallyOpen = false,
  eventType = 'mousedown',
  onOpen,
}: UsePopperStateProps<T>) {
  const [isOpen, setPopperOpen] = useState(isInitiallyOpen);

  const toggle = (isOpen?: boolean) => {
    setPopperOpen((prev) => {
      const willBeOpen = isOpen ?? !prev;

      if (willBeOpen) {
        onOpen?.();
      }

      return willBeOpen;
    });
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const controller = new AbortController();

    document.addEventListener(
      eventType,
      function handleClickOutside(e: MouseEvent | TouchEvent) {
        if (!ref.current?.contains(e.target as Node)) {
          setPopperOpen(false);
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, [isOpen, eventType, ref]);

  return { isOpen, toggle } as const;
}
