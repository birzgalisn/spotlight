import LastRecentlyUsedCache from '~/lib/last-recently-used-cache';
import DebounceManager from '~/lib/debounce-manager';

export type DebouncedQueryParams = {
  sizeLimit: number;
  ttl: number;
  delay: number;
};

export default abstract class DebouncedQuery<Params, Result> {
  private readonly cache: LastRecentlyUsedCache<Result>;
  private readonly debouncer: DebounceManager;
  private cacheKey: string | null = null;

  constructor({
    sizeLimit = 10,
    ttl = 60 * 1000,
    delay = 300,
  }: Partial<DebouncedQueryParams> = {}) {
    this.cache = new LastRecentlyUsedCache<Result>({ sizeLimit, ttl });
    this.debouncer = new DebounceManager(delay);
  }

  protected abstract isQueryable(params: Params): boolean;

  protected abstract getCacheKey(params: Params): string;

  protected abstract fetchResults(params: Params): Promise<Result>;

  public query(
    params: Params,
    callbacks: {
      onInvalidQuery?: () => void;
      onCacheHit?: (result: Result) => void;
      onQueryPending?: () => void;
      onQueryStart?: () => void;
      onQueryComplete?: (result: Result) => void;
      onQueryError?: (error: unknown) => void;
    } = {},
  ) {
    this.debouncer.clear();

    if (!this.isQueryable(params)) {
      this.cacheKey = null;
      callbacks.onInvalidQuery?.();
      return;
    }

    const cacheKey = this.getCacheKey(params);

    this.cacheKey = cacheKey;

    const entry = this.cache.get(cacheKey);

    if (entry?.status === 'ready') {
      callbacks.onCacheHit?.(entry.value);
      return;
    }

    if (entry?.status === 'pending') {
      callbacks.onQueryPending?.();
      return;
    }

    this.cache.markPending(cacheKey);
    callbacks.onQueryStart?.();

    this.debouncer.debounce(async () => {
      try {
        const result = await this.fetchResults(params);

        this.cache.set(cacheKey, result);

        if (cacheKey === this.cacheKey) {
          callbacks.onQueryComplete?.(result);
        }
      } catch (error) {
        this.cache.clearKey(cacheKey);

        if (cacheKey === this.cacheKey) {
          callbacks.onQueryError?.(error);
        }
      }
    });
  }

  public cleanup() {
    this.debouncer.clear();
    this.cache.clear();
    this.cacheKey = null;
  }
}
