/**
 * Stack data structure implementation that supports retrieving 
 * the minimum and maximum elements in constant time O(1).
 * 
 * This implementation maintains:
 * - `items`: The main stack storing pushed elements.
 * - `minStack`: An auxiliary stack tracking the minimum value at each state.
 * - `maxStack`: An auxiliary stack tracking the maximum value at each state.
 * 
 * Time Complexity:
 * - push(): O(1)
 * - pop(): O(1)
 * - getMin(): O(1)
 * - getMax(): O(1)
 * - peek(): O(1)
 * - isEmpty(): O(1)
 * - size(): O(1)
 * - clear(): O(1)
 * 
 * Space Complexity: O(n) for storing the same number of elements 
 * in `minStack` and `maxStack` as in `items`.
 */
class Stack {
    constructor() {
        /**
         * Main stack holding all pushed elements.
         * @type {Array<number>}
         */
        this.items = [];

        /**
         * Auxiliary stack that stores the minimum value 
         * at each depth of the main stack.
         * @type {Array<number>}
         */
        this.minStack = [];

        /**
         * Auxiliary stack that stores the maximum value 
         * at each depth of the main stack.
         * @type {Array<number>}
         */
        this.maxStack = [];
    }

    /**
     * Returns the main stack array.
     * @returns {Array<number>} Current items in the stack.
     */
    getItems() {
        return this.items;
    }

    /**
     * Pushes an element onto the stack while updating the 
     * minStack and maxStack to maintain O(1) min/max retrieval.
     * 
     * Algorithm:
     * - Always push element to main stack.
     * - Push the smaller value between new element and 
     *   current min onto minStack.
     * - Push the larger value between new element and 
     *   current max onto maxStack.
     * 
     * @param {number} element - The element to push.
     * @complexity O(1)
     */
    push(element) {
        this.items.push(element);

        if (this.minStack.length === 0) {
            this.minStack.push(element);
            this.maxStack.push(element);
        } else {
            this.minStack.push(Math.min(element, this.getMin()));
            this.maxStack.push(Math.max(element, this.getMax()));
        }
    }

    /**
     * Removes and returns the top element of the stack, 
     * also updating minStack and maxStack accordingly.
     * 
     * @returns {number|null} The removed element, or null if stack is empty.
     * @complexity O(1)
     */
    pop() {
        if (this.isEmpty()) {
            return null;
        } else {
            this.minStack.pop();
            this.maxStack.pop();
            return this.items.pop();
        }
    }

    /**
     * Retrieves the current minimum element in the stack.
     * @returns {number} The minimum value.
     * @complexity O(1)
     */
    getMin() {
        return this.minStack[this.minStack.length - 1];
    }

    /**
     * Retrieves the current maximum element in the stack.
     * @returns {number} The maximum value.
     * @complexity O(1)
     */
    getMax() {
        return this.maxStack[this.maxStack.length - 1];
    }

    /**
     * Returns the element at the top of the stack without removing it.
     * @returns {number|null} The top element, or null if stack is empty.
     * @complexity O(1)
     */
    peek() {
        if (this.isEmpty()) {
            return null;
        } else {
            return this.getItems()[this.getItems().length - 1];
        }
    }

    /**
     * Checks if the stack is empty.
     * @returns {boolean} True if empty, false otherwise.
     * @complexity O(1)
     */
    isEmpty() {
        return this.getItems().length === 0;
    }

    /**
     * Returns the number of elements in the stack.
     * @returns {number} The stack size.
     * @complexity O(1)
     */
    size() {
        return this.getItems().length;
    }

    /**
     * Removes all elements from the stack.
     * @complexity O(1)
     */
    clear() {
        this.items = [];
        this.minStack = [];
        this.maxStack = [];
    }
}

/**
 * Class Queue
 * A Queue is a linear data structure that follows the FIFO (First In, First Out) principle.
 * This means that the first element added to the queue will be the first one to be removed.
 * 
 * Use cases:
 * - Task scheduling
 * - Breadth-first search (BFS) in graphs/trees
 * - Printer job management
 * - Data buffering (e.g., in streams)
 * 
 * Internally, this queue is implemented using a JavaScript array.
 */
class Queue {
  /**
   * Initializes an empty queue.
   * Time complexity: O(1)
   */
  constructor() {
    this.items = [];
  }

