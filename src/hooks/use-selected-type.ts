import { useCallback, useState } from 'react';
import type { SearchConfig } from '~/lib/get-search-config';
import type { SearchType } from '~/types';

export type UseSelectedTypeProps = {
  config: SearchConfig;
};

export default function useSelectedType({
  config: { initialSearchType, enabledSearchTypes },
}: UseSelectedTypeProps) {
  const [selectedTypes, setSelectedTypes] = useState<Readonly<Set<SearchType>>>(
    () => new Set([initialSearchType]),
  );

  const handleSelectedTypesChange = useCallback((type: SearchType) => {
    setSelectedTypes(() => new Set([type]));
  }, []);

  return {
    enabledSearchTypes,
    selectedTypes,
    handleSelectedTypesChange,
  } as const;
}
