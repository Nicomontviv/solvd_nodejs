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