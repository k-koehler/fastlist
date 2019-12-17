const List = require("modern-list").default;
// https://www.npmjs.com/package/yallist
const yallist = require("yallist");
const TsList = require("typescript-collections").LinkedList;

const numIterations = 1000000;
const iterationSize = 100;

function calculateAverageTime(iterable) {
  let time = 0;
  for (let i = 0; i < numIterations; ++i) {
    const randomIdx = Math.floor(Math.random() * iterationSize);
    const func = iterable.get || iterable.indexOf;
    if (Array.isArray(iterable)) {
      const start = new Date();
      iterable[randomIdx];
      time += new Date() - start;
    } else {
      const start = new Date();
      func.call(iterable, randomIdx);
      time += new Date() - start;
    }
  }
  return time / numIterations;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function opsPerSec(timeInMs) {
  return `${numberWithCommas(Math.floor((iterationSize / timeInMs) * 1000))}`;
}

const fixedArray = new Array(iterationSize);
const dynamicArray = [];
const list = new List();
const list1 = yallist.create([]);
const list2 = new TsList();

for (let i = 0; i < iterationSize; ++i) {
  fixedArray[i] = i;
  dynamicArray.push(i);
  list.push(i);
  list1.push(i);
  list2.add(i);
}

const fixedArrayAvg = calculateAverageTime(fixedArray);
const dynamicArrayAvg = calculateAverageTime(dynamicArray);
const listAvg = calculateAverageTime(list);
const list1Avg = calculateAverageTime(list1);
const list2Avg = calculateAverageTime(list2);

console.log(`
Fixed array average time: ${fixedArrayAvg} (${opsPerSec(fixedArrayAvg)} ops/sec)
Dynamic array average time: ${dynamicArrayAvg} (${opsPerSec(
  dynamicArrayAvg
)} ops/sec)
List average time: ${listAvg} (${opsPerSec(listAvg)} ops/sec)
(npm: 'yallist') average time: ${list1Avg} (${opsPerSec(list1Avg)} ops/sec)
(npm: 'typescript-collections') average time: ${list2Avg} (${opsPerSec(
  list2Avg
)} ops/sec)
`);
