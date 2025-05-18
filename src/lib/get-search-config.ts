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
  return {
    prefetchOnMount: false,
    initialInput: '',
    initialSearch: '',
    initialSearchTypes: new Set([[...DEFAULT_SEARCH_TYPES].shift() ?? 'Users']),
    enabledSearchTypes: DEFAULT_SEARCH_TYPES,
    searchDelay: 500,
  } as const satisfies SearchConfig;
}
