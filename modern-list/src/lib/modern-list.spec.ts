import test from 'ava';
import ModernList from './modern-list';

test('square bracket getters function like an array', t => {
  const lst = new ModernList<number>()
    .push(0)
    .push(1)
    .push(2);
  for (let i = 0; i < 3; ++i) {
    t.is(lst[i], i);
  }
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
