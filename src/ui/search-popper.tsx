import { Children, cloneElement, isValidElement } from 'react';
import type { Placement } from '~/hooks/use-popper-position';
import type { SharedSearchProps } from '~/ui/search';
import Popper from '~/ui/popper';

type SearchPopperProps = {
  placement?: Placement;
  width?: React.CSSProperties['width'];
} & React.PropsWithChildren;

function SearchPopper({
  placement,
  width,
  children,
  ...sharedProps
}: SharedSearchProps & SearchPopperProps) {
  if (!sharedProps.popper.isOpen) {
    return null;
  }

  return (
    <Popper
      parentRef={sharedProps.ref}
      placement={placement}
      width={width}
      className="-mt-px flex flex-col gap-4 rounded border border-gray-300 bg-white p-3"
    >
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child, { ...(child.props || {}), ...sharedProps })
          : child,
      )}
    </Popper>
  );
}

export default SearchPopper as React.FC<SearchPopperProps>;
