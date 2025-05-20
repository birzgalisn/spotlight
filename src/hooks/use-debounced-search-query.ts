import { useRef, useEffect } from 'react';
import type { SearchConfig } from '~/lib/get-search-config';
import DebouncedSearchQuery from '~/lib/debounced-search-query';

export default function useDebouncedSearchQuery(config: SearchConfig) {
  const queryRef = useRef(
    new DebouncedSearchQuery({ delay: config.searchDelay }),
  );

  useEffect(
    () => () => {
      queryRef.current.cleanup();
    },
    [],
  );

  return queryRef.current;
}
