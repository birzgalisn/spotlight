import { useCallback, useReducer } from 'react';
import type { SearchConfig } from '~/lib/get-search-config';
import type { DebouncedSearchQueryParams } from '~/lib/debounced-search-query';
import useDebouncedSearchQuery from '~/hooks/use-debounced-search-query';

type UseDebouncedSearchQueryReducerState = {
  isLoading: boolean;
  isError: boolean;
  data: string[];
} & DebouncedSearchQueryParams;

const INITIAL_STATE = {
  isLoading: false,
  isError: false,
  data: [],
} as const satisfies Pick<
  UseDebouncedSearchQueryReducerState,
  'isLoading' | 'isError' | 'data'
>;

type SearchQueryProps = {
  config: SearchConfig;
};

export default function useSearchQuery({
  config,
}: SearchQueryProps): [
  result: typeof state,
  onInputChange: typeof onInputChange,
] {
  const [state, update] = useReducer(
    (
      state: UseDebouncedSearchQueryReducerState,
      action: Partial<UseDebouncedSearchQueryReducerState>,
    ) => ({
      ...state,
      ...INITIAL_STATE,
      ...action,
    }),
    {
      ...INITIAL_STATE,
      search: config.initialSearch,
      searchTypes: config.initialSearchTypes,
    },
  );

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
    [debouncedSearchQuery],
  );

  return [state, onInputChange] as const;
}
