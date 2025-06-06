function isPlainObject(obj) {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}
function addValues(a, b) {
  // Numbers or strings
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  }
  
  if (typeof a === "string" || typeof b === "string") {
    return String(a) + String(b); 
  }

  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    return [...a, ...b];
  }

  // Objects
  if (isPlainObject(a) && isPlainObject(b)) {
    return { ...a, ...b };
  }

  throw new Error("Unsupported types for addition");
}

function stringifyValue(value) {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  } else {
    return String(value);
  }
}
function invertBoolean(value){
  if (typeof value !== 'boolean') {
    throw new Error("Value must be a boolean");
  }
  return !value;
}


function convertToNumber(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const num = value.includes('.') ? parseFloat(value) : parseInt(value, 10);
    if (isNaN(num)) {
      throw new Error(`Cannot convert string "${value}" to number`);
    }
    return num;
  }

  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Cannot convert value of type ${typeof value} to number`);
  }

  return num;
}

function coerceToType(value, type) {
  switch (type) {
    case 'string':
      return String(value);
    case 'number':
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Cannot coerce value "${value}" to type number`);
      }
      return num;
    case 'boolean':
      return Boolean(value);
    case 'object':
      if (value === null || typeof value === 'object') {
        return value;
      }
      try {
        return JSON.parse(value);
      } catch {
        throw new Error(`Cannot coerce value "${value}" to type object`);
      }
    case 'array':
      if (Array.isArray(value)) {
        return value;
      }
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        } else {
          throw new Error();
        }
      } catch {
        throw new Error(`Cannot coerce value "${value}" to type array`);
      }
    default:
      throw new Error(`Unsupported target type: ${type}`);
  }
}

//TEST ADD VALUES
console.log(addValues(1, 2));                  // 3
console.log(addValues("Hola", " Mundo"));      // "Hola Mundo"
console.log(addValues([1], [2]));              // [1, 2]
console.log(addValues({ a: 1 }, { b: 2 }));    // { a: 1, b: 2 }
console.log(addValues(1, "2"));                // "12"
console.log(addValues("1", 2));                // "12"
//TEST STRINGIFY VALUE
console.log(stringifyValue(42));               // "42"
console.log(stringifyValue(true));             // "true"
console.log(stringifyValue([1, 2, 3]));         // "[1,2,3]"
console.log(stringifyValue({ a: 1 }));          // "{"a":1}"
console.log(stringifyValue(null));             // "null"
console.log(stringifyValue(undefined));        // "undefined"
console.log(stringifyValue(() => {}));         // "() => {}"
console.log(stringifyValue(Symbol('x')));      // "Symbol(x)"
//TEST INVERT BOOLEAN
console.log(invertBoolean(true));  // false
console.log(invertBoolean(false));  // true
console.log(invertBoolean(2 == (1+1)));  // false
console.log(invertBoolean(1 == (3-1)));  // true
//console.log(invertBoolean(6));  // Error: Value must be a boolean
//console.log(invertBoolean("true"));  // Error: Value must be a boolean
//TEST CONVERT TO NUMBER
console.log(convertToNumber("42"));        // 42
console.log(convertToNumber("3.14"));      // 3.14
console.log(convertToNumber(10));          // 10
console.log(convertToNumber(true));        // 1
console.log(convertToNumber(false));       // 0
console.log(convertToNumber(null));        // 0
//console.log(convertToNumber("abc"));       // Error: Cannot convert string "abc" to number
//console.log(convertToNumber(undefined));   // Error: Cannot convert value of type undefined to number
//TEST COERCE TO TYPE
console.log(coerceToType("123", "number"));       // 123
console.log(coerceToType("true", "boolean"));     // true (truthy string)
console.log(coerceToType(0, "boolean"));          // false
console.log(coerceToType(42, "string"));          // "42"
console.log(coerceToType('{"a":1}', "object"));   // { a: 1 }
console.log(coerceToType('[1,2,3]', "array"));    // [1, 2, 3]
//console.log(coerceToType('notjson', "object"));   // Error
// console.log(coerceToType('notjson', "array"));    // Error
