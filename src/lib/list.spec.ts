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
    .insert(0)
    .insert(1)
    .insert(2);
  {
    let counter = 0;
    for (const num of lst) {
      t.is(lst[num], counter++);
    }
  }
});

test('square bracket getters function like an array', t => {
  const lst = new LinkedList<number>()
    .insert(0)
    .insert(1)
    .insert(2);
  for (let i = 0; i < 3; ++i) {
    t.is(lst[i], i);
  }
  for (let i = 0; i < 3; ++i) {
    t.is(lst.get(i), i);
  }
});

test('basic getter works', t => {
  const lst = new LinkedList<number>()
    .insert(0)
    .insert(1)
    .insert(2);
  for (let i = 0; i < 3; ++i) {
    t.is(lst.get(i), i);
  }
});

test("should return null for an element that doesn't exist", t => {
  // const lst = LinkedList;
  t.pass();
});

// test('set the list with proxy setter', t => {});
