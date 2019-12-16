{
  const SIZE = 100000;
  const set = new Set();
  for (let i = 0; i < SIZE; ++i) {
    set.add(i);
  }
  // tslint:disable-next-line: no-console
  console.time('iterate');
  for (let i = 0; i < 10; ++i) {
    for (const _ of set) {
      //
    }
  }
  // tslint:disable-next-line: no-console
  console.timeEnd('iterate');
}
