export default class LastRecentlyUsedCache<T> {
  private readonly cache = new Map<
    string,
    { value: T; timeout: NodeJS.Timeout }
  >();
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

    if (!entry) {
      return;
    }

    this.cache.delete(key);
    this.cache.set(key, entry);

    entry.timeout = this.scheduleCleanup(key, entry.timeout);

    return entry.value;
  }

  public set(key: string, value: T) {
    if (this.cache.size >= this.sizeLimit) {
      const oldestEntry = this.cache.entries().next().value;

      if (oldestEntry) {
        const [key, entry] = oldestEntry;

        clearTimeout(entry.timeout);

        this.cache.delete(key);
      }
    }

    this.cache.set(key, { value, timeout: this.scheduleCleanup(key) });
  }

  public clear() {
    for (const cacheEntry of this.cache.values()) {
      clearTimeout(cacheEntry.timeout);
    }
    this.cache.clear();
  }

  private scheduleCleanup(key: string, timeout?: NodeJS.Timeout) {
    if (timeout) {
      clearTimeout(timeout);
    }

    return setTimeout(() => {
      console.log(`reclaim: ${key}`);
      this.cache.delete(key);
    }, this.ttl);
  }
}
