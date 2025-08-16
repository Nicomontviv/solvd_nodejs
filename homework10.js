/**
 * ===============================
 * Custom Hash Function
 * ===============================
 * customHash(str, tableSize):
 *  - Input: a string and the hash table size.
 *  - Process: uses a variant of the djb2 algorithm, multiplying by 33 and applying XOR 
 *    with each character's code. This ensures a good distribution and avalanche effect.
 *  - Output: an integer in the range [0, tableSize).
 * 
 * ===============================
 * HashTable (with Separate Chaining)
 * ===============================
 * HashTable Class:
 *  - Internally stores an array of "buckets", each bucket is a list of [key, value] pairs.
 *  - When two keys hash to the same index (collision), both are stored in the same bucket.
 *
 * Methods:
 *  - set(key, value): Inserts a new key-value pair or updates the value if the key already exists.
 *  - get(key): Retrieves the value associated with the key, or undefined if not found.
 *  - remove(key): Deletes the pair associated with the key and returns true if found, false otherwise.
 *  - print(): Displays the contents of the hash table (for debugging).
 *
 * ===============================
 * Performance Analysis
 * ===============================
 * - Hash Function:
 *   Provides good distribution for most strings, runs in O(n) time 
 *   where n = length of the input string.
 *
 * - Hash Table Operations:
 *   * Insertion: O(1) average case, O(n) worst case (if all keys land in the same bucket).
 *   * Retrieval: O(1) average case, O(n) worst case for the same reason.
 *   * Deletion: O(1) average case, O(n) worst case.
 *
 * - Trade-offs:
 *   * Separate chaining was chosen for simplicity and easier collision handling.
 *   * Performance depends on the table size and load factor (α = n/m). 
 *     With a low load factor, operations remain close to O(1).
 *   * Open addressing is another option, but requires more complex logic 
 *     for probing and resizing.
 */

function customHash(str, tableSize) {
  let hash = 5381; //initial prime number 
 
  for (let i = 0; i < str.length; i++) {
    // charCodeAt returns the UTF-16 code of the caracter
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // we return a valid hash number to the table 
  return Math.abs(hash) % tableSize;
}


class HashTable {
  constructor(size = 16) {
    this.size = size;
    this.buckets = Array.from({ length: size }, () => []);
  }

  // our hash function personalized 
  hash(key) {
    return customHash(key, this.size);
  }

  // Insert or update 
  set(key, value) {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];

    
    //if the key already existe , we update the value 
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }
    //If not, we add the new pair
    bucket.push([key, value]);
  }

  // Search value
  get(key) {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        return bucket[i][1];
      }
    }
    return undefined; // not found
  }

  // delete
  remove(key) {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1); // delete the pair 
        return true;
      }
    }
    return false;
  }

  // for debug: print the table
  print() {
    this.buckets.forEach((bucket, i) => {
      if (bucket.length > 0) {
        console.log(i, bucket);
      }
    });
  }
}

// Crear tabla
const table = new HashTable(8);

// Insertar valores
table.set("apple", 10);
table.set("banana", 20);
table.set("grape", 30);
table.set("peach", 40);
table.set("melon", 50);

console.log("Test 1: Insertion & Retrieval");
console.log("apple =>", table.get("apple"));   // 10
console.log("banana =>", table.get("banana")); // 20
console.log("grape =>", table.get("grape"));   // 30

// Colisiones (fuerza más claves en un mismo índice)
console.log("\nTest 2: Collision Handling");
table.set("papel", 99); // posible colisión con "apple"
console.log("papel =>", table.get("papel"));   // 99
console.log("apple =>", table.get("apple"));   // 10 (sigue estando)

// Actualizar valor existente
console.log("\nTest 3: Update Existing Key");
table.set("banana", 200);
console.log("banana =>", table.get("banana")); // 200

// Eliminar valores
console.log("\nTest 4: Deletion");
console.log("remove grape =>", table.remove("grape")); // true
console.log("grape =>", table.get("grape"));           // undefined
console.log("remove kiwi =>", table.remove("kiwi"));   // false (no existe)

// Estado final de la tabla
console.log("\nFinal Table:");
table.print();
