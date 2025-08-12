const test1 = 'test';
const test2 = 'te\'st';
const test3 = 'te"st';
console.log(test1);
console.log(test2);
console.log(test3);


const test4 = "te\"st";
const test5 = "te'st";
const test6 = "test";
console.log(test4);
console.log(test5);
console.log(test6);
var variable = 35;
const test7= `El numero es ${variable}`;
console.log(test7);

const something = (function(){
    return 'IIFE';
})()
console.log(something);



function safeStringify(obj) {
  const seen = new WeakSet();

  return JSON.stringify(obj, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }
    return value;
  });
}

const a = {};
const b = { a };
a.b = b;

console.log(safeStringify(a));



let a = 5;
let c = 6;

function modificacion(a,b){
    a = a - 1;
    console.log(a);
    b = b + 4;
    console.log(b);
    return b;
}
console.log(a);
console.log(c);
modificacion(a, c);
console.log(a);
console.log(c);
c=modificacion(a, c);
console.log(c);