  /**
   * Returns the internal array that stores the queue elements.
   * This is mainly for internal usage or debugging.
   * Time complexity: O(1)
   * 
   * @returns {Array} The array of queued elements.
   */
  getItems() {
    return this.items;
  }

  /**
   * Adds a new element to the back of the queue.
   * Time complexity: O(1) amortized (push operation on an array)
   * 
   * @param {*} element - The element to be added to the queue.
   */
  enqueue(element) {
    this.getItems().push(element);
  }

  /**
   * Removes and returns the element at the front of the queue.
   * If the queue is empty, returns undefined.
   * Time complexity: O(n) because `Array.shift()` moves all remaining elements.
   * 
   * @returns {*} The dequeued element, or undefined if empty.
   */
  dequeue() {
    return this.getItems().shift();
  }

  /**
   * Returns the element at the front of the queue without removing it.
   * If the queue is empty, returns null.
   * Time complexity: O(1)
   * 
   * @returns {*} The first element or null if empty.
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    } else {
      return this.getItems()[0];
    }
  }

  /**
   * Checks if the queue is empty.
   * Time complexity: O(1)
   * 
   * @returns {boolean} True if the queue has no elements, false otherwise.
   */
  isEmpty() {
    return this.getItems().length == 0;
  }

  /**
   * Removes all elements from the queue.
   * Time complexity: O(1)
   */
  clear() {
    this.items = [];
  }

  /**
   * Returns the number of elements in the queue.
   * Time complexity: O(1)
   * 
   * @returns {number} The number of queued elements.
   */
  size() {
    return this.getItems().length;
  }
}

// Example usage:
const q = new Queue();
q.enqueue("A");
q.enqueue("B");
q.enqueue("C");

console.log(q.dequeue()); // Output: "A"
console.log(q.peek());    // Output: "B"
console.log(q.size());    // Output: 2


class Nodo{
    constructor(d){
        this.dato = d;
        this.hijoIzquierdo = null;
        this.hijoDerecho = null;
    }
    setDato(d){
        this.dato = d;
    }
    getDato(){
        return this.dato;
    }
    getHijoIzquierdo(){
        return this.hijoIzquierdo;
    }
    getHijoDerecho(){
        return this.hijoDerecho;
    }
}

class BinaryTree{
      constructor(){
        this.nodo = null;
        this.tamanio = 0;
      }
      getNodo(){
        return this.nodo;
      }
      size(){
        return this.tamanio;
      }
          insertar(n) {
        const nuevo = new Nodo(n);
        if (this.nodo === null) {
            this.nodo = nuevo;
        } else {
            this._insertarRec(this.nodo, nuevo);
        }
        this.tamanio++;
    }

    _insertarRec(actual, nuevo) {
        if (nuevo.getDato() < actual.getDato()) {
            if (actual.getHijoIzquierdo() === null) {
                actual.hijoIzquierdo = nuevo;
            } else {
                this._insertarRec(actual.getHijoIzquierdo(), nuevo);
            }
        } else {
            if (actual.getHijoDerecho() === null) {
                actual.hijoDerecho = nuevo;
            } else {
                this._insertarRec(actual.getHijoDerecho(), nuevo);
            }
        }
    }
    isBinarySearchTree() {
    return this._recEvaluacion(this.getNodo(), -Infinity, Infinity);
}

_recEvaluacion(nodo, min, max) {
    if (nodo == null) return true; // Árbol vacío es válido
    
    if (nodo.getDato() <= min || nodo.getDato() >= max) {
        return false; // fuera de rango
    }
    
    return this._recEvaluacion(nodo.getHijoIzquierdo(), min, nodo.getDato()) &&
           this._recEvaluacion(nodo.getHijoDerecho(), nodo.getDato(), max);
}


}

const arbol = new BinaryTree();
arbol.insertar(10);
arbol.insertar(5);
arbol.insertar(15);
arbol.insertar(12);

console.log("Tamaño:", arbol.size()); // 4
console.log("Raíz:", arbol.getNodo().getDato()); // 10
console.log("Hijo izquierdo:", arbol.getNodo().getHijoIzquierdo().getDato()); // 5
console.log("Hijo derecho:", arbol.getNodo().getHijoDerecho().getDato()); // 15
// 🔹 Probar si es BST
console.log("¿Es BST?:", arbol.isBinarySearchTree()); // true esperado

