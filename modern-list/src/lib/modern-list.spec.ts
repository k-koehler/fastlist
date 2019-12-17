import test from 'ava';
import ModernList from './modern-list';

// ModernList tests

test('doesnt err on empty list', t => {
  const l = new ModernList<number>();
  for (const _ of l) {
    t.fail();
  }
  t.is(l[0], null);
});

test('inserts at tail & iterates the list in successive order', t => {
  const lst = new ModernList<number>();
  lst
    .push(0)
    .push(1)
    .push(2);
  {
    let counter = 0;
    for (const num of lst) {
      t.is(lst[num], counter++);
    }
  }
});

test('square bracket getters function like an array', t => {
  const lst = new ModernList<number>()
    .push(0)
    .push(1)
    .push(2);
  for (let i = 0; i < 3; ++i) {
    t.is(lst[i], i);
  }
});

test('basic getter works', t => {
  const lst = new ModernList<number>()
    .push(0)
    .push(1)
    .push(2);
  for (let i = 0; i < 3; ++i) {
    t.is(lst.get(i), i);
  }
});

test("should return null for an element that doesn't exist", t => {
  const lst = new ModernList();
  t.is(null, lst[3.4]);
  t.is(null, lst[0]);
  t.is(null, lst[1]);
  t.is(null, lst[99999]);
});

test('should set a given index', t => {
  const lst = new ModernList<number>().push(10).push(20);
  t.is(lst.set(2, 50), null);
  t.is(lst.set(0, 100)[0], 100);
  t.is(lst.set(1, 200)[1], 200);
});

test('should set with proxy', t => {
  const lst = new ModernList().push(0).push(1);
  lst[0] += 10;
  lst[1] *= 20;
  t.is(lst[0], 10);
  t.is(lst[1], 20);
});

test('mutli-assignment', t => {
  const lst = new ModernList().push(0).push(1);
  lst[0] = lst[1] = 10;
  t.is(lst[0], 10);
  t.is(lst[1], 10);
  t.is(lst.get(0), 10);
  t.is(lst.get(1), 10);
});

test('remove head repeatedly', t => {
  const lst = new ModernList()
    .push(0)
    .push(1)
    .push(2)
    .push(3);
  t.is(lst.length, 4);
  for (let i = lst.length; i; --i) {
    lst.remove(0);
    t.is(lst.length, i - 1);
  }
});

test('remove only element', t => {
  const lst = new ModernList().push(0);
  lst.remove(0);
  t.is(lst.length, 0);
  // @ts-ignore
  t.is(lst.isInitialized, false);
  // @ts-ignore
  t.is(lst.head, null);
  // @ts-ignore
  t.is(lst.tail, null);
});

test('remove head', t => {
  const lst = new ModernList()
    .push(0)
    .push(1)
    .push(2);
  t.is(lst.length, 3);
  lst.remove(0);
  t.is(lst.length, 2);
  t.is(lst[0], 1);
  t.is(lst[1], 2);
});

test('remove arbitrary element', t => {
  const lst = new ModernList()
    .push(0)
    .push(1)
    .push(2);
  t.is(lst.length, 3);
  lst.remove(1);
  t.is(lst.length, 2);
  t.is(lst[0], 0);
  t.is(lst[1], 2);
});

test('proxy delete works', t => {
  const lst = new ModernList()
    .push(0)
    .push(1)
    .push(2);
  t.is(lst.length, 3);
  delete lst[1];
  t.is(lst.length, 2);
  t.is(lst[0], 0);
  t.is(lst[1], 2);
});

test('converts to array', t => {
  const lst = new ModernList();
  for (let i = 0; i < 10; ++i) {
    lst.push(i);
  }
  t.is(lst.length, 10);
  const arr = lst.toArray();
  t.true(Array.isArray(arr));
  for (let i = 0; i < 10; ++i) {
    t.is(arr[i], i);
  }
});

test('create a stack using ll & pop', t => {
  class Stack {
    private lst: ModernList;
    constructor() {
      this.lst = new ModernList();
    }
    // tslint:disable-next-line: typedef
    public pop() {
      const val = this.lst.first;
      delete this.lst[0];
      return val;
    }
    // tslint:disable-next-line: typedef
    public peek() {
      return this.lst.first;
    }
    // tslint:disable-next-line: typedef
    public push(value: any) {
      this.lst.pushHead(value);
    }
  }
  const stack = new Stack();
  for (let i = 1; i <= 1000; ++i) {
    stack.push(i);
  }
  for (let i = 1000; stack.peek() !== null; --i) {
    t.is(stack.peek(), i);
    t.is(stack.pop(), i);
  }
});

test('create a queue using ll & dequeue', t => {
  // tslint:disable-next-line: max-classes-per-file
  class Queue {
    private lst: ModernList;
    constructor() {
      this.lst = new ModernList();
    }
    // tslint:disable-next-line: typedef
    public dequeue() {
      const val = this.lst.first;
      delete this.lst[0];
      return val;
    }
    // tslint:disable-next-line: typedef
    public peek() {
      return this.lst.first;
    }
    // tslint:disable-next-line: typedef
    public enqueue(value: any) {
      this.lst.push(value);
    }
  }
  const queue = new Queue();
  for (let i = 1; i <= 1000; ++i) {
    queue.enqueue(i);
  }
  for (let i = 1; queue.peek() !== null; ++i) {
    t.is(queue.peek(), i);
    t.is(queue.dequeue(), i);
  }
});

test('cache works', t => {
  const lst = new ModernList()
    .push(0)
    .push(1)
    .push(2)
    .push(3);
  let hitCache: boolean = false;
  // @ts-ignore
  const oldGet = lst.cache.get;
  // @ts-ignore
  lst.cache.get = (idx: number) => {
    // @ts-ignore
    const res = oldGet.call(lst.cache, idx);
    if (res !== null) {
      hitCache = true;
    }
    return res;
  };
  lst.get(3);
  // @ts-ignore
  t.is(hitCache, false);
  lst.get(3);
  t.is(hitCache, true);
});

test('static from', t => {
  t.deepEqual(ModernList.from([1, 2, 3, 4, 5]).toArray(), [1, 2, 3, 4, 5]);
});

test('pushAfter', t => {
  const lst = ModernList.from([10, 20, 30, 40, 50]);
  t.deepEqual(lst.pushAfter(2, 99).toArray(), [10, 20, 30, 99, 40, 50]);
});

test('moveHead', t => {
  t.pass();
});

test('moveAfter', t => {
  t.pass();
});
