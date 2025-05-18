import { useCallback, useEffect, useRef, useState } from 'react';
import type useSelectedType from '~/hooks/use-selected-type';
import callAll from '~/lib/call-all';
import getMockResults from '~/lib/get-mock-results';
import LastRecentlyUsedCache from '~/lib/last-recently-used-cache';
import useDebouncedState from '~/hooks/use-debounced-state';

type UseQueryProps = {
  typeSelector: ReturnType<typeof useSelectedType>;
};

export default function useQuery({
  typeSelector: { selectedTypes },
}: UseQueryProps) {
  const [search, setSearch] = useDebouncedState<string>();
  const [state, setState] = useState<{ isLoading: boolean; data: string[] }>({
    isLoading: false,
    data: [],
  });

  const cacheRef = useRef(new LastRecentlyUsedCache<typeof state.data>());
  const requestIdRef = useRef(0);

  const handleToggleLoading = useCallback((input: string) => {
    setState((prev) => ({ ...prev, isLoading: Boolean(input) }));
  }, []);

  const onInputChange = useCallback(
    (input: string) => {
      callAll(handleToggleLoading, setSearch)(input);
    },
    [handleToggleLoading, setSearch],
  );

  useEffect(() => {
    if (!search?.trim() || !selectedTypes.size) {
      setState({ isLoading: false, data: [] });
      return;
    }

    const cacheKey = `${search}:${[...selectedTypes].sort().join(',')}`;

    const cachedResults = cacheRef.current.get(cacheKey);
    if (cachedResults) {
      setState({ isLoading: false, data: cachedResults.value });
      return;
    }

    const currentRequestId = ++requestIdRef.current;

    (async function fetchResults() {
      setState((prev) => ({ ...prev, isLoading: true }));

      const data = await getMockResults({ search, selectedTypes });

      cacheRef.current.set(cacheKey, data);

      if (currentRequestId === requestIdRef.current) {
        setState({ isLoading: false, data });
      }
    })();
  }, [search, selectedTypes]);

  return { query: { ...state, search }, onInputChange } as const;
}
