String.prototype.plus = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .plus must be a string");
  }

  let a = this;
  let b = other;
  let carry = 0;
  let result = "";

  let i = a.length - 1;
  let j = b.length - 1;

  while (i >= 0 || j >= 0 || carry > 0) {
    const digitA = i >= 0 ? a.charCodeAt(i) - 48 : 0;
    const digitB = j >= 0 ? b.charCodeAt(j) - 48 : 0;

    const sum = digitA + digitB + carry;
    result = (sum % 10) + result;
    carry = Math.floor(sum / 10);

    i--;
    j--;
  }

  return result;
};


function compareStrings(a, b) {
  a = a.replace(/^0+/, '') || "0";
  b = b.replace(/^0+/, '') || "0";

  if (a.length > b.length) return 1;
  if (a.length < b.length) return -1;

  for (let i = 0; i < a.length; i++) {
    if (a[i] > b[i]) return 1;
    if (a[i] < b[i]) return -1;
  }

  return 0; // Son iguales
}
function subtractStrings(a, b) {
  let result = "";
  let borrow = 0;

  let i = a.length - 1;
  let j = b.length - 1;

  while (i >= 0) {
    const digitA = a.charCodeAt(i) - 48;
    const digitB = j >= 0 ? b.charCodeAt(j) - 48 : 0;

    let sub = digitA - digitB - borrow;
    if (sub < 0) {
      sub += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }

    result = sub + result;
    i--;
    j--;
  }

  // Eliminar ceros iniciales
  return result.replace(/^0+/, '') || "0";
}


String.prototype.minus = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .minus must be a string");
  }

  let a = this;
  let b = other;

  // Quitar ceros a la izquierda
  a = a.replace(/^0+/, '') || "0";
  b = b.replace(/^0+/, '') || "0";

  // Comparar si a < b
  if (a.length < b.length || (a.length === b.length && a < b)) {
    throw new Error("Subtraction would result in a negative number");
  }

  let result = "";
  let borrow = 0;
  let i = a.length - 1;
  let j = b.length - 1;

  while (i >= 0) {
    let digitA = a.charCodeAt(i) - 48 - borrow;
    const digitB = j >= 0 ? b.charCodeAt(j) - 48 : 0;

    if (digitA < digitB) {
      digitA += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }

    const diff = digitA - digitB;
    result = diff + result;

    i--;
    j--;
  }

  return result.replace(/^0+/, '') || "0";
};


String.prototype.divide = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .divide must be a string");
  }

  
  const a = this.replace(/^0+/, '') || "0";
  const b = other.replace(/^0+/, '') || "0";

 
  if (b === "0") {
    throw new Error("Division by zero");
  }

  // comparar si el dividendo es menor que el divisor
  const isSmaller = (x, y) => {
    if (x.length !== y.length) return x.length < y.length;
    return x < y;
  };

  // resta de strings positivos
  const subtract = (x, y) => {
    let result = "", borrow = 0;
    let i = x.length - 1, j = y.length - 1;

    while (i >= 0) {
      let digitA = x.charCodeAt(i) - 48 - borrow;
      const digitB = j >= 0 ? y.charCodeAt(j) - 48 : 0;

      if (digitA < digitB) {
        digitA += 10;
        borrow = 1;
      } else {
        borrow = 0;
      }

      result = (digitA - digitB) + result;
      i--; j--;
    }

    return result.replace(/^0+/, '') || "0";
  };

  
  const multiplyByDigit = (num, digit) => {
    if (digit === 0) return "0";
    let carry = 0, result = "";
    for (let i = num.length - 1; i >= 0; i--) {
      const mul = (num.charCodeAt(i) - 48) * digit + carry;
      result = (mul % 10) + result;
      carry = Math.floor(mul / 10);
    }
    if (carry) result = carry + result;
    return result;
  };

  let quotient = "", remainder = "";

  for (let i = 0; i < a.length; i++) {
    remainder += a[i];
    remainder = remainder.replace(/^0+/, '') || "0";

    let count = 0;
    while (!isSmaller(remainder, b)) {
      remainder = subtract(remainder, b);
      count++;
    }

    quotient += count;
  }

  return quotient.replace(/^0+/, '') || "0";
};


String.prototype.divide = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .divide must be a string");
  }

  let dividend = this.replace(/^0+/, '') || "0";
  let divisor = other.replace(/^0+/, '') || "0";

  if (divisor === "0") {
    throw new Error("Division by zero");
  }

  if (compareStrings(dividend, divisor) < 0) {
    return "0";
  }

  let result = "";
  let current = "";

  for (let i = 0; i < dividend.length; i++) {
    current += dividend[i];
    current = current.replace(/^0+/, '') || "0";

    let count = 0;
    while (compareStrings(current, divisor) >= 0) {
      current = subtractStrings(current, divisor);
      count++;
    }

    result += count;
  }

  return result.replace(/^0+/, '') || "0";
};


String.prototype.multiply = function (other) {
  if (typeof other !== 'string') {
    throw new TypeError("Argument to .multiply must be a string");
  }

  const a = this.replace(/^0+/, '') || "0";
  const b = other.replace(/^0+/, '') || "0";

  // if its 0
  if (a === "0" || b === "0") return "0";

  const result = Array(a.length + b.length).fill(0);

  for (let i = a.length - 1; i >= 0; i--) {
    const digitA = a.charCodeAt(i) - 48;
    for (let j = b.length - 1; j >= 0; j--) {
      const digitB = b.charCodeAt(j) - 48;

      const pos = i + j + 1;
      const mul = digitA * digitB + result[pos];

      result[pos] = mul % 10;
      result[pos - 1] += Math.floor(mul / 10);
    }
  }

  
  return result.join('').replace(/^0+/, '');
};
// Suma
console.log("123456789123456789".plus("987654321987654321")); 
// "1111111111111111110"

// Resta
console.log("1000000000000000000".minus("999999999999999999")); 
// "1"

// Multiplicación
console.log("123456789".multiply("987654321")); 
// "121932631112635269"

// División
console.log("121932631112635269".divide("123456789")); 
// "987654321"

