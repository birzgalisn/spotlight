import type { SearchType } from '~/types';
import DEFAULT_SEARCH_TYPES from '~/constants/default-search-types';

export type SearchConfig = {
  prefetchOnMount: boolean;
  initialInput: string;
  initialSearch: string;
  initialSearchType: SearchType;
  enabledSearchTypes: SearchType[];
};

export default function getSearchConfig() {
  return {
    prefetchOnMount: false,
    initialInput: '',
    initialSearch: '',
    initialSearchType: [...DEFAULT_SEARCH_TYPES].shift() ?? 'Users',
    enabledSearchTypes: DEFAULT_SEARCH_TYPES,
  } as const satisfies SearchConfig;
}
