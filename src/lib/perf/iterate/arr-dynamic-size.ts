import { SIZE } from './run-bench';

const arr = [];
console.time();
for (let i = 0; i < SIZE; ++i) {
  arr.push(i);
}
for (let i = 0; i < 10; ++i) {
  for (const _ of arr) {
    //
  }
}
console.timeEnd();
