import Search from '~/ui/search';

export default function App() {
  const onSelect = (selectedResult: string) => {
    console.log(`selected: '${selectedResult}'`);
  };

  return (
    <div className="flex h-svh w-full items-center justify-center gap-8 p-5">
      <div className="flex flex-col gap-4">
        <p>Default</p>
        <Search>
          <Search.Input />
          <Search.Popper placement="top">
            <Search.Results onSelect={onSelect} />
            <Search.Filters />
          </Search.Popper>
        </Search>
      </div>

      <div className="flex flex-col gap-4">
        <p>With prefilled values</p>
        <Search initialInput="a" initialSearch="a">
          <Search.Input />
          <Search.Popper>
            <Search.Filters />
            <Search.Results onSelect={onSelect} />
          </Search.Popper>
        </Search>
      </div>

      <div className="flex flex-col gap-4">
        <p>With prefilled values & auto prefetch</p>
        <Search
          prefetchOnMount
          initialInput="a"
          initialSearch="a"
          initialSearchTypes={new Set(['Posts'])}
        >
          <Search.Input />
          <Search.Popper>
            <Search.Filters />
            <Search.Results onSelect={onSelect} />
          </Search.Popper>
        </Search>
      </div>
    </div>
  );
}
