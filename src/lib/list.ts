import Node from './node';
import { Nullable } from './types';

class LinkedList<T> {
  /**
   * @field the length of the list
   */
  public length: number;
  private head: Nullable<Node<T>>;
  private tail: Nullable<Node<T>>;
  private isInitialized: boolean;

  /**
   * @constructor
   */
  constructor() {
    this.head = null;
    this.tail = null;
    this.isInitialized = false;
    this.length = 0;

    return new Proxy(this, {
      get: (lst, key) => {
        const thisProp = this[key];
        if (thisProp !== undefined || typeof key === 'symbol') {
          return thisProp;
        }
        return lst.get(Number(key));
      }
    });
  }

  /**
   * random access at a given element
   * @param the index you wish to retrieve
   * @returns the element at the given index, null otherwise
   */
  public get(idx: number): Nullable<T> {
    for (let cur = this.head, i = 0; i < this.length; cur = cur.next, ++i) {
      if (i === idx) {
        return cur.value;
      }
    }
    return null;
  }

  /**
   * insert an item at the head of the list
   * @param the value to insert into the list
   * @returns the modified list
   */
  public insert(value: T): LinkedList<T> {
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

  public *[Symbol.iterator](): Generator<T> {
    if (!this.isInitialized) {
      return;
    }
    for (let cur = this.head, i = 0; i < this.length; cur = cur.next, ++i) {
      yield cur.value;
    }
  }
}

export default LinkedList;