// 🔹 Caso de prueba que NO sea BST
arbol.getNodo().getHijoIzquierdo().setDato(20); // forzar error
console.log("¿Es BST después de modificar?:", arbol.isBinarySearchTree()); // false esperado


class Vertice{
    constructor(v){
        this.valor = v;
        this.aristas = [];
    }
    getDato(){
        return this.valor;
    }
    getAdy(){
        return this.aristas;
    }
    agregarArista(a){
        this.aristas.push(a);
    }
    conectar(arista){
        this.agregarArista(arista);
    }
    eliminarAristasConectadasA(v){
        for(let i = 0; i< this.getAdy().length;i++){
            if(this.getAdy()[i].getProximo().getDato() == v){
                this.getAdy().splice(i,1);
                i--;
            }
        }
    }
}

class Arista{
    constructor(a, n, peso = 1){
        this.actual = a;
        this.prox = n;
        this.peso = peso; // Agregamos peso para Dijkstra
    }
    getProximo(){
        return this.prox;
    }
    getActual(){
       return this.actual;
    }
    getPeso(){
        return this.peso;
    }
    setPeso(p){
        this.peso = p;
    }
}

// Clase auxiliar para el heap mínimo usado en Dijkstra
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    parent(i) { 
        return Math.floor((i - 1) / 2); 
    }
    
    leftChild(i) { 
        return 2 * i + 1; 
    }
    
    rightChild(i) { 
        return 2 * i + 2; 
    }
    
    swap(i1, i2) {
        [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
    }
    
    insert(item) {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }
    
    heapifyUp(i) {
        if (i === 0) return;
        
        const parentIndex = this.parent(i);
        if (this.heap[parentIndex].distancia > this.heap[i].distancia) {
            this.swap(parentIndex, i);
            this.heapifyUp(parentIndex);
        }
    }
    
    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }
    
    heapifyDown(i) {
        const left = this.leftChild(i);
        const right = this.rightChild(i);
        let smallest = i;
        
        if (left < this.heap.length && this.heap[left].distancia < this.heap[smallest].distancia) {
            smallest = left;
        }
        
        if (right < this.heap.length && this.heap[right].distancia < this.heap[smallest].distancia) {
            smallest = right;
        }
        
        if (smallest !== i) {
            this.swap(i, smallest);
            this.heapifyDown(smallest);
        }
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
}

function todosVisitados(lista){
    for(let i = 0; i<lista.length;i++){
        if(lista[i] == false){
            return false;
        }
    }
    return true;
}

class Graph {
    constructor(){
        this.vertices = [];
        this.aristas = [];
    }
    
    getVertices(){
        return this.vertices;
    }
    
    getAristas(){
        return this.aristas;
    }
    
    agregarVertice(a, n, peso = 1){
        // Agregar origen si no existe
        if (!this.vertices.find(v => v.getDato() === a.getDato())) {
            this.vertices.push(a);
        }
        // Agregar destino si no existe  
        if (!this.vertices.find(v => v.getDato() === n.getDato())) {
            this.vertices.push(n);
        }
        
        let arista = new Arista(a, n, peso);    
        this.aristas.push(arista);     
        a.conectar(arista); 
    }
    
    //this method delete the node with the value v
    eliminar(v){  
        // 1. PRIMERO: Limpiar aristas en TODOS los vértices (mientras B aún existe)
        for(let i = 0; i<this.getVertices().length ;i++){
            this.getVertices()[i].eliminarAristasConectadasA(v);
        }
        
        // 2. SEGUNDO: Eliminar el vértice
        for(let i = 0; i<this.getVertices().length ;i++){
            if(this.getVertices()[i].getDato() == v){
                this.getVertices().splice(i, 1);
                break;
            }       
        }
        
        // 3. TERCERO: Limpiar el array global de aristas
        for(let i=0; i<this.getAristas().length;i++){
            if((this.getAristas()[i].getActual().getDato() == v)||(this.getAristas()[i].getProximo().getDato() == v)){
                this.getAristas().splice(i,1);
                i--;
            }
        }
        console.log(`Vertice de valor ${v} y aristas asociados han sido eliminados`);
    }

