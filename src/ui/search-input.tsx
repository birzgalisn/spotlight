import type { SharedSearchProps } from '~/ui/search';

type SearchInputProps = {
  placeholder?: string;
};

function SearchInput({
  search,
  popper,
  placeholder = 'Search...',
}: SearchInputProps & SharedSearchProps) {
  const handleFocus = () => {
    popper.toggle(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search.setValue(e.target.value);
    search.fetchResults({
      search: e.target.value,
      searchTypes: search.query.searchTypes,
    });
  };

  return (
    <div className="relative bg-white">
      <input
        value={search.value}
        onFocus={handleFocus}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded border border-gray-300 p-2 pr-10"
      />
      {search.query.isLoading && (
        <div className="absolute top-1/2 right-1 size-4 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-t-transparent" />
      )}
    </div>
  );
}

export default SearchInput as React.FC<SearchInputProps>;
