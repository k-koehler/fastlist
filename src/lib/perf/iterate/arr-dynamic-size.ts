{
  const SIZE = 100000;

  const arr = [];

  for (let i = 0; i < SIZE; ++i) {
    arr[i] = i;
  }

  console.time();
  for (let i = 0; i < 10; ++i) {
    for (const _ of arr) {
      //
    }
  }
  console.timeEnd();
}
