import { useMemo } from 'react';
import type { SearchConfig } from '~/lib/get-search-config';
import getSearchConfig from '~/lib/get-search-config';

type UseSearchConfig = {
  configPartial?: Partial<SearchConfig>;
};

export default function useSearchConfig({ configPartial }: UseSearchConfig) {
  return useMemo(
    () => ({ ...getSearchConfig(), ...configPartial }),
    [configPartial],
  );
}
