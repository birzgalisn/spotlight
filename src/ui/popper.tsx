import usePopperPosition, {
  type UsePopperPositionProps,
} from '~/hooks/use-popper-position';

export type PopperProps<T extends HTMLElement> = {
  isVisible: boolean;
  className?: React.HTMLProps<HTMLDivElement>['className'];
} & UsePopperPositionProps<T> &
  React.PropsWithChildren;

export default function Popper<T extends HTMLElement>({
  isVisible,
  className,
  children,
  ...popperPositionProps
}: PopperProps<T>) {
  const attributes = usePopperPosition(popperPositionProps);

  if (!isVisible) {
    return null;
  }

  return (
    <div {...attributes} className={className}>
      {children}
    </div>
  );
}
