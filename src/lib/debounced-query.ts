import LastRecentlyUsedCache from '~/lib/last-recently-used-cache';
import DebounceManager from '~/lib/debounce-manager';

export type DebouncedQueryParams = {
  sizeLimit: number;
  ttl: number;
  delay: number;
};

export default abstract class DebouncedQuery<Params, Result> {
  private readonly inflight = new Map<string, Promise<Result>>();
  private readonly cache: LastRecentlyUsedCache<Result>;
  private readonly debouncer: DebounceManager;
  private currentKey: string | null = null;

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
    if (!this.isQueryable(params)) {
      this.currentKey = null;
      callbacks.onInvalidQuery?.();
      return;
    }

    const key = this.getCacheKey(params);
    this.currentKey = key;

    const cached = this.cache.get(key);
    if (cached) {
      callbacks.onCacheHit?.(cached);
      return;
    }

    const ongoing = this.inflight.get(key);
    if (ongoing) {
      callbacks.onQueryPending?.();
      return;
    }

    callbacks.onQueryStart?.();

    this.debouncer.debounce(async () => {
      if (key !== this.currentKey) {
        return;
      }

      const promise = this.fetchResults(params);
      this.inflight.set(key, promise);

      try {
        const result = await promise;
        this.cache.set(key, result);

        if (key === this.currentKey) {
          callbacks.onQueryComplete?.(result);
        }
      } catch (error) {
        this.cache.delete(key);

        if (key === this.currentKey) {
          callbacks.onQueryError?.(error);
        }
      } finally {
        this.inflight.delete(key);
      }
    });
  }

  public cleanup() {
    this.inflight.clear();
    this.debouncer.clear();
    this.cache.clear();
    this.currentKey = null;
  }
}
