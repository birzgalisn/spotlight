import type { SearchType } from '~/types';
import type { SharedSearchProps } from '~/ui/search';
import getNewSearchTypes from '~/lib/get-new-search-types';

function SearchFilters({ config, search }: SharedSearchProps) {
  const handleSelectedType = (searchType: SearchType) => () => {
    search.setValue(search.query.search);
    search.fetchResults({
      search: search.query.search,
      searchTypes: getNewSearchTypes({
        searchType,
        searchTypes: search.query.searchTypes,
      }),
    });
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
