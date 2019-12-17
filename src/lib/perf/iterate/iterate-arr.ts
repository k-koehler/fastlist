import { SIZE } from './run-bench';

const arr = new Array(SIZE);
for (let i = 0; i < SIZE; ++i) {
  arr[i] = i;
}

// tslint:disable-next-line: no-console
console.time();
for (let i = 0; i < 10; ++i) {
  for (const _ of arr) {
    //
  }
}
// tslint:disable-next-line: no-console
console.timeEnd();
