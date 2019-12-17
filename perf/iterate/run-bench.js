const List = require("modern-list").default;
// https://www.npmjs.com/package/yallist
const yallist = require("yallist");

const numIterations = 10000;
const iterationSize = 10000;

function iterate(iterable) {
  for (const _ of iterable) {
    //
  }
}

function iterateForEach(iterable) {
  iterable.forEach(_ => {});
}

function calculateAverageTime(iterable) {
  let time = 0;
  for (let i = 0; i < numIterations; ++i) {
    const iterateFunc = iterable[Symbol.iterator] ? iterate : iterateForEach;
    const start = new Date();
    iterateFunc(iterable);
    time += new Date() - start;
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
const set = new Set();
const list = new List();
const list1 = yallist.create([]);

for (let i = 0; i < iterationSize; ++i) {
  fixedArray[i] = i;
  dynamicArray.push(i);
  set.add(i);
  list.push(i);
  list1.push(i);
}

const fixedArrayAvg = calculateAverageTime(fixedArray);
const dynamicArrayAvg = calculateAverageTime(dynamicArray);
const setAvg = calculateAverageTime(set);
const listAvg = calculateAverageTime(list);
const list1Avg = calculateAverageTime(list1);

console.log(`
Fixed array average time: ${fixedArrayAvg} (${opsPerSec(fixedArrayAvg)} ops/sec)
Dynamic array average time: ${dynamicArrayAvg} (${opsPerSec(
  dynamicArrayAvg
)} ops/sec)
Set average time: ${setAvg} (${opsPerSec(setAvg)} ops/sec)
List average time: ${listAvg} (${opsPerSec(listAvg)} ops/sec)
(npm: 'yallist') average time: ${list1Avg} (${opsPerSec(list1Avg)} ops/sec)
`);
