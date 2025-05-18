import type { SearchSharedProps } from '~/ui/search';

type SearchResultsProps = {
  renderItem: (item: string, index: number) => React.ReactNode;
};

function SearchResults({
  injected,
  renderItem,
}: SearchSharedProps & SearchResultsProps) {
  const onItemClick = (title: string) => () => {
    injected.queryInput.setInput(title);
    injected.overlayState.toggleOpen(false);
  };

  if (!injected.overlayState.isOpen) {
    return null;
  }

  if (!injected.queryInput.input && !injected.queryInput.query.isLoading) {
    return <span>Start typing to search</span>;
  }

  if (injected.queryInput.query.isLoading) {
    return <span>Loading results...</span>;
  }

  if (!injected.queryInput.query.data.length) {
    return <span>No results found</span>;
  }

  return (
    <div className="flex max-h-48 flex-col overflow-auto">
      {injected.queryInput.query.data.map((item, index) => (
        <div key={index} onClick={onItemClick(item)} className="cursor-pointer">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

export default SearchResults as React.FC<SearchResultsProps>;
