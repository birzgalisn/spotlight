export default class DebounceManager {
  private readonly delay: number;
  private timeout: NodeJS.Timeout | null = null;

  constructor(delay: number = 300) {
    this.delay = delay;
  }

  public clear() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  public debounce(fn: () => void) {
    this.clear();
    this.timeout = setTimeout(fn, this.delay);
  }
}
