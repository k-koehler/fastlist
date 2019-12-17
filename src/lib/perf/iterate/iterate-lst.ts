import LinkedList from '../../list';
import { SIZE } from './run-bench';

const lst = new LinkedList();
for (let i = 0; i < SIZE; ++i) {
  lst.push(i);
}
// tslint:disable-next-line: no-console
console.time();
for (let i = 0; i < 10; ++i) {
  for (const _ of lst) {
    //
  }
}
// tslint:disable-next-line: no-console
console.timeEnd();
