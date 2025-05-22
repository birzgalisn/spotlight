type CacheEntry<T> = {
  value: T;
  timeout: NodeJS.Timeout;
  expiresAt: number;
};

export default class LastRecentlyUsedCache<T> {
  private readonly cache = new Map<string, CacheEntry<T>>();
  private readonly sizeLimit: number;
  private readonly ttl: number;

  constructor({
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

    clearTimeout(entry.timeout);
    this.cache.delete(key);

    if (Date.now() >= entry.expiresAt) {
      return;
    }

    this.cache.set(key, {
      value: entry.value,
      expiresAt: entry.expiresAt,
      timeout: setTimeout(() => this.cache.delete(key), this.ttl),
    });

    return entry.value;
  }

  public set(key: string, value: T) {
    if (this.cache.size >= this.sizeLimit) {
      const oldest = this.cache.entries().next().value;

      if (oldest) {
        const [key, entry] = oldest;

        clearTimeout(entry.timeout);
        this.cache.delete(key);
      }
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
      timeout: setTimeout(() => this.cache.delete(key), this.ttl),
    });
  }

  public delete(key: string) {
    const entry = this.cache.get(key);

    if (entry) {
      clearTimeout(entry.timeout);
      this.cache.delete(key);
    }
  }

  public clear() {
    for (const entry of this.cache.values()) {
      clearTimeout(entry.timeout);
    }

    this.cache.clear();
  }
}
