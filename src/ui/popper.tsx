import usePopperPosition, {
  type UsePopperPositionProps,
} from '~/hooks/use-popper-position';

export type PopperProps<T extends HTMLElement> =
  {} & UsePopperPositionProps<T> &
    Pick<React.HTMLProps<HTMLDivElement>, 'className' | 'children'>;

export default function Popper<T extends HTMLElement>({
  className,
  children,
  ...popperPositionProps
}: PopperProps<T>) {
  const attributes = usePopperPosition(popperPositionProps);

  return (
    <div {...attributes} className={className}>
      {children}
    </div>
  );
}
