import { useMemo } from 'react';
import type { SearchConfig } from '~/lib/get-search-config';
import getSearchConfig from '~/lib/get-search-config';

type UseConfig = {
  configPartial?: Partial<SearchConfig>;
};

export default function useConfig({ configPartial }: UseConfig) {
  return useMemo(
    () => ({ ...getSearchConfig(), ...configPartial }),
    [configPartial],
  );
}
