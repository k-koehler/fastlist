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

  /**
   * @constructor creates a new list
   */
  constructor() {
    this.head = null;
    this.tail = null;
    this.isInitialized = false;
    this.length = 0;

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

  /**
   * push an item after the tail of the list
   * @param the value to insert into the list
   * @returns the modified list
   */
  public push(value: T): LinkedList<T> {
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
   */
  public pushHead(value: T): LinkedList<T> {
    const head = new Node(value, this.head);
    if (!this.isInitialized) {
      this.isInitialized = true;
    }
    this.head = head;
    ++this.length;
    return this;
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
    for (let cur = this.head, i = 0; i < this.length; cur = cur.next, ++i) {
      if (i === idx) {
        return cur.value;
      }
    }
    return null;
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
  public set(idx: number, value: T) {
    if (!this.isValidIndex(idx)) {
      return null;
    }
    for (let cur = this.head, i = 0; i < this.length; cur = cur.next, ++i) {
      if (i === idx) {
        cur.value = value;
        return this;
      }
    }
    return null;
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
      this.head = this.head.next;
      --this.length;
      return true;
    }
    for (
      let prev = this.head, cur = this.head.next, i = 1;
      i < this.length;
      prev = cur, cur = cur.next, ++i
    ) {
      if (i === idx) {
        prev.next = cur.next;
        --this.length;
        return true;
      }
    }
    return true;
  }

  /**
   * clears the list
   */
  public clear() {
    this.isInitialized = false;
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * convert the list to an array
   */
  public toArray(): T[] {
    const lst = Array(this.length);
    for (let cur = this.head, i = 0; i < this.length; cur = cur.next, ++i) {
      lst[i] = cur.value;
    }
    return lst;
  }

  public *[Symbol.iterator](): Generator<T> {
    if (!this.isInitialized) {
      return;
    }
    for (let cur = this.head, i = 0; i < this.length; cur = cur.next, ++i) {
      yield cur.value;
    }
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
