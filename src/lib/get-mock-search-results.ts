import type { SearchType } from '~/types';
import MOCK_SEARCH_RESULTS from '~/constants/mock-search-results';

type GetMockResultsProps = {
  search: string;
  searchTypes: Set<SearchType>;
};

export default async function getMockSearchResults({
  search,
  searchTypes,
}: GetMockResultsProps) {
  console.log(`fetch: '${search}:${[...searchTypes].sort()}'`);

  const delay = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const [selected] = [...searchTypes];
  const data = MOCK_SEARCH_RESULTS[selected].filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()),
  );

  return data.slice(0, 5);
}
