import React, { useCallback, useEffect, useState } from 'react';
import callAll from '~/lib/call-all';

type UseOverlayProps<T> = {
  ref: React.RefObject<T | null>;
  isInitiallyOpen?: boolean;
  eventType?: 'mousedown' | 'click' | 'touchstart';
  onClose?: () => void;
};

export default function useOverlay<T extends HTMLElement>({
  ref,
  isInitiallyOpen = false,
  eventType = 'mousedown',
  onClose,
}: UseOverlayProps<T>) {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const toggleOpen = useCallback((isOpen?: boolean) => {
    setIsOpen((prev) => isOpen ?? !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const controller = new AbortController();

    document.addEventListener(
      eventType,
      function handleClickOutside(e: MouseEvent | TouchEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          callAll(setIsOpen, onClose)(false);
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, [isOpen, eventType, ref, onClose]);

  return { isOpen, toggleOpen } as const;
}
