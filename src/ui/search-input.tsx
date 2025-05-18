import type { SearchSharedProps } from '~/ui/search';

function SearchInput({ injected }: SearchSharedProps) {
  const handleFocus = () => {
    injected.overlayState.toggleOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    injected.queryInput.onChange(e.target.value);
  };

  return (
    <div className="relative">
      <input
        value={injected.queryInput.input}
        onFocus={handleFocus}
        onChange={handleChange}
        placeholder="Search..."
        className="w-full rounded border border-gray-300 p-2 pr-10"
      />
      {injected.queryInput.query.isLoading && (
        <div className="absolute top-1/2 right-1 size-4 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-t-transparent" />
      )}
    </div>
  );
}

export default SearchInput as React.FC;
