const DEFAULT_CACHE_MAX_SIZE = 1024;
class Cache<T> {
  private maxSize: number;
  private cache: Map<number, T>;
  constructor(maxSize?: number) {
    this.cache = new Map();
    this.maxSize = maxSize || DEFAULT_CACHE_MAX_SIZE;
  }
}
