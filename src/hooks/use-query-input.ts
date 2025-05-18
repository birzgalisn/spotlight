import { useCallback, useState } from 'react';
import type { SearchConfig } from '~/lib/get-search-config';
import type useSelectedType from '~/hooks/use-selected-type';
import type useOverlay from '~/hooks/use-overlay';
import callAll from '~/lib/call-all';
import useQuery from '~/hooks/use-query';
import useQueryInitializer from '~/hooks/use-query-initializer';

export type UseQueryInputProps = {
  config: SearchConfig;
  overlayState: ReturnType<typeof useOverlay>;
  typeSelector: ReturnType<typeof useSelectedType>;
};

export default function useQueryInput({
  config,
  overlayState,
  typeSelector,
}: UseQueryInputProps) {
  const [input, setInput] = useState(config.initialInput);
  const { query, onInputChange } = useQuery({ typeSelector });

  const onChange = useCallback(
    (value: string) => {
      callAll(setInput, onInputChange)(value);
    },
    [onInputChange],
  );

  useQueryInitializer({ config, overlayState, query, onInputChange });

  return { input, setInput, query, onChange } as const;
}
