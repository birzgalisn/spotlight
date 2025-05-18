import { useState } from 'react';
import type { SearchType } from '~/types';
import type { SearchConfig } from '~/lib/get-search-config';
import useQuery from '~/hooks/use-query';
import getNewSearchTypes from '~/lib/get-new-search-types';

export type UseSearchProps = {
  config: SearchConfig;
  onSelect?: (selected: string) => void;
};

export default function useSearch({ config, onSelect }: UseSearchProps) {
  const [query, fetchResults] = useQuery({ config });

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

  const onInputChange = (search: string) => {
    setValue(search);
    fetchResults({ search, searchTypes: query.searchTypes });
  };

  const onSearchTypeChange = (searchType: SearchType) => {
    setValue(query.search);
    fetchResults({
      search: query.search,
      searchTypes: getNewSearchTypes({
        searchType,
        searchTypes: query.searchTypes,
      }),
    });
  };

  const onResultSelect = (result: string) => {
    setValue(result);
    onSelect?.(result);
  };

  return {
    value,
    query,
    onPopperOpen,
    onInputChange,
    onSearchTypeChange,
    onResultSelect,
  } as const;
}
