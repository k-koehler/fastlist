import LinkedList from '../../list';
{
  const SIZE = 100000;
  const lst = new LinkedList();
  for (let i = 0; i < SIZE; ++i) {
    lst.push(i);
  }
  console.time();
  for (let i = 0; i < 10; ++i) {
    for (const _ of lst) {
      //
    }
  }
  console.timeEnd();
}
