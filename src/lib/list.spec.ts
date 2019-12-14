import test from 'ava';
import LinkedList from './list';

// LinkedList tests

test('doesnt err on empty list', t => {
  const l = new LinkedList<number>();
  for (const _ of l) {
    t.fail();
  }
  t.is(l[0], null);
});

test('inserts at tail & iterates the list in successive order', t => {
  const lst = new LinkedList<number>();
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
  const lst = new LinkedList<number>()
    .push(0)
    .push(1)
    .push(2);
  for (let i = 0; i < 3; ++i) {
    t.is(lst[i], i);
  }
  for (let i = 0; i < 3; ++i) {
    t.is(lst.get(i), i);
  }
});

test('basic getter works', t => {
  const lst = new LinkedList<number>()
    .push(0)
    .push(1)
    .push(2);
  for (let i = 0; i < 3; ++i) {
    t.is(lst.get(i), i);
  }
});

test("should return null for an element that doesn't exist", t => {
  const lst = new LinkedList();
  t.is(null, lst[3.4]);
  t.is(null, lst[0]);
  t.is(null, lst[1]);
  t.is(null, lst[99999]);
});

test('should set a given index', t => {
  const lst = new LinkedList<number>().push(10).push(20);
  t.is(lst.set(2, 50), null);
  t.is(lst.set(0, 100)[0], 100);
  t.is(lst.set(1, 200)[1], 200);
});

test('should set with proxy', t => {
  const lst = new LinkedList().push(0).push(1);
  lst[0] += 10;
  lst[1] *= 20;
  t.is(lst[0], 10);
  t.is(lst[1], 20);
});

test('mutli-assignment', t => {
  const lst = new LinkedList().push(0).push(1);
  lst[0] = lst[1] = 10;
  t.is(lst[0], 10);
  t.is(lst[1], 10);
  t.is(lst.get(0), 10);
  t.is(lst.get(1), 10);
});

test('remove head repeatedly', t => {
  const lst = new LinkedList()
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
  const lst = new LinkedList().push(0);
  lst.remove(0);
  t.is(lst.length, 0);
  // @ts-ignore
  t.is(lst.isInitialized, false);
  // @ts-ignore
  t.is(lst.head, null);
  // @ts-ignore
  t.is(lst.tail, null);
});

test('remove arbitrary element', t => {
  t.pass();
});
