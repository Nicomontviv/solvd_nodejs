function customFilterUnique(array, callback) {
  const seen = new Set();
  return array.filter(item => {
    const key = callback(item);
    if (seen.has(key)) {
      return false;
    } else {
      seen.add(key);
      return true;
    }
  });
}
console.log(customFilterUnique([1, 2, 2, 3, 4, 4], x => x)); // [1, 2, 3, 4]
console.log(customFilterUnique([{ id: 1 }, { id: 2 }, { id: 1 }], x => x.id)); // [{ id: 1 }, { id: 2 }]
console.log(customFilterUnique(['apple', 'banana', 'apple'], x => x)); // ['apple', 'banana']

let arrayDeObjetos = [
    {id: 1, name: 'Alice', age: 30},
    {id: 2, name: 'Bob', age: 25},
    {id: 1, name: 'Alice', age: 30},
    {id: 3, name: 'Charlie', age: 35},
];
console.log(customFilterUnique(arrayDeObjetos, x => x.id)); // [{id: 1, name: 'Alice', age: 30}, {id: 2, name: 'Bob', age: 25}, {id: 3, name: 'Charlie', age: 35}]



//task 2 
 
function chunkArray(array, size) {
  if (size <= 0) {
    throw new Error("Size must be greater than 0");
  }
  
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  
  return result;
}

console.log(chunkArray([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]
console.log(chunkArray([1, 2, 3, 4, 5], 3)); // [[1, 2, 3], [4, 5]]
console.log(chunkArray([1, 2, 3, 4, 5], 1)); // [[1], [2], [3], [4], [5]]
console.log(chunkArray([1, 2, 3, 4, 5], 0)); // Error: Size must be greater than 0


//version optimizada 
function chunkArrayv2(array, size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error("Size must be a positive integer");
  }

  const result = [];
  let chunk = [];

  for (let i = 0; i < array.length; i++) {
    chunk.push(array[i]);

    if (chunk.length === size) {
      result.push(chunk);
      chunk = []; // reutilizamos el mismo array
    }
  }

  if (chunk.length > 0) {
    result.push(chunk);
  }

  return result;
}

console.log(chunkArrayv2([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]
console.log(chunkArrayv2([1, 2, 3, 4, 5], 3)); // [[1, 2, 3], [4, 5]]
console.log(chunkArrayv2([1, 2, 3, 4, 5], 1)); // [[1], [2], [3], [4], [5]]
console.log(chunkArrayv2([1, 2, 3, 4, 5], 0)); // Error: Size must be a positive integer  

//task 3

function customShufflev1(array) {
  const mid = Math.floor(array.length / 2);
  const left = array.slice(0, mid);
  const right = array.slice(mid);
  const result = [];

  while (left.length && right.length) {
    // Mezclar alternadamente con algo de aleatoriedad
    if (Math.random() > 0.5) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  return result.concat(left, right);
}

console.log(customShufflev1([1, 2, 3, 4, 5])); // Ejemplo de salida: [1, 3, 2, 4, 5]
console.log(customShufflev1(['a', 'b', 'c', 'd'])); // Ejemplo de salida: ['a', 'c', 'b', 'd']

function customShuffle(array) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

console.log(customShuffle([1, 2, 3, 4, 5])); // Ejemplo de salida: [3, 1, 5, 2, 4]
console.log(customShuffle(['a', 'b', 'c', 'd'])); // Ejemplo de salida: ['d', 'b', 'a', 'c']


//task 4 

function getArrayIntersection(arr1, arr2){
    return arr1.filter(item => arr2.includes(item));
}

console.log(getArrayIntersection([1, 2, 3], [2, 3, 4])); // [2, 3]
console.log(getArrayIntersection(['a', 'b', 'c'], ['b', 'c', 'd'])); // ['b', 'c']

function getArrayUnion(arr1, arr2){
    return Array.from(new Set([...arr1, ...arr2]));
}

console.log(getArrayUnion([1, 2, 3], [2, 3, 4])); // [1, 2, 3, 4]
console.log(getArrayUnion(['a', 'b', 'c'], ['b', 'c', 'd'])); // ['a', 'b', 'c', 'd']

//task 5

function measureArrayPerformance(arr, func){
    const start = performance.now();
    func(arr);
    const end = performance.now();
    return end - start;
}


function customMap(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}

const bigArray = Array.from({ length: 1_000_000 }, (_, i) => i);

// Usar map nativo
const timeNativeMap = measureArrayPerformance(
   bigArray,
    arr => arr.map(x => x * 2)
  
);

// Usar custom map
const timeCustomMap = measureArrayPerformance(
   bigArray,
  arr => customMap(arr, x => x * 2)
  
);

console.log("Native map:", timeNativeMap.toFixed(2), "ms");
console.log("Custom map:", timeCustomMap.toFixed(2), "ms");
