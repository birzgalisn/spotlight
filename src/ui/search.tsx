import { Children, cloneElement, isValidElement, useRef } from 'react';
import type { SearchConfig } from '~/lib/get-search-config';
import useConfig from '~/hooks/use-config';
import usePopperState from '~/hooks/use-popper-state';
import useSearch from '~/hooks/use-search';
import SearchInput from '~/ui/search-input';
import SearchPopper from '~/ui/search-popper';
import SearchFilters from '~/ui/search-filters';
import SearchResults from '~/ui/search-results';

export type SharedSearchProps = {
  ref: React.RefObject<HTMLDivElement | null>;
  config: SearchConfig;
  search: ReturnType<typeof useSearch>;
  popper: ReturnType<typeof usePopperState>;
};

export type SearchProps = {
  config?: Partial<SearchConfig>;
  onSelect?: (selected: string) => void;
} & React.PropsWithChildren;

function SearchContainer({
  config: configPartial,
  onSelect,
  children,
}: SearchProps) {
  const ref = useRef<HTMLDivElement>(null);

  const config = useConfig({ configPartial });

  const search = useSearch({ config, onSelect });

  const popper = usePopperState({ ref, onOpen: search.onPopperOpen });

  const props = {
    ref,
    config,
    search,
    popper,
  } as const satisfies SharedSearchProps;

  return (
    <div
      ref={ref}
      className="flex w-96 flex-col gap-2 rounded border border-gray-300 bg-white p-3"
    >
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child, { ...(child.props || {}), ...props })
          : child,
      )}
    </div>
  );
}

const Search = Object.assign(SearchContainer, {
  Input: SearchInput,
  Popper: SearchPopper,
  Filters: SearchFilters,
  Results: SearchResults,
});

export default Search;
