import Search from '~/ui/search';

export default function App() {
  return (
    <div className="flex h-svh w-full items-center justify-center gap-8 p-5">
      <div className="flex flex-col gap-4">
        <p>Default</p>
        <Search>
          <Search.Input />
          <Search.Filters />
          <Search.Results
            renderItem={(item) => (
              <div className="border-b border-gray-300 py-2">{item}</div>
            )}
          />
        </Search>
      </div>

      <div className="flex flex-col gap-4">
        <p>With prefilled values</p>
        <Search config={{ initialInput: 'a', initialSearch: 'a' }}>
          <Search.Input />
          <Search.Filters />
          <Search.Results
            renderItem={(item) => (
              <div className="border-b border-gray-300 py-2">{item}</div>
            )}
          />
        </Search>
      </div>

      <div className="flex flex-col gap-4">
        <p>With prefilled values & auto prefetch</p>
        <Search
          config={{
            prefetchOnMount: true,
            initialInput: 'a',
            initialSearch: 'a',
          }}
        >
          <Search.Input />
          <Search.Filters />
          <Search.Results
            renderItem={(item) => (
              <div className="border-b border-gray-300 py-2">{item}</div>
            )}
          />
        </Search>
      </div>
    </div>
  );
}
