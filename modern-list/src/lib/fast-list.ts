import alru from 'array-lru';
import Allocator from 'js-malloc';
import Node from './node';
import { Nullable } from './types';

const MAX_CACHE_SIZE = 1024;

class FastList<T = any> {
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

  public static from<T>(arr: readonly T[]): FastList<T> {
    const lst = new FastList<T>();
    {
      let i = 0;
      const length = arr.length;
      for (; i < length; ++i) {
        lst.push(arr[i]);
      }
    }
    return lst;
  }
  /**
   * @field the length of the list
   */
  public length: number;
  private head: Nullable<Node<T>>;
  private tail: Nullable<Node<T>>;
  private isInitialized: boolean;
  private cache: LRUObject<Node<T>>;
  private allocator: Allocator<Node<T>>;

  /**
   * @constructor creates a new list
   */
  constructor() {
    this.head = null;
    this.tail = null;
    this.isInitialized = false;
    this.length = 0;
    this.cache = alru(MAX_CACHE_SIZE);
    this.allocator = new Allocator(() => new Node());
  }

  // public interface

  /**
   * push an item after the tail of the list
   * @param the value to insert into the list
   * @returns the modified list
   */
  public push(value: T): FastList<T> {
    this.invalidateCache();
    const next = this.newNode(value, null);
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
  public pushHead(value: T): FastList<T> {
    this.invalidateCache();
    const head = this.newNode(value, this.head);
    if (!this.isInitialized) {
      this.isInitialized = true;
    }
    this.head = head;
    ++this.length;
    return this;
  }

  /**
   * put a new element after the given index
   * @param idx the index for which to put the element after
   * @param value the new value
   * @returns the modified list, null if the index is invalid
   */
  public pushAfter(idx: number, value: T): Nullable<FastList<T>> {
    if (!this.isValidIndex(idx)) {
      return null;
    }
    const [, cur, next] = this.find(idx);
    if (cur) {
      this.invalidateCache();
      const newNext = this.newNode(value, next);
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
    let prevCached: Node<T>;
    if ((prevCached = this.cache.get(idx)) !== null) {
      return prevCached.value;
    }
    let cur = this.head;
    let i = 0;
    for (; i !== idx; ++i, cur = cur.next) {
      //
    }
    this.cache.set(idx, cur);
    return cur.value;
  }

  /**
   * @param idx the index you wish to to set
   * @param value the value for the given index
   */
  public set(idx: number, value: T): Nullable<FastList<T>> {
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
  public clear(): void {
    this.invalidateCache();
    this.isInitialized = false;
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // iteration methods

  public *[Symbol.iterator](): Generator<T> {
    if (!this.isInitialized) {
      return;
    }
    let cur = this.head;
    for (; cur !== null; cur = cur.next) {
      yield cur.value;
    }
  }

  /**
   * applies a function to each value in the list
   * @param callback the function to apply to the list
   */
  public map<U>(callback: (value: T) => U): FastList<U> {
    const lst = new FastList<U>();
    let cur = this.head;
    for (; cur !== null; cur = cur.next) {
      lst.push(callback(cur.value));
    }
    return lst;
  }

  /**
   * filters a list to only those where callback(item) === true
   * @param callback the function to apply to the list
   */
  public filter(callback: (value: T) => boolean): FastList<T> {
    const lst = new FastList<T>();
    let cur = this.head;
    for (; cur !== null; cur = cur.next) {
      if (callback(cur.value) === true) {
        lst.push(cur.value);
      }
    }
    return lst;
  }

  /**
   * reduces a list to a single value
   * @param callback the function to accumulate the list
   */
  public reduce<U = T>(callback: (acc: U, elem: T) => U, initialValue?: U): U {
    let curVal = initialValue || ((this.head.value as any) as U);
    let cur = initialValue ? this.head : this.head.next;
    for (; cur !== null; cur = cur.next) {
      curVal = callback(curVal, cur.value);
    }
    return curVal;
  }

  /**
   * calls function to each item of the list
   * @param callback the function to apply to the list
   */
  public forEach(callback: (value: T) => any): void {
    let cur = this.head;
    for (; cur !== null; cur = cur.next) {
      callback(cur.value);
    }
  }

  // Array methods

  /**
   * convert the list to an array
   */
  public toArray(): readonly T[] {
    const arr = Array(this.length);
    for (let cur = this.head, i = 0; i < this.length; cur = cur.next, ++i) {
      arr[i] = cur.value;
    }
    return arr;
  }

  // optimizations

  /**
   * clears the cache
   * TODO we could be a bit smarter here
   */
  private invalidateCache(): void {
    this.cache = alru(MAX_CACHE_SIZE);
  }

  // TODO only return prev? or pre-alloc this arr?
  /**
   * the reason this is a "fast list"
   * tries it's hardest to find elements really quickly
   * @param idx the index you wish to find
   */
  private find(
    idx: number
  ): readonly [Nullable<Node<T>>, Nullable<Node<T>>, Nullable<Node<T>>] {
    if (!this.isInitialized) {
      return [null, null, null];
    }
    if (idx === 0) {
      return [null, this.head, this.head.next];
    }
    let prevCached: Nullable<Node<T>>;
    if ((prevCached = this.cache.get(idx - 1)) !== null) {
      return [
        prevCached,
        prevCached.next,
        prevCached.next !== null ? prevCached.next.next : null
      ];
    }
    let i = 1;
    let prev = this.head;
    let cur = prev.next;
    const localLength = this.length;
    for (; i < localLength; ++i, prev = cur, cur = cur.next) {
      this.cache.set(i, cur);
      if (i === idx) {
        return [prev, cur, cur.next];
      }
    }
    return [null, null, null];
  }

  private isValidIndex(idx: number): boolean {
    // not an int or invalid index
    return (idx ^ 0) === idx && idx > -1 && idx < this.length;
  }

  private newNode(value: T, next: Nullable<Node<T>>) {
    const node = this.allocator.new();
    node.value = value;
    node.next = next;
    return node;
  }
}

export default FastList;