    dfs(){
        let visitados = [];
        for(let i = 0; i<this.getVertices().length;i++){
            visitados.push(false);
        }
        for(let i = 0; i<this.getVertices().length; i++){
            this._recursiveDFS(this.getVertices()[i], visitados, this.getVertices().indexOf(this.getVertices()[i]));
        }
    }
    
    _recursiveDFS(vertice, visitados, pos){
        if(visitados[pos] == false){
            console.log(vertice.getDato())
            visitados[pos] = true;
            const adyacentes = vertice.getAdy();
            for(let i = 0; i<adyacentes.length;i++){
                this._recursiveDFS(adyacentes[i].getProximo(), visitados, this.getVertices().indexOf(adyacentes[i].getProximo()));
            }
        }
    }

    bfs(){
        let visitados = [];
        for(let i = 0; i<this.getVertices().length;i++){
            visitados.push(false);
        }
        let q = [];
        q.push(this.getVertices()[0]);
        q.push(null); // Separador después del primer vértice
        
        let nivel = 0;
        while(q.length > 0 || !todosVisitados(visitados)){
            let prox = q.shift();
            if(prox == null && q.length > 0){
                console.log(`Nivel ${nivel} `);
                nivel++;
                q.push(null); // Agregar separador para el siguiente nivel
            }else if(prox == null && q.length == 0 && !todosVisitados(visitados)){
                console.log(`Nivel ${nivel} `);
                nivel = 0; // Reiniciar nivel para nuevo componente
                let n = 0;
                while(visitados[n] == true){
                    n++
                }
                q.push(this.getVertices()[n]);
                q.push(null); // Separador para el nuevo componente
            }
            else{
                if(visitados[this.getVertices().indexOf(prox)] == false){
                    visitados[this.getVertices().indexOf(prox)] = true;
                    console.log(`Vertice ${prox.getDato()}`);
                    for(let i=0;i<prox.getAdy().length;i++){
                        // Solo agregar si no fue visitado aún
                        let adyacente = prox.getAdy()[i].getProximo();
                        if(visitados[this.getVertices().indexOf(adyacente)] == false){
                            q.push(adyacente);
                        }
                    }
                }
            }
        }
    }
    
    // IMPLEMENTACIÓN DE DIJKSTRA
    dijkstra(origen) {
        const distancias = new Map();
        const predecesores = new Map();
        const visitados = new Set();
        const heap = new MinHeap();
        
        // Inicializar distancias
        for (let vertice of this.vertices) {
            const valor = vertice.getDato();
            distancias.set(valor, valor === origen ? 0 : Infinity);
            predecesores.set(valor, null);
        }
        
        // Agregar vértice origen al heap
        heap.insert({ vertice: origen, distancia: 0 });
        
        while (!heap.isEmpty()) {
            const actual = heap.extractMin();
            const verticeActual = actual.vertice;
            
            if (visitados.has(verticeActual)) continue;
            visitados.add(verticeActual);
            
            // Buscar el vértice en nuestro grafo
            const verticeObj = this.vertices.find(v => v.getDato() === verticeActual);
            if (!verticeObj) continue;
            
            // Examinar vecinos
            for (let arista of verticeObj.getAdy()) {
                const vecino = arista.getProximo().getDato();
                const pesoArista = arista.getPeso();
                
                if (visitados.has(vecino)) continue;
                
                const nuevaDistancia = distancias.get(verticeActual) + pesoArista;
                
                if (nuevaDistancia < distancias.get(vecino)) {
                    distancias.set(vecino, nuevaDistancia);
                    predecesores.set(vecino, verticeActual);
                    heap.insert({ vertice: vecino, distancia: nuevaDistancia });
                }
            }
        }
        
        return { distancias, predecesores };
    }
    
    // Método auxiliar para mostrar el camino más corto
    mostrarCaminoMasCorto(origen, destino) {
        const resultado = this.dijkstra(origen);
        const distancias = resultado.distancias;
        const predecesores = resultado.predecesores;
        
        if (distancias.get(destino) === Infinity) {
            console.log(`No hay camino desde ${origen} hasta ${destino}`);
            return;
        }
        
        // Reconstruir el camino
        const camino = [];
        let actual = destino;
        
        while (actual !== null) {
            camino.unshift(actual);
            actual = predecesores.get(actual);
        }
        
        console.log(`Camino más corto de ${origen} a ${destino}:`);
        console.log(`Distancia: ${distancias.get(destino)}`);
        console.log(`Camino: ${camino.join(' → ')}`);
    }
    
