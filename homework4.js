// Paso 1: Crear el objeto con propiedades iniciales
const person = {};

// Paso 2: Definir propiedades como read-only y no modificables directamente
Object.defineProperties(person, {
  firstName: {
    value: "John",
    writable: false,
    enumerable: true,
    configurable: true,
  },
  lastName: {
    value: "Doe",
    writable: false,
    enumerable: true,
    configurable: false,
  },
  age: {
    value: 30,
    writable: false,
    enumerable: true,
    configurable: true,
  },
  email: {
    value: "john.doe@example.com",
    writable: false,
    enumerable: true,
    configurable: false,
  },
});


Object.defineProperty(person, "updateInfo", {
  value: function (info) {
    Object.keys(info).forEach((key) => {
      if (Object.getOwnPropertyDescriptor(this, key)) {
        Object.defineProperty(this, key, {
          value: info[key],
          writable: false,      // mantener como solo lectura
          enumerable: true,
          configurable: true,  // no se podrá redefinir más adelante
        });
      }
    });
  },
  writable: false,
  enumerable: true,
  configurable: false,
});


Object.defineProperty(person, "address", {
  value: {},
  writable: true,
  enumerable: false,
  configurable: false,
});
console.log(person.firstName); // "John"

person.firstName = "Jane";
console.log(person.firstName); // read-only

person.updateInfo({ firstName: "Jane", age: 32 });
console.log(person.firstName); // "Jane"
console.log(person.age);       // 32

console.log(person.address);   // {}

for (let key in person) {
  console.log(key); // address no aparece, porque es no enumerable
}





//TASK 2 

// Crear el objeto product con propiedades
const product = {
  name: "Laptop",
};

// Definir price y quantity como no-enumerables y no-escribibles
Object.defineProperties(product, {
  price: {
    value: 1000,
    writable: false,
    enumerable: false,
    configurable: false,
  },
  quantity: {
    value: 5,
    writable: false,
    enumerable: false,
    configurable: true,
  },
});

// Función que devuelve el total usando Object.getOwnPropertyDescriptor
function getTotalPrice(prod) {
  const price = Object.getOwnPropertyDescriptor(prod, "price").value;
  const quantity = Object.getOwnPropertyDescriptor(prod, "quantity").value;
  return price * quantity;
}

// Prueba
console.log(product); // { name: 'Laptop' }, price y quantity no se listan en Object.keys ni for..in
console.log(getTotalPrice(product)); // 5000

function deleteNonConfigurable(obj, prop){
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor && !descriptor.configurable) {
        throw new Error(`Cannot delete non-configurable property: ${prop}`);
    }
    delete obj[prop];
}
console.log(product);
deleteNonConfigurable(product, "name"); // Esto funcionará
console.log(product); // { price: 1000, quantity: 5 }
//deleteNonConfigurable(product, "price"); // Esto lanzará un error porque price es no configurable


//TASK 3

const bankAccount = {
  _balance: 1000, // propiedad interna para guardar el valor real

  // Getter para formattedBalance
  get formattedBalance() {
    return `$${this._balance}`;
  },

  // Getter para balance (opcional, pero recomendado)
  get balance() {
    return this._balance;
  },

  // Setter para balance que actualiza el valor interno
  set balance(value) {
    if (typeof value === 'number' && value >= 0) {
      this._balance = value;
    } else {
      console.error('Balance debe ser un número positivo');
    }
  },

  transfer(amount, targetBankAccount){
    if (typeof amount === 'number' && amount > 0 && this._balance >= amount) {
      this._balance -= amount;
      targetBankAccount.balance += amount;
    } else {
      console.error('Transferencia inválida');
    }

  }
};

// Pruebas
console.log(bankAccount.formattedBalance); // "$1000"

bankAccount.balance = 1500;
console.log(bankAccount.formattedBalance); // "$1500"

bankAccount.balance = -50; // Error y no cambia balance
console.log(bankAccount.formattedBalance); // "$1500"



//TASK 4

function createInmutableObject(obj) {
  const inmutableObj = Object.create(Object.getPrototypeOf(obj), {});

  for (const key of Object.keys(obj)) {
    Object.defineProperty(inmutableObj, key, {
      value: obj[key],
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }

  return inmutableObj;
}

const original = {
  name: "Alice",
  age: 30,
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  },
};
const inmutable = createInmutableObject(original);
console.log(inmutable.name); // "Alice" 
console.log(inmutable.age); // 30
inmutable.name = "Bob"; // No se puede cambiar, es read-only
console.log(inmutable.name); // "Alice" (sigue siendo "Alice")
inmutable.greet(); // "Hello, my name is Alice" (método funciona)


//TASK 5 

function observeObject(obj, callback) {
  return new Proxy(obj, {
    get(target, prop) {
      callback(prop, "get");
      return target[prop];
    },
    set(target, prop, value) {
      callback(prop, "set");
      target[prop] = value;
      return true;
    }
  });
}

const personToObserve = {
  name: "Charlie",
  age: 25,
};
const observedPerson = observeObject(personToObserve, (prop, action) => {
  console.log(`Property "${prop}" was ${action}ed`);
});
observedPerson.name; // "Charlie" (Property "name" was getted)
observedPerson.age = 30; // Property "age" was setted

console.log(observedPerson.age); // 30 (Property "age" was getted)
observedPerson.name = "Dave"; // Property "name" was setted 

//TASK 6 

function deepCloneObject(obj, seen = new Map()) {
  if (obj === null || typeof obj !== 'object') {
    return obj; // Primitivo
  }

  if (seen.has(obj)) {
    return seen.get(obj); // Previene referencias circulares
  }

  let clone;

  if (Array.isArray(obj)) {
    clone = [];
  } else if (obj instanceof Map) {
    clone = new Map();
  } else if (obj instanceof Set) {
    clone = new Set();
  } else if (obj instanceof Date) {
    clone = new Date(obj);
  } else if (obj instanceof RegExp) {
    clone = new RegExp(obj);
  } else {
    clone = Object.create(Object.getPrototypeOf(obj));
  }

  seen.set(obj, clone); // Guarda referencia original → clonada

  if (clone instanceof Map) {
    for (const [key, value] of obj.entries()) {
      clone.set(key, deepCloneObject(value, seen));
    }
  } else if (clone instanceof Set) {
    for (const value of obj.values()) {
      clone.add(deepCloneObject(value, seen));
    }
  } else {
    for (const key of Reflect.ownKeys(obj)) {
      clone[key] = deepCloneObject(obj[key], seen);
    }
  }

  return clone;
}

const or = { a: 1, b: { c: 2 } };
or.self = or; // Circular reference

const copy = deepCloneObject(or);

console.log(copy);           // Copia completa
console.log(copy === or); // false
console.log(copy.b === or.b); // false
console.log(copy.self === copy);    // true