import type { SearchType } from '~/types';
import type { SharedSearchProps } from '~/ui/search';

function SearchFilters({ config, search }: SharedSearchProps) {
  const handleSelectedType = (searchType: SearchType) => () => {
    search.onSearchTypeChange(searchType);
  };

  return (
    <div className="flex gap-2">
      {config.enabledSearchTypes.map((type) => {
        const isActive = search.query.searchTypes.has(type);

        return (
          <button
            key={type}
            onMouseDown={handleSelectedType(type)}
            className={`flex cursor-pointer rounded border border-gray-300 px-2 py-0.5 ${isActive ? 'bg-blue-500 text-white' : ''}`}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}

export default SearchFilters as React.FC;
