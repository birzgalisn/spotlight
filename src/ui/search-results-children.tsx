import { memo } from 'react';

export type SearchResultsChildrenProps = {
  item: string;
  onItemClick: (
    title: string,
  ) => (event: React.MouseEvent<HTMLElement>) => void;
};

const SearchResultsChildren = memo(
  function SearchResultsChildren({
    item,
    onItemClick,
  }: SearchResultsChildrenProps) {
    return (
      <div onClick={onItemClick(item)} className="cursor-pointer py-2">
        {item}
      </div>
    );
  },
  (prev, next) => prev.item === next.item,
);

export default SearchResultsChildren;
