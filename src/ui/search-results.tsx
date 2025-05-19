import { useId } from 'react';
import type { SharedSearchProps } from '~/ui/search';
import callAll from '~/lib/call-all';
import SearchResultsChildren, {
  type SearchResultsChildrenProps,
} from '~/ui/search-results-children';

type SearchResultsProps = {
  onSelect?: (item: string) => void;
  children?: React.FC<SearchResultsChildrenProps>;
};

function SearchResults({
  search,
  popper,
  onSelect,
  children: Children = SearchResultsChildren,
}: SharedSearchProps & SearchResultsProps) {
  const id = useId();

  const onItemClick = (title: string) => () => {
    callAll(search.setValue, onSelect)(title);
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
    <div className="flex max-h-52 flex-col divide-y divide-gray-300 overflow-auto">
      {search.query.data.map((item, index) => (
        <Children
          key={`${id}-${index}`}
          item={item}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
}

export default SearchResults as React.FC<SearchResultsProps>;
