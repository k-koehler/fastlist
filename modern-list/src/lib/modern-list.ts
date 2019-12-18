import FastList from './fast-list';

class ModernList<T> extends FastList {
  public get fast(): FastList<T> {
    const lst = new FastList<T>();
    // @ts-ignore
    lst.head = this.head;
    // @ts-ignore
    lst.tail = this.tail;
    // @ts-ignore
    lst.length = this.length;
    // @ts-ignore
    lst.isInitialized = this.isInitialized;
    // @ts-ignore
    lst.cache = this.cache;
    return lst;
  }

  public static fromFastList<T>(fastlist: FastList<T>): ModernList<T> {
    const lst = new ModernList<T>();
    // @ts-ignore
    lst.head = fastlist.head;
    // @ts-ignore
    lst.tail = fastlist.tail;
    // @ts-ignore
    lst.length = fastlist.length;
    // @ts-ignore
    lst.isInitialized = fastlist.isInitialized;
    // @ts-ignore
    lst.cache = fastlist.cache;
    return lst;
  }

  constructor() {
    super();
    return new Proxy<ModernList<T>>(this, {
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

  private isOwnProp(key: string | number | symbol): boolean {
    return this[key] !== undefined || typeof key === 'symbol';
  }
}
export default ModernList;
