import { SIZE } from './run-bench';

const set = new Set();
for (let i = 0; i < SIZE; ++i) {
  set.add(i);
}
console.time();
for (let i = 0; i < 10; ++i) {
  for (const _ of set) {
    //
  }
}
console.timeEnd();
