import type { SearchType } from '~/types';
import type { SearchSharedProps } from '~/ui/search';

function SearchFilters({ injected }: SearchSharedProps) {
  const [selectedType] = injected.typeSelector.selectedTypes;

  const handleSelectedType = (type: SearchType) => () => {
    injected.queryInput.setInput(injected.queryInput.query.search ?? '');
    injected.typeSelector.handleSelectedTypesChange(type);
  };

  if (!injected.overlayState.isOpen) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {injected.typeSelector.enabledSearchTypes.map((type) => (
        <button
          key={type}
          onMouseDown={handleSelectedType(type)}
          className={`flex cursor-pointer rounded border border-gray-300 px-2 py-0.5 ${type === selectedType ? 'bg-blue-500 text-white' : ''}`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

export default SearchFilters as React.FC;
