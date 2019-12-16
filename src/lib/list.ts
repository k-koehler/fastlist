import Node from './node';
import { Nullable } from './types';

class LinkedList<T = any> {
  /**
   * @field the length of the list
   */
  public length: number;
  private head: Nullable<Node<T>>;
  private tail: Nullable<Node<T>>;
  private isInitialized: boolean;
  private cache: Map<number, Node<T>>;

  /**
   * @constructor creates a new list
   */
  constructor() {
    this.head = null;
    this.tail = null;
    this.isInitialized = false;
    this.length = 0;
    this.cache = new Map();

    return new Proxy(this, {
      get: (_, key) => {
        if (this.isOwnProp(key)) {
          return this[key];
        }
        return this.get(Number(key));
      },
      set: (_, key, value) => {
        if (this.isOwnProp(key)) {
          this[key] = value;
        } else {
          this.set(Number(key), value);
        }
        return true;
      },
      deleteProperty: (_, key) => {
        if (this.isOwnProp(key)) {
          return delete this[key];
        }
        return this.remove(Number(key));
      }
    });
  }

  // public interface

  /**
   * push an item after the tail of the list
   * @param the value to insert into the list
   * @returns the modified list
   */
  public push(value: T): LinkedList<T> {
    this.invalidateCache();
    const next = new Node(value, null);
    if (!this.isInitialized) {
      this.head = next;
      this.tail = next;
      this.isInitialized = true;
    } else {
      this.tail.next = next;
      this.tail = next;
    }
    ++this.length;
    return this;
  }

  /**
   * place an item at the head of the list
   * @param value
   * @returns the modified list
   */
  public pushHead(value: T): LinkedList<T> {
    this.invalidateCache();
    const head = new Node(value, this.head);
    if (!this.isInitialized) {
      this.isInitialized = true;
    }
    this.head = head;
    ++this.length;
    return this;
  }

  /**
   * put a new element aftere the given index
   * @param idx the index for which to put the element after
   * @param value the new value
   * @returns the modified list, null if the index is invalid
   */
  public pushAfter(idx: number, value: T): Nullable<LinkedList<T>> {
    if (!this.isValidIndex(idx)) {
      return null;
    }
    const [, cur, next] = this.find(idx);
    if (cur) {
      this.invalidateCache();
      const newNext = new Node(value, next);
      cur.next = newNext;
      ++this.length;
      return this;
    }
    return null;
  }

  /**
   * random access at a given element
   * @param the index you wish to retrieve
   * @returns the element at the given index, null otherwise
   */
  public get(idx: number): Nullable<T> {
    if (!this.isValidIndex(idx)) {
      return null;
    }
    const [, cur] = this.find(idx);
    if (!cur) {
      return null;
    }
    return cur.value;
  }

  /**
   * the first element of the list
   */
  public get first(): Nullable<T> {
    if (!this.isInitialized) {
      return null;
    }
    return this.head.value;
  }

  /**
   * the last element of the list
   */
  public get last(): Nullable<T> {
    if (!this.isInitialized) {
      return null;
    }
    return this.tail.value;
  }

  /**
   * @param idx the index you wish to to set
   * @param value the value for the given index
   */
  public set(idx: number, value: T): Nullable<LinkedList<T>> {
    if (!this.isValidIndex(idx)) {
      return null;
    }
    const [, cur] = this.find(idx);
    if (!cur) {
      return null;
    }
    cur.value = value;
    return this;
  }

  /**
   * remove an element from the list
   * @param idx the index you wish to remove
   */
  public remove(idx: number): boolean {
    if (this.length === 0) {
      return true;
    }
    if (this.length === 1) {
      this.clear();
      return true;
    }
    if (idx === 0) {
      this.invalidateCache();
      this.head = this.head.next;
      --this.length;
      return true;
    }
    const [prev, cur, next] = this.find(idx);
    if (prev && cur) {
      this.invalidateCache();
      prev.next = next;
      --this.length;
    }
    return true;
  }

  /**
   * clears the list
   */
  public clear() {
    this.invalidateCache();
    this.isInitialized = false;
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  public *[Symbol.iterator](): Generator<T> {
    if (!this.isInitialized) {
      return;
    }
    for (let cur = this.head, i = 0; i < this.length; cur = cur.next, ++i) {
      this.cache.set(i, cur);
      yield cur.value;
    }
  }

  // Array methods

  /**
   * convert the list to an array
   */
  public toArray(): T[] {
    const arr = Array(this.length);
    for (let cur = this.head, i = 0; i < this.length; cur = cur.next, ++i) {
      this.cache.set(i, cur);
      arr[i] = cur.value;
    }
    return arr;
  }

  public static from<T>(arr: T[]): LinkedList<T> {
    const lst = new LinkedList<T>();
    {
      let i = 0;
      const length = arr.length;
      for (; i < length; ++i) {
        lst.push(arr[i]);
      }
    }
    return lst;
  }

  // optimizations

  /**
   * clears the cache
   * TODO we could be a bit smarter here
   */
  private invalidateCache() {
    this.cache.clear();
  }

  /**
   * the reason this is a "fast list"
   * tries it's hardest to find elements really quickly
   * @param idx the index you wish to find
   */
  private find(
    idx: number
  ): [Nullable<Node<T>>, Nullable<Node<T>>, Nullable<Node<T>>] {
    if (!this.isInitialized) {
      return [null, null, null];
    }
    if (idx === 0) {
      return [null, this.head, this.head.next];
    }
    let prevCached: Nullable<Node<T>>;
    if ((prevCached = this.cache.get(idx - 1)) !== undefined) {
      return [
        prevCached,
        prevCached.next,
        prevCached.next !== null ? prevCached.next.next : null
      ];
    }
    let i = 1,
      prev = this.head,
      cur = prev.next;
    const localLength = this.length;
    // TODO find closest cache index
    for (; i < localLength; ++i, prev = cur, cur = cur.next) {
      this.cache.set(i, cur);
      if (i === idx) {
        return [prev, cur, cur.next];
      }
    }
    return [null, null, null];
  }

  private isValidIndex(idx: number) {
    // not an int or invalid index
    return (idx ^ 0) === idx || idx > -1 || idx < this.length;
  }

  private isOwnProp(key: string | number | Symbol) {
    // typescript can't validate symbol indexers
    // @ts-ignore
    return this[key] !== undefined || typeof key === 'symbol';
  }
}

export default LinkedList;