    // Método para mostrar todas las distancias mínimas desde un origen
    mostrarTodosLosCaminos(origen) {
        const resultado = this.dijkstra(origen);
        const distancias = resultado.distancias;
        const predecesores = resultado.predecesores;
        
        console.log(`\n=== DIJKSTRA desde ${origen} ===`);
        
        for (let [destino, distancia] of distancias) {
            if (destino === origen) continue;
            
            if (distancia === Infinity) {
                console.log(`${origen} → ${destino}: No hay camino`);
            } else {
                // Reconstruir camino
                const camino = [];
                let actual = destino;
                
                while (actual !== null) {
                    camino.unshift(actual);
                    actual = predecesores.get(actual);
                }
                
                console.log(`${origen} → ${destino}: Distancia ${distancia}, Camino: ${camino.join(' → ')}`);
            }
        }
        console.log(`=== FIN DIJKSTRA ===\n`);
    }
}

//TEST GRAPH CON DIJKSTRA
console.log("========== PRUEBAS CON DIJKSTRA ==========");

// Creamos algunos vértices
const v1 = new Vertice("A");
const v2 = new Vertice("B");
const v3 = new Vertice("C");
const v4 = new Vertice("D");
const v5 = new Vertice("E");
const v6 = new Vertice("F");

const g = new Graph();

// Conectamos los vértices con pesos específicos
g.agregarVertice(v1, v2, 4); // A → B (peso 4)
g.agregarVertice(v1, v3, 2); // A → C (peso 2)
g.agregarVertice(v2, v4, 3); // B → D (peso 3)
g.agregarVertice(v3, v4, 1); // C → D (peso 1)
g.agregarVertice(v3, v5, 5); // C → E (peso 5)
g.agregarVertice(v4, v5, 2); // D → E (peso 2)
g.agregarVertice(v4, v6, 6); // D → F (peso 6)
g.agregarVertice(v5, v6, 1); // E → F (peso 1)

console.log("Lista de vértices y sus conexiones:");
g.getVertices().forEach(v => {
    console.log("- " + v.getDato());
    const adyInfo = v.getAdy().map(a => `${a.getProximo().getDato()}(${a.getPeso()})`).join(", ");
    console.log("  Adyacentes: " + (adyInfo || "ninguno"));
});

console.log("\n--------- TEST DFS ---------");
g.dfs();
console.log("--------- FIN DFS ---------");

console.log("\n----------BFS--------------");
g.bfs();
console.log("----------FIN BFS----------");

// Pruebas de Dijkstra
console.log("\n--------- DIJKSTRA ---------");
g.mostrarTodosLosCaminos("A");

// Casos específicos
g.mostrarCaminoMasCorto("A", "F");
g.mostrarCaminoMasCorto("A", "E");
g.mostrarCaminoMasCorto("B", "F");

console.log("--------- FIN DIJKSTRA ---------");



class Nodito {
    constructor(dato) {
        this.dato = dato;
        this.proximo = null; 
    }
    getDato() {
        return this.dato;
    }
    getProximo() {
        return this.proximo;
    }
}

class LinkedList {
    constructor() {
        this.nodo = null;
    }

    getNodo() {
        return this.nodo;
    }
    
    agregar(dato) {
        if (this.getNodo() == null) {
            const r = new Nodito(dato);
            this.nodo = r;
        } else {
            this.agregarRecursivo(dato, this.getNodo().getProximo(), this.getNodo());
        }
    }

    agregarRecursivo(dato, nod, ant) {
        if (nod == null) {
            const r = new Nodito(dato);
            ant.proximo = r;
        } else {
            this.agregarRecursivo(dato, nod.getProximo(), nod);
        }
    }

    imprimir() {
        if (this.getNodo() != null) {
            console.log(this.getNodo().getDato());
            this.imprimirRec(this.getNodo().getProximo());
        }
    }

    imprimirRec(prox) {
        if (prox != null) {
            console.log(prox.getDato());
            this.imprimirRec(prox.getProximo());
        }
    }
}
let lista = new LinkedList();
lista.agregar(10);
lista.agregar(20);
lista.agregar(30);

console.log("Contenido de la lista:");
lista.imprimir();
