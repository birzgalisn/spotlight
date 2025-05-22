import { useCallback } from 'react';
import type { SearchConfig } from '~/lib/get-search-config';
import type { DebouncedSearchQueryParams } from '~/lib/debounced-search-query';
import useDebouncedSearchQuery from '~/hooks/use-debounced-search-query';
import useDebouncedSearchQueryReducer from '~/hooks/use-debounced-search-query-reducer';

type SearchQueryProps = {
  config: SearchConfig;
};

export default function useSearchQuery({
  config,
}: SearchQueryProps): [
  result: typeof state,
  onInputChange: typeof onInputChange,
] {
  const [state, update] = useDebouncedSearchQueryReducer({ config });

  const debouncedSearchQuery = useDebouncedSearchQuery({ config });

  const onInputChange = useCallback(
    (params: DebouncedSearchQueryParams) => {
      void debouncedSearchQuery.query(params, {
        onInvalidQuery() {
          update(params);
        },
        onQueryPending() {
          update({ ...params, isLoading: true });
        },
        onQueryStart() {
          update({ ...params, isLoading: true });
        },
        onCacheHit(data) {
          update({ ...params, data });
        },
        onQueryComplete(data) {
          update({ ...params, data });
        },
        onQueryError(error) {
          update({ ...params, isError: true });
          console.error(error);
        },
      });
    },
    [debouncedSearchQuery, update],
  );

  return [state, onInputChange] as const;
}
