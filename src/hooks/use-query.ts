import { useCallback, useRef, useState } from 'react';
import type { SearchType } from '~/types';
import type { SearchConfig } from '~/lib/get-search-config';
import LastRecentlyUsedCache from '~/lib/last-recently-used-cache';
import getMockSearchResults from '~/lib/get-mock-search-results';
import useDebouncedCallback from '~/hooks/use-debounced-callback';

type UseQueryProps = { config: SearchConfig };

export default function useQuery({ config }: UseQueryProps) {
  const [state, setState] = useState<{
    isLoading: boolean;
    search: string;
    searchTypes: Set<SearchType>;
    data: string[];
  }>({
    isLoading: false,
    search: config.initialSearch,
    searchTypes: config.initialSearchTypes,
    data: [],
  });

  const cacheRef = useRef(new LastRecentlyUsedCache<typeof state.data>());
  const cacheKeyRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  const debounced = useDebouncedCallback(config.searchDelay);

  const onInputChange = useCallback(
    ({
      search,
      searchTypes,
    }: {
      search: string;
      searchTypes: Set<SearchType>;
    }) => {
      const isQueryable = Boolean(search.trim()) && Boolean(searchTypes.size);
      if (!isQueryable) {
        setState({ isLoading: false, search, searchTypes, data: [] });
        cacheKeyRef.current = null;
        return;
      }

      const cacheKey = `${search}:${[...searchTypes].sort()}`;
      cacheKeyRef.current = cacheKey;

      const cachedResult = cacheRef.current.get(cacheKey);
      if (cachedResult) {
        setState({
          isLoading: false,
          search,
          searchTypes,
          data: cachedResult.value,
        });
        return;
      }

      setState({ isLoading: true, search, searchTypes, data: [] });
      const requestId = ++requestIdRef.current;

      debounced(async function fetchResults() {
        const data = await getMockSearchResults({ search, searchTypes });

        cacheRef.current.set(cacheKey, data);

        if (
          cacheKey === cacheKeyRef.current &&
          requestId === requestIdRef.current
        ) {
          setState((prev) => ({ ...prev, isLoading: false, data }));
        }
      });
    },
    [debounced],
  );

  return [state, onInputChange] as const;
}
