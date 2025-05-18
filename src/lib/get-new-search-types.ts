import type { SearchType } from '~/types';

type GetNewSeatchTypes = {
  searchType: SearchType;
  searchTypes: Set<SearchType>;
};

export default function getNewSearchTypes({
  searchType,
  searchTypes,
}: GetNewSeatchTypes) {
  const newSearchTypes = new Set(searchTypes);

  newSearchTypes.clear();
  newSearchTypes.add(searchType);

  return newSearchTypes;
}
