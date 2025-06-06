String.prototype.plus = function (other) {
    let a = this.toString();
    let b = other.toString();

    let result = '';
    let carry = 0;

    
    while (a.length < b.length) a = '0' + a;
    while (b.length < a.length) b = '0' + b;

    // Sumar dígito por dígito desde el final
    for (let i = a.length - 1; i >= 0; i--) {
        const suma = parseInt(a[i]) + parseInt(b[i]) + carry;
        result = (suma % 10) + result;
        carry = Math.floor(suma / 10);
    }

    // Si queda un acarreo final
    if (carry > 0) {
        result = carry + result;
    }

    return result;
};






String.prototype.minus = function (other) {
    let a = this.toString();
    let b = other.toString();

    
    while (a.length < b.length) a = '0' + a;
    while (b.length < a.length) b = '0' + b;

  
    if (a < b) return '0';

    let result = '';
    let borrow = 0;

    // Restar dígito por dígito desde el final
    for (let i = a.length - 1; i >= 0; i--) {
        let digitA = parseInt(a[i]);
        let digitB = parseInt(b[i]) + borrow;

        if (digitA < digitB) {
            digitA += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }

        result = (digitA - digitB) + result;
    }

    // Quitar ceros a la izquierda
    result = result.replace(/^0+/, '');

    return result === '' ? '0' : result;
};






String.prototype.divide = function (other) {
    let dividend = this.toString().replace(/^0+/, '') || "0";
    let divisor = other.toString().replace(/^0+/, '') || "0";

    if (divisor === "0") throw new Error("División por cero");

    // Comparar si dividend < divisor
    if (dividend.length < divisor.length || (dividend.length === divisor.length && dividend < divisor)) {
        return "0";
    }

    let result = "";
    let temp = "";

    for (let i = 0; i < dividend.length; i++) {
        temp += dividend[i];
        temp = temp.replace(/^0+/, '') || "0";

        
        let count = 0;
        while (compare(temp, divisor) >= 0) {
            temp = subtract(temp, divisor);
            count++;
        }

        result += count;
    }

    // Eliminar ceros a la izquierda del resultado
    result = result.replace(/^0+/, '');
    return result === "" ? "0" : result;

    // Función auxiliar para comparar dos strings numéricos
    function compare(a, b) {
        if (a.length !== b.length) return a.length - b.length;
        return a.localeCompare(b);
    }

    // Resta de a - b, con a >= b
    function subtract(a, b) {
        while (b.length < a.length) b = '0' + b;

        let carry = 0, res = '';
        for (let i = a.length - 1; i >= 0; i--) {
            let digitA = parseInt(a[i]);
            let digitB = parseInt(b[i]) + carry;

            if (digitA < digitB) {
                digitA += 10;
                carry = 1;
            } else {
                carry = 0;
            }

            res = (digitA - digitB) + res;
        }

        return res.replace(/^0+/, '') || "0";
    }
};


String.prototype.multiply = function (other) {
    let a = this.toString().replace(/^0+/, '') || "0";
    let b = other.toString().replace(/^0+/, '') || "0";

    if (a === "0" || b === "0") return "0";

    // Resultado con tamaño máximo
    const result = Array(a.length + b.length).fill(0);

    // Multiplicación estilo "primaria" desde el último dígito
    for (let i = a.length - 1; i >= 0; i--) {
        for (let j = b.length - 1; j >= 0; j--) {
            const mul = parseInt(a[i]) * parseInt(b[j]);
            const p1 = i + j, p2 = i + j + 1;
            const sum = mul + result[p2];

            result[p2] = sum % 10;
            result[p1] += Math.floor(sum / 10);
        }
    }

    // Convertir array a string
    while (result[0] === 0) result.shift();
    return result.join('');
};

// Suma
console.log("123456789123456789".plus("987654321987654321")); 
console.log("123456789123456789".plus("90999999999999999999999999999999999999999999")); 
// "1111111111111111110"

// Resta
console.log("1000000000000000000".minus("999999999999999999")); 
console.log("10000000000000000000000000000000000000".minus("999999999999999999")); 
// "1"

// Multiplicación
console.log("123456789".multiply("987654321")); 
// "121932631112635269"

// División
console.log("121932631112635269".divide("123456789")); 
// "987654321"

