{
  const SIZE = 100000;

  // tslint:disable-next-line: readonly-array
  const arr = [];

  for (let i = 0; i < SIZE; ++i) {
    arr.push(i);
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
}
