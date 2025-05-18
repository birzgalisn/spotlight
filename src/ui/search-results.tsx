import { useId } from 'react';
import type { SharedSearchProps } from '~/ui/search';

type SearchResultsProps = {
  renderItem: (item: string, index: number) => React.ReactNode;
};

function SearchResults({
  search,
  popper,
  renderItem,
}: SharedSearchProps & SearchResultsProps) {
  const id = useId();

  const onItemClick = (title: string) => () => {
    search.onResultSelect(title);
    popper.toggle(false);
  };

  if (!search.value && !search.query.isLoading) {
    return <span>Start typing to search</span>;
  }

  if (search.query.isLoading) {
    return <span>Loading results...</span>;
  }

  if (!search.query.data.length) {
    return <span>No results found</span>;
  }

  return (
    <div className="flex max-h-52 flex-col overflow-auto">
      {search.query.data.map((item, index) => (
        <div
          key={`${id}-${index}`}
          onClick={onItemClick(item)}
          className="cursor-pointer"
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

export default SearchResults as React.FC<SearchResultsProps>;
