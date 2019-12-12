type Nullable<T> = null | T;

interface ListNode<T> {
  value: T;
  next: Nullable<ListNode<T>>;
}

class FastList<T> {
  private head: Nullable<ListNode<T>>;
  private tail: Nullable<ListNode<T>>;
  private isInitialized: boolean;
  private length: number;

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
        return lst.at(Number(key));
      }
    });
  }

  public at(idx: number): T | null {
    for (let cur = this.head, i = 0; i < this.length; cur = cur.next, ++i) {
      if (i === idx) {
        return cur.value;
      }
    }
    return null;
  }

  public insert(value: T): FastList<T> {
    const next = { value, next: null };
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

export default FastList;
