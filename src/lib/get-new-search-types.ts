import type { SearchType } from '~/types';

type GetNewSeatchTypesProps = {
  searchType: SearchType;
  searchTypes: Set<SearchType>;
};

export default function getNewSearchTypes({
  searchType,
  searchTypes,
}: GetNewSeatchTypesProps) {
  const newSearchTypes = new Set(searchTypes);

  newSearchTypes.clear();
  newSearchTypes.add(searchType);

  return newSearchTypes;
}
