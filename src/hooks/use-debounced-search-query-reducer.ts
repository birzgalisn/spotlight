import { useReducer } from 'react';
import type { DebouncedSearchQueryParams } from '~/lib/debounced-search-query';
import type { SearchConfig } from '~/lib/get-search-config';

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

type UseDebouncedSearchQueryReducerProps = {
  config: SearchConfig;
};

export default function useDebouncedSearchQueryReducer({
  config,
}: UseDebouncedSearchQueryReducerProps) {
  return useReducer(
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
}
