import { useState, useCallback } from 'react';
import type { SearchConfig } from '~/lib/get-search-config';
import type { DebouncedSearchQueryParams } from '~/lib/debounced-search-query';
import useDebouncedSearchQuery from '~/hooks/use-debounced-search-query';

type SearchQueryProps = {
  config: SearchConfig;
};

export default function useSearchQuery({
  config,
}: SearchQueryProps): [
  result: typeof state,
  onInputChange: typeof onInputChange,
] {
  const [state, setState] = useState<
    DebouncedSearchQueryParams & { isLoading: boolean; data: string[] }
  >({
    search: config.initialSearch,
    searchTypes: config.initialSearchTypes,
    isLoading: false,
    data: [],
  });

  const debouncedSearchQuery = useDebouncedSearchQuery(config);

  const onInputChange = useCallback(
    (params: DebouncedSearchQueryParams) => {
      void debouncedSearchQuery.query(params, {
        onInvalidQuery() {
          setState({ ...params, isLoading: false, data: [] });
        },
        onQueryPending() {
          setState((prev) => ({ ...prev, ...params, isLoading: true }));
        },
        onQueryStart() {
          setState({ ...params, isLoading: true, data: [] });
        },
        onCacheHit(data) {
          setState({ ...params, isLoading: false, data });
        },
        onQueryComplete(data) {
          setState((prev) => ({ ...prev, isLoading: false, data }));
        },
        onQueryError: console.error,
      });
    },
    [debouncedSearchQuery],
  );

  return [state, onInputChange] as const;
}
