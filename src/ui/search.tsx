import { Children, cloneElement, isValidElement, useRef } from 'react';
import type { SearchConfig } from '~/lib/get-search-config';
import useSearchConfig from '~/hooks/use-search-config';
import useOverlay from '~/hooks/use-overlay';
import useQueryInput from '~/hooks/use-query-input';
import useSelectedType from '~/hooks/use-selected-type';
import SearchInput from '~/ui/search-input';
import SearchFilters from '~/ui/search-filters';
import SearchResults from '~/ui/search-results';

export type SearchSharedProps = {
  injected: {
    overlayState: ReturnType<typeof useOverlay>;
    typeSelector: ReturnType<typeof useSelectedType>;
    queryInput: ReturnType<typeof useQueryInput>;
  };
};

export type Search = {
  config?: Partial<SearchConfig>;
} & React.PropsWithChildren;

function SearchContainer({ config: configPartial, children }: Search) {
  const ref = useRef<HTMLDivElement>(null);

  const config = useSearchConfig({ configPartial });

  const overlayState = useOverlay({ ref });

  const typeSelector = useSelectedType({ config });

  const queryInput = useQueryInput({ config, overlayState, typeSelector });

  const props = {
    injected: { overlayState, typeSelector, queryInput },
  } satisfies SearchSharedProps;

  return (
    <div
      ref={ref}
      className="flex w-96 flex-col gap-2 rounded-md border border-gray-300 p-3"
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
  Filters: SearchFilters,
  Results: SearchResults,
});

export default Search;
