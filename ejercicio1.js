<<<<<<< HEAD

/*  ### Task

Perform arithmetic operations on strings without relying on bigint or arithmetic libraries. The operations should function as string functions, considering only positive integers (you can avoid negative numbers, all numbers will be positive and integer).

`String.plus(string) => string`

`String.minus(string) => string`

`String.divide(string) => string`

`String.multiply(string) => string` */


function stringToBigInt(str) {
  if (typeof str !== 'string') {
    throw new TypeError("Expected a string as input");
  }

  let result = 0n; 

  for (let i = 0; i < str.length; i++) {
    const digit = BigInt(str.charCodeAt(i) - 48); 

    // Validación de que el carácter sea un número
    if (digit < 0n || digit > 9n) {
      throw new Error(`Invalid character '${str[i]}' at position ${i}`);
    }

    result = result * 10n + digit; 
  }

  return result;
}

String.prototype.plus = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .plus must be a string");
  }

  const numA = stringToBigInt(this.toString());
  const numB = stringToBigInt(other);

  const res = numA + numB;

  return res.toString();
};

const n = "123456789012345678901234567890";
console.log(n.plus("456")); // "123456789012345678901234568346"


String.prototype.minus = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .plus must be a string");
  }

  const numA = stringToBigInt(this.toString());
  const numB = stringToBigInt(other);

  const res = numA - numB;

  return res.toString();
};

const m = "123456789012345678901234567890";
console.log(m.minus("90"));  // "123456789012345678901234567800"


String.prototype.divide = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .plus must be a string");
  }

  const numA = stringToBigInt(this.toString());
  const numB = stringToInt(other);

  const res = Math.floor(numA/numB);

  return res.toString();
};
console.log("100".divide("4"));  // "25"


String.prototype.multiply = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .plus must be a string");
  }

  const numA = stringToInt(this.toString());
  const numB = stringToInt(other);

  const res = numA * numB;

  return res.toString();
};

console.log("100".multiply("4"));  // "400"


*/
=======
function stringToInt(str) {
  if (typeof str !== 'string') {
    throw new TypeError("Expected a string as input");
  }

  let result = 0;

  for (let i = 0; i < str.length; i++) {
    const digit = str.charCodeAt(i) - 48;

    // Validación de que el carácter sea un número
    if (digit < 0 || digit > 9) {
      throw new Error(`Invalid character '${str[i]}' at position ${i}`);
    }

    result = result * 10 + digit;
  }

  return result;
}

String.prototype.plus = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .plus must be a string");
  }

  const numA = stringToInt(this.toString());
  const numB = stringToInt(other);

  const res = numA + numB;

  return res.toString();
};

console.log("123".plus("456"));  // "579"


String.prototype.minus = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .plus must be a string");
  }

  const numA = stringToInt(this.toString());
  const numB = stringToInt(other);

  const res = numA - numB;

  return res.toString();
};

console.log("123".minus("23"));  // "100"

String.prototype.divide = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .plus must be a string");
  }

  const numA = stringToInt(this.toString());
  const numB = stringToInt(other);

  const res = Math.floor(numA/numB);

  return res.toString();
};
console.log("100".divide("4"));  // "25"

String.prototype.multiply = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .plus must be a string");
  }

  const numA = stringToInt(this.toString());
  const numB = stringToInt(other);

  const res = numA * numB;

  return res.toString();
};

console.log("100".multiply("4"));  // "400"
>>>>>>> 788c56e6e243d0e225705732b409a7e337226fa0
