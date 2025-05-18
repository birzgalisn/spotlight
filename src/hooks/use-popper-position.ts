import React, { useRef, useState, useLayoutEffect } from 'react';

export type UsePopperPositionProps<T> = {
  parentRef: React.RefObject<T | null>;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  width?: React.CSSProperties['width'];
};

export default function usePopperPosition<T extends HTMLElement>({
  parentRef,
  placement = 'bottom',
  width,
}: UsePopperPositionProps<T>) {
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    visibility: 'hidden',
  });
  const popperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const controller = new AbortController();

    const updatePosition = () => {
      const parent = parentRef.current;
      const popper = popperRef.current;

      if (!parent || !popper) {
        return;
      }

      const parentRect = parent.getBoundingClientRect();
      const popperRect = popper.getBoundingClientRect();

      const styles: React.CSSProperties = {
        width: width ?? parentRect.width,
        position: 'fixed',
        visibility: 'visible',
      };

      switch (placement) {
        case 'top':
          styles.top = parentRect.top - popperRect.height + window.scrollY;
          styles.left = parentRect.left + window.scrollX;
          break;
        case 'bottom':
          styles.top = parentRect.bottom + window.scrollY;
          styles.left = parentRect.left + window.scrollX;
          break;
        case 'left':
          styles.top = parentRect.top + window.scrollY;
          styles.left = parentRect.left - popperRect.width + window.scrollX;
          break;
        case 'right':
          styles.top = parentRect.top + window.scrollY;
          styles.left = parentRect.right + window.scrollX;
          break;
      }

      setStyle(styles);
    };

    if (parentRef.current) {
      updatePosition();

      window.addEventListener('resize', updatePosition, {
        signal: controller.signal,
      });
      window.addEventListener('scroll', updatePosition, {
        signal: controller.signal,
        capture: true,
      });
    }

    return () => {
      controller.abort();
    };
  }, [width, placement, parentRef]);

  const attributes = {
    ref: popperRef,
    style,
  } as const satisfies React.HTMLProps<typeof popperRef.current>;

  return attributes;
}
