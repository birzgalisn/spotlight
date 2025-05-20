import { useState } from 'react';
import type { SearchConfig } from '~/lib/get-search-config';
import useSearchQuery from '~/hooks/use-search-query';

export type UseSearchProps = { config: SearchConfig };

export default function useSearch({ config }: UseSearchProps) {
  const [query, fetchResults] = useSearchQuery({ config });

  const [value, setValue] = useState(() => {
    if (config.prefetchOnMount && config.initialSearch) {
      fetchResults({
        search: config.initialSearch,
        searchTypes: config.initialSearchTypes,
      });
    }
    return config.initialInput;
  });

  const onPopperOpen = () => {
    fetchResults({ search: query.search, searchTypes: query.searchTypes });
  };

  return { value, setValue, query, fetchResults, onPopperOpen } as const;
}