String.prototype.plus = function (other) {
    let a = this.toString();
    let b = other.toString();

    let result = '';
    let carry = 0;

    
    while (a.length < b.length) a = '0' + a;
    while (b.length < a.length) b = '0' + b;

    // Sumar dígito por dígito desde el final
    for (let i = a.length - 1; i >= 0; i--) {
        const suma = parseInt(a[i]) + parseInt(b[i]) + carry;
        result = (suma % 10) + result;
        carry = Math.floor(suma / 10);
    }

    // Si queda un acarreo final
    if (carry > 0) {
        result = carry + result;
    }

    return result;
};






String.prototype.minus = function (other) {
    let a = this.toString();
    let b = other.toString();

    
    while (a.length < b.length) a = '0' + a;
    while (b.length < a.length) b = '0' + b;

  
    if (a < b) return '0';

    let result = '';
    let borrow = 0;

    // Restar dígito por dígito desde el final
    for (let i = a.length - 1; i >= 0; i--) {
        let digitA = parseInt(a[i]);
        let digitB = parseInt(b[i]) + borrow;

        if (digitA < digitB) {
            digitA += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }

        result = (digitA - digitB) + result;
    }

    // Quitar ceros a la izquierda
    result = result.replace(/^0+/, '');

    return result === '' ? '0' : result;
};






String.prototype.divide = function (other) {
    let dividend = this.toString().replace(/^0+/, '') || "0";
    let divisor = other.toString().replace(/^0+/, '') || "0";

    if (divisor === "0") throw new Error("División por cero");

    // Comparar si dividend < divisor
    if (dividend.length < divisor.length || (dividend.length === divisor.length && dividend < divisor)) {
        return "0";
    }

    let result = "";
    let temp = "";

    for (let i = 0; i < dividend.length; i++) {
        temp += dividend[i];
        temp = temp.replace(/^0+/, '') || "0";

        
        let count = 0;
        while (compare(temp, divisor) >= 0) {
            temp = subtract(temp, divisor);
            count++;
        }

        result += count;
    }

    // Eliminar ceros a la izquierda del resultado
    result = result.replace(/^0+/, '');
    return result === "" ? "0" : result;

    // Función auxiliar para comparar dos strings numéricos
    function compare(a, b) {
        if (a.length !== b.length) return a.length - b.length;
        return a.localeCompare(b);
    }

    // Resta de a - b, con a >= b
    function subtract(a, b) {
        while (b.length < a.length) b = '0' + b;

        let carry = 0, res = '';
        for (let i = a.length - 1; i >= 0; i--) {
            let digitA = parseInt(a[i]);
            let digitB = parseInt(b[i]) + carry;

            if (digitA < digitB) {
                digitA += 10;
                carry = 1;
            } else {
                carry = 0;
            }

            res = (digitA - digitB) + res;
        }

        return res.replace(/^0+/, '') || "0";
    }
};


String.prototype.multiply = function (other) {
    let a = this.toString().replace(/^0+/, '') || "0";
    let b = other.toString().replace(/^0+/, '') || "0";

    if (a === "0" || b === "0") return "0";

    // Resultado con tamaño máximo
    const result = Array(a.length + b.length).fill(0);

    // Multiplicación estilo "primaria" desde el último dígito
    for (let i = a.length - 1; i >= 0; i--) {
        for (let j = b.length - 1; j >= 0; j--) {
            const mul = parseInt(a[i]) * parseInt(b[j]);
            const p1 = i + j, p2 = i + j + 1;
            const sum = mul + result[p2];

            result[p2] = sum % 10;
            result[p1] += Math.floor(sum / 10);
        }
    }

    // Convertir array a string
    while (result[0] === 0) result.shift();
    return result.join('');
};

// Suma
console.log("123456789123456789".plus("987654321987654321")); 
console.log("123456789123456789".plus("90999999999999999999999999999999999999999999")); 
// "1111111111111111110"

// Resta
console.log("1000000000000000000".minus("999999999999999999")); 
console.log("10000000000000000000000000000000000000".minus("999999999999999999")); 
// "1"

// Multiplicación
console.log("123456789".multiply("987654321")); 
// "121932631112635269"

// División
console.log("121932631112635269".divide("123456789")); 
// "987654321"

