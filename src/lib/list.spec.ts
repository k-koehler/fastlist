import test from 'ava';
import FastList from './list';

test('doesnt err on empty list', t => {
  const l = new FastList<number>();
  for (const _ of l) {
    //
  }
  t.is(l[0], null);
});

test('insert & getters', t => {
  const fastlist = new FastList<number>();
  fastlist.insert(0);
  fastlist.insert(1);
  fastlist.insert(2);
  for (let i = 0; i < 3; ++i) {
    t.is(fastlist[i], i);
  }
  for (let i = 0; i < 3; ++i) {
    t.is(fastlist.at(i), i);
  }
  {
    let counter = 0;
    for (const num of fastlist) {
      t.is(fastlist[num], counter++);
    }
  }
});
