import type { SearchType } from '~/types';
import DEFAULT_SEARCH_TYPES from '~/constants/default-search-types';

export type SearchConfig = {
  prefetchOnMount: boolean;
  initialInput: string;
  initialSearch: string;
  searchDelay: number;
  initialSearchTypes: Set<SearchType>;
  enabledSearchTypes: SearchType[];
};

export default function getSearchConfig() {
  const [initialSearchType] = DEFAULT_SEARCH_TYPES;

  return {
    prefetchOnMount: false,
    initialInput: '',
    initialSearch: '',
    initialSearchTypes: new Set([initialSearchType]),
    enabledSearchTypes: DEFAULT_SEARCH_TYPES,
    searchDelay: 1000,
  } as const satisfies SearchConfig;
}
