import { useEffect, useRef } from 'react';
import type useQuery from '~/hooks/use-query';
import type { SearchConfig } from '~/lib/get-search-config';
import type useOverlay from './use-overlay';

export type UseQueryInitializerProps = {
  config: SearchConfig;
  overlayState: ReturnType<typeof useOverlay>;
} & ReturnType<typeof useQuery>;

export default function useQueryInitializer({
  config,
  overlayState,
  query,
  onInputChange,
}: UseQueryInitializerProps) {
  const initializeCount = useRef(0);

  useEffect(() => {
    if (initializeCount.current) {
      return;
    }

    const shouldFetchOnMount = config.prefetchOnMount && config.initialSearch;
    const shouldFetchOnOpen = overlayState.isOpen && config.initialSearch;
    const hasQueryData = query.data.length;

    if ((shouldFetchOnMount || shouldFetchOnOpen) && !hasQueryData) {
      onInputChange(config.initialSearch);
      ++initializeCount.current;
    }
  }, [
    overlayState.isOpen,
    config.prefetchOnMount,
    query.data.length,
    config.initialSearch,
    onInputChange,
  ]);
}
