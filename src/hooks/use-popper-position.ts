import { useRef, useState, useLayoutEffect } from 'react';

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export type UsePopperPositionProps<T> = {
  parentRef: React.RefObject<T | null>;
  placement?: Placement;
  width?: React.CSSProperties['width'];
};

export default function usePopperPosition<T extends HTMLElement>({
  parentRef,
  placement = 'bottom',
  width,
}: UsePopperPositionProps<T>) {
  const [style, setStyle] = useState<React.CSSProperties>(() => ({
    position: 'fixed',
    visibility: 'hidden',
  }));

  const popperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const controller = new AbortController();

    const updatePosition = () => {
      const parent = parentRef.current;

      if (!parent) {
        return;
      }

      const parentRect = parent.getBoundingClientRect();
      const positionStyles = getPositionStyles(parentRect)[placement]();

      setStyle({
        position: 'fixed',
        visibility: 'visible',
        width: width ?? parentRect.width,
        ...positionStyles,
      });
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

  return {
    ref: popperRef,
    style,
  } as const satisfies React.HTMLProps<HTMLDivElement>;
}

function getPositionStyles(
  parentRect: DOMRect,
): Record<Placement, () => React.CSSProperties> {
  return {
    top: () => ({
      bottom: window.innerHeight - parentRect.top + window.scrollY,
      left: parentRect.left + window.scrollX,
    }),
    bottom: () => ({
      top: parentRect.bottom + window.scrollY,
      left: parentRect.left + window.scrollX,
    }),
    left: () => ({
      top: parentRect.top + window.scrollY,
      right: window.innerWidth - parentRect.left + window.scrollX,
    }),
    right: () => ({
      top: parentRect.top + window.scrollY,
      left: parentRect.right + window.scrollX,
    }),
  };
}
