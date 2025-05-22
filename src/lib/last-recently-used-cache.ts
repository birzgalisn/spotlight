type CacheEntry<T> =
  | { status: 'ready'; value: T; timeout: NodeJS.Timeout }
  | { status: 'pending' };

export default class LastRecentlyUsedCache<T> {
  private readonly cache = new Map<string, CacheEntry<T>>();
  private readonly sizeLimit: number;
  private readonly ttl: number;

  public constructor({
    sizeLimit = 10,
    ttl = 60 * 1000,
  }: Partial<{ sizeLimit: number; ttl: number }> = {}) {
    this.sizeLimit = sizeLimit;
    this.ttl = ttl;
  }

  public get(key: string) {
    const entry = this.cache.get(key);

    if (!entry || entry.status === 'pending') {
      return entry;
    }

    this.cache.delete(key);
    this.cache.set(key, entry);

    entry.timeout = this.scheduleCleanup(key, entry.timeout);

    return entry;
  }

  public set(key: string, value: T) {
    if (!this.cache.has(key) && this.cache.size >= this.sizeLimit) {
      const oldestEntry = this.cache.entries().next().value;

      if (oldestEntry) {
        const [key, entry] = oldestEntry;

        if (entry.status === 'ready') {
          clearTimeout(entry.timeout);
        }

        this.cache.delete(key);
      }
    }

    this.cache.set(key, {
      status: 'ready',
      value,
      timeout: this.scheduleCleanup(key),
    });
  }

  public markPending(key: string) {
    this.cache.set(key, { status: 'pending' });
  }

  public isPending(key: string) {
    return this.cache.get(key)?.status === 'pending';
  }

  public clearKey(key: string) {
    const entry = this.cache.get(key);

    if (entry?.status === 'ready') {
      clearTimeout(entry.timeout);
    }

    this.cache.delete(key);
  }

  public clear() {
    for (const cacheEntry of this.cache.values()) {
      if (cacheEntry.status === 'ready') {
        clearTimeout(cacheEntry.timeout);
      }
    }
    this.cache.clear();
  }

  private scheduleCleanup(key: string, timeout?: NodeJS.Timeout) {
    if (timeout) {
      clearTimeout(timeout);
    }

    return setTimeout(() => {
      console.log(`reclaim: '${key}'`);
      this.cache.delete(key);
    }, this.ttl);
  }
}
