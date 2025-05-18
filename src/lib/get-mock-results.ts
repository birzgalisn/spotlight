import type useSelectedType from '~/hooks/use-selected-type';
import MOCK_QUERY_RESULTS from '~/constants/mock-query-results';

type GetMockResultsProps = {
  search: string;
  selectedTypes: ReturnType<typeof useSelectedType>['selectedTypes'];
};

export default async function getMockResults({
  search,
  selectedTypes,
}: GetMockResultsProps) {
  const delay = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const [selectedType] = [...selectedTypes];
  const data = MOCK_QUERY_RESULTS[selectedType].filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()),
  );

  return data;
}
