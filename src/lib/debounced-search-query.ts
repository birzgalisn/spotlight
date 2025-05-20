import type { SearchType } from '~/types';
import DebouncedQuery from '~/lib/debounced-query';
import getMockSearchResults from '~/lib/get-mock-search-results';

export type DebouncedSearchQueryParams = {
  search: string;
  searchTypes: Set<SearchType>;
};

export type DebouncedSearchQueryResult = Awaited<
  ReturnType<typeof getMockSearchResults>
>;

export default class DebouncedSearchQuery extends DebouncedQuery<
  DebouncedSearchQueryParams,
  DebouncedSearchQueryResult
> {
  protected isQueryable(params: DebouncedSearchQueryParams) {
    const hasSearch = Boolean(params.search.trim());
    const hasSearchTypes = Boolean(params.searchTypes.size);

    return hasSearch && hasSearchTypes;
  }

  protected getCacheKey(params: DebouncedSearchQueryParams) {
    return `${params.search}:${[...params.searchTypes].sort()}`;
  }

  protected async fetchResults(params: DebouncedSearchQueryParams) {
    return await getMockSearchResults(params);
  }
}
