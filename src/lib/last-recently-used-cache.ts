export default class LastRecentlyUsedCache<T> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private sizeLimit: number;
  private ttl: number;

  constructor({
    sizeLimit = 10,
    ttl = 60 * 1000,
  }: Partial<{ sizeLimit: number; ttl: number }> = {}) {
    this.sizeLimit = sizeLimit;
    this.ttl = ttl;
  }

  get(key: string) {
    const cached = this.cache.get(key);

    if (!cached) {
      return;
    }

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return;
    }

    this.cache.delete(key);
    this.cache.set(key, cached);

    return cached;
  }

  set(key: string, value: T) {
    if (this.cache.size >= this.sizeLimit) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear() {
    this.cache.clear();
  }
}
