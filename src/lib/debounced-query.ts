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
  private requestId = 0;

  public constructor({
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

    const cached = this.cache.get(cacheKey);
    if (cached) {
      callbacks.onCacheHit?.(cached);
      return;
    }

    const requestId = ++this.requestId;
    callbacks.onQueryStart?.();

    this.debouncer.debounce(async () => {
      try {
        const result = await this.fetchResults(params);

        this.cache.set(cacheKey, result);

        if (cacheKey === this.cacheKey && requestId === this.requestId) {
          callbacks.onQueryComplete?.(result);
        }
      } catch (error) {
        if (cacheKey === this.cacheKey && requestId === this.requestId) {
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
