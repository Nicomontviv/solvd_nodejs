//TASK1
const productos = [
  { name: "Laptop", precio: 1000 },
  { name: "Mouse", precio: 50 }
];

const discount = 10; // 10%

const actualizados = function calculateDiscountedPrice(productos, discount){
       return productos.map(producto => {
        const precioConDescuento = producto.precio - (producto.precio * discount / 100);
        return {
            ...producto,
            precio: parseFloat(precioConDescuento.toFixed(2))
        };
    });
}
console.log(productos);
//console.log(calculateDiscountedPrice(productos, discount));
console.log(actualizados(productos, discount));
console.log(productos);

function calculateTotalPrice(productos){
    return productos.reduce((total, producto) => {
        return total + producto.precio;
    }, 0);
}
console.log("Total Price:", calculateTotalPrice(actualizados(productos, discount)));

//TASK2

const person = {
  firstName: "Nicolás",
  lastName: "Montanari"
};

const getFullName = person => `${person.firstName} ${person.lastName}`;
console.log(getFullName(person));

//definimos compose y las funciones auxiliares
const compose = (...fns) =>  x => fns.reduceRight((acc, fn) => fn(acc), x);

const toLower = str => str.toLowerCase();

const splitWords = str => str.match(/\b\w+\b/g) || []; 
// Extrae solo palabras: letras y números

const removeDuplicates = arr => [...new Set(arr)];

const sortAlpha = arr => [...arr].sort();

const filterUniqueWords = compose(
     sortAlpha,
     removeDuplicates,
     splitWords,
     toLower
);

const text = "Hello world, hello universe. Welcome to the world!";
console.log(filterUniqueWords(text));
// Resultado: [ 'hello', 'the', 'to', 'universe', 'welcome', 'world' ]


const students = [
  { name: "Ana", grades: [90, 80, 70] },
  { name: "Luis", grades: [100, 95, 85] },
];

//funciones mas simples y reutilizables 
const getGrades = students => students.map(s => s.grades);           // [[90,80,70], [100,95,85]]
const flatten = arrays => arrays.flat();                             // [90,80,70,100,95,85]
const sum = arr => arr.reduce((a, b) => a + b, 0);                   // suma total
const length = arr => arr.length;                                    // cantidad de notas
const average = arr => sum(arr) / length(arr);                       // promedio

const calculateAverageGrades = compose(
    average,
    flatten,
    getGrades
)
console.log(calculateAverageGrades(students)); // Resultado: 86.67

//TASK3

function createCounter() {
    let count = 0;
    return function() {
        count++;
        return count;
    };
} 

const counter = createCounter();
const counter2 = createCounter();
console.log(counter()); // 1  
console.log(counter()); // 2
console.log(counter2()); // 1 (nuevo contador)  
console.log(counter2()); // 2 (nuevo contador)


function repeatFunction(fn, times) {
    return function() {
      if(time < 0){
        const intervalId = setInterval(fn, 0);
        return intervalId
      }else{
        for(let i = 0; i < times; i++) {
          fn();
        }
      }
    };
}


//TASK4

function calculateFactorial(n, acc = 1) {
  if (n < 0) {
    throw new Error("El factorial no está definido para números negativos");
  }
  if (n === 0 || n === 1) {
    return acc;
  }
  return calculateFactorial(n - 1, acc * n); //recursive call
}

console.log(calculateFactorial(5));   // 120
console.log(calculateFactorial(10));  // 3628800


function power(base, exponent){
  if (exponent < 0) {
    throw new Error("El exponente no puede ser negativo");
  }
  if (exponent === 0) {
    return 1; // Cualquier número elevado a la potencia 0 es 1
  }
  return base * power(base, exponent - 1); //recursive call
}
console.log(power(2, 3));   // 8
console.log(power(5, 0));   // 1  
console.log(power(3, 4));   // 81

//TASK5

function lazyMap(array, mapFn) {
  let index = 0;
  return {
    next: function () {
      if (index < array.length) {
        const value = mapFn(array[index]);
        index++;
        return { value, done: false };
      } else {
        return { done: true };
      }
    },
    [Symbol.iterator]: function () {
      return this;
    },
  };
}
const arr = [1, 2, 3, 4, 5];

const iterator = lazyMap(arr, x => x * 10);

for (const val of iterator) {
  console.log(val); // 10, 20, 30, 40, 50
}

function fibonacciGenerator() {
  let a = 0;
  let b = 1;

  return {
    next: function () {
      const value = a;
      [a, b] = [b, a + b];
      return { value, done: false };
    },
    [Symbol.iterator]: function () {
      return this;
    }
  };
}

const fib = fibonacciGenerator();

console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3
console.log(fib.next().value); // 5
console.log(fib.next().value); // 8

