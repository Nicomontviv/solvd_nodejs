const { Client } = require('pg');

async function connectToDatabase() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost', // O el que corresponda
    database: 'library',
    password: 'N1C0L45M0N74N4R1i$',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('📦 Conectado a la base de datos "library"');
    return client;
  } catch (err) {
    console.error('❌ Error de conexión:', err);
    throw err;
  }
}

class Book {
    constructor(title, author, year, ISBN, price, id = null) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.ISBN = ISBN;
        this.isAvailable = true;
        this.price = price;
        this.id = id; // null para libros nuevos, valor para libros existentes
    }

    getTitle() {
        return this.title;
    }

    getAuthor() {
        return this.author;
    }

    getYear() {
        return this.year;
    }

    getISBN() {
        return this.ISBN;
    }

    getId() {
        return this.id;
    }

    // Corregido: método vs propiedad
    getAvailability() {
        return this.isAvailable;
    }

    setAvailable(status) {
        this.isAvailable = status;
    }

    getPrice() {
        return this.price;
    }

    setPrice(price) {
        if (price < 0) {
            throw new Error('Price cannot be negative');
        }
        this.price = price;
    }

    getInfo() {
        return `${this.getTitle()} by ${this.getAuthor()}, published in ${this.getYear()}, ISBN: ${this.getISBN()}, Price: $${this.getPrice()}`;
    }

    // Validación básica
    validate() {
        const errors = [];
        
        if (!this.title || this.title.trim().length === 0) {
            errors.push('Title is required');
        }
        
        if (!this.author || this.author.trim().length === 0) {
            errors.push('Author is required');
        }
        
        if (!this.year || this.year < 1000 || this.year > new Date().getFullYear()) {
            errors.push('Valid year is required');
        }
        
        if (!this.ISBN || this.ISBN.trim().length === 0) {
            errors.push('ISBN is required');
        }
        
        if (this.price < 0) {
            errors.push('Price cannot be negative');
        }
        
        return errors;
    }

    async save(client) {
        // Validar antes de guardar
        const validationErrors = this.validate();
        if (validationErrors.length > 0) {
            throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
        }

        try {
            await client.query('BEGIN');

            let sql, values, res;

            if (this.id) {
                // Actualizar libro existente
                sql = `
                    UPDATE books 
                    SET title = $1, author = $2, year = $3, isbn = $4, price = $5, is_available = $6
                    WHERE id = $7 
                    RETURNING id
                `;
                values = [this.title, this.author, this.year, this.ISBN, this.price, this.isAvailable, this.id];
            } else {
                // Crear nuevo libro
                sql = `
                    INSERT INTO books (title, author, year, isbn, price, is_available)
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
                `;
                values = [this.title, this.author, this.year, this.ISBN, this.price, this.isAvailable];
            }

            res = await client.query(sql, values);

            if (res.rows.length === 0) {
                throw new Error('Failed to save book');
            }

            await client.query('COMMIT');

            // Asignar ID si es un libro nuevo
            if (!this.id) {
                this.id = res.rows[0].id;
            }

            return this.id;
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error saving book:', err);
            throw err;
        }
    }

    // Método estático para cargar libro por ID
    static async loadById(client, id) {
        try {
            const sql = `
                SELECT id, title, author, year, isbn, price, is_available
                FROM books 
                WHERE id = $1
            `;
            const res = await client.query(sql, [id]);

            if (res.rows.length === 0) {
                return null;
            }

            const bookData = res.rows[0];
            const book = new Book(
                bookData.title,
                bookData.author,
                bookData.year,
                bookData.isbn,
                bookData.price,
                bookData.id
            );
            book.isAvailable = bookData.is_available;

            return book;
        } catch (err) {
            console.error('Error loading book by ID:', err);
            throw err;
        }
    }

    // Método estático para buscar libros por título
    static async searchByTitle(client, title) {
        try {
            const sql = `
                SELECT id, title, author, year, isbn, price, is_available
                FROM books 
                WHERE title ILIKE $1
                ORDER BY title
            `;
            const res = await client.query(sql, [`%${title}%`]);

            return res.rows.map(row => {
                const book = new Book(
                    row.title,
                    row.author,
                    row.year,
                    row.isbn,
                    row.price,
                    row.id
                );
                book.isAvailable = row.is_available;
                return book;
            });
        } catch (err) {
            console.error('Error searching books by title:', err);
            throw err;
        }
    }

    // Método estático para obtener libros disponibles
    static async getAvailableBooks(client) {
        try {
            const sql = `
                SELECT id, title, author, year, isbn, price, is_available
                FROM books 
                WHERE is_available = true
                ORDER BY title
            `;
            const res = await client.query(sql);

            return res.rows.map(row => {
                const book = new Book(
                    row.title,
                    row.author,
                    row.year,
                    row.isbn,
                    row.price,
                    row.id
                );
                book.isAvailable = row.is_available;
                return book;
            });
        } catch (err) {
            console.error('Error getting available books:', err);
            throw err;
        }
    }
}

class FictionBook extends Book {
    constructor(title, author, year, ISBN, price, genre, id = null) {
        super(title, author, year, ISBN, price, id);
        this.genre = genre;
    }

    getGenre() {
        return this.genre;
    }

    setGenre(genre) {
        this.genre = genre;
    }

    getInfo() {
        return `${super.getInfo()}, Genre: ${this.getGenre()}`;
    }

    // Validación extendida
    validate() {
        const errors = super.validate();
        
        if (!this.genre || this.genre.trim().length === 0) {
            errors.push('Genre is required for fiction books');
        }
        
        return errors;
    }

    async save(client) {
        // Validar antes de guardar
        const validationErrors = this.validate();
        if (validationErrors.length > 0) {
            throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
        }

        try {
            await client.query('BEGIN');

            // Guardar en books primero
            await super.save(client);

            // Verificar si ya existe en fiction_books
            const checkSql = `
                SELECT book_id FROM fiction_books WHERE book_id = $1
            `;
            const checkRes = await client.query(checkSql, [this.id]);

            if (checkRes.rows.length === 0) {
                // Insertar en fiction_books
                const sql = `
                    INSERT INTO fiction_books (book_id, genre)
                    VALUES ($1, $2)
                `;
                await client.query(sql, [this.id, this.genre]);
            } else {
                // Actualizar en fiction_books
                const sql = `
                    UPDATE fiction_books 
                    SET genre = $1 
                    WHERE book_id = $2
                `;
                await client.query(sql, [this.genre, this.id]);
            }

            await client.query('COMMIT');

            return this.id;
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error saving fiction book:', err);
            throw err;
        }
    }

    // Método estático para cargar libro de ficción por ID
    static async loadById(client, id) {
        try {
            const sql = `
                SELECT b.id, b.title, b.author, b.year, b.isbn, b.price, b.is_available, f.genre
                FROM books b
                JOIN fiction_books f ON b.id = f.book_id
                WHERE b.id = $1
            `;
            const res = await client.query(sql, [id]);

            if (res.rows.length === 0) {
                return null;
            }

            const bookData = res.rows[0];
            const book = new FictionBook(
                bookData.title,
                bookData.author,
                bookData.year,
                bookData.isbn,
                bookData.price,
                bookData.genre,
                bookData.id
            );
            book.isAvailable = bookData.is_available;

            return book;
        } catch (err) {
            console.error('Error loading fiction book by ID:', err);
            throw err;
        }
    }

    // Método estático para buscar por género
    static async searchByGenre(client, genre) {
        try {
            const sql = `
                SELECT b.id, b.title, b.author, b.year, b.isbn, b.price, b.is_available, f.genre
                FROM books b
                JOIN fiction_books f ON b.id = f.book_id
                WHERE f.genre ILIKE $1
                ORDER BY b.title
            `;
            const res = await client.query(sql, [`%${genre}%`]);

            return res.rows.map(row => {
                const book = new FictionBook(
                    row.title,
                    row.author,
                    row.year,
                    row.isbn,
                    row.price,
                    row.genre,
                    row.id
                );
                book.isAvailable = row.is_available;
                return book;
            });
        } catch (err) {
            console.error('Error searching fiction books by genre:', err);
            throw err;
        }
    }
}

class NonFictionBook extends Book {
    constructor(title, author, year, ISBN, price, subject, id = null) {
        super(title, author, year, ISBN, price, id);
        this.subject = subject;
    }

    getSubject() {
        return this.subject;
    }

    setSubject(subject) {
        this.subject = subject;
    }

    getInfo() {
        return `${super.getInfo()}, Subject: ${this.getSubject()}`;
    }

    // Validación extendida
    validate() {
        const errors = super.validate();
        
        if (!this.subject || this.subject.trim().length === 0) {
            errors.push('Subject is required for non-fiction books');
        }
        
        return errors;
    }

    async save(client) {
        // Validar antes de guardar
        const validationErrors = this.validate();
        if (validationErrors.length > 0) {
            throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
        }

        try {
            await client.query('BEGIN');

            // Guardar en books primero
            await super.save(client);

            // Verificar si ya existe en non_fiction_books
            const checkSql = `
                SELECT book_id FROM non_fiction_books WHERE book_id = $1
            `;
            const checkRes = await client.query(checkSql, [this.id]);

            if (checkRes.rows.length === 0) {
                // Insertar en non_fiction_books
                const sql = `
                    INSERT INTO non_fiction_books (book_id, subject)
                    VALUES ($1, $2)
                `;
                await client.query(sql, [this.id, this.subject]);
            } else {
                // Actualizar en non_fiction_books
                const sql = `
                    UPDATE non_fiction_books 
                    SET subject = $1 
                    WHERE book_id = $2
                `;
                await client.query(sql, [this.subject, this.id]);
            }

            await client.query('COMMIT');

            return this.id;
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error saving non-fiction book:', err);
            throw err;
        }
    }

    // Método estático para cargar libro de no ficción por ID
    static async loadById(client, id) {
        try {
            const sql = `
                SELECT b.id, b.title, b.author, b.year, b.isbn, b.price, b.is_available, nf.subject
                FROM books b
                JOIN non_fiction_books nf ON b.id = nf.book_id
                WHERE b.id = $1
            `;
            const res = await client.query(sql, [id]);

            if (res.rows.length === 0) {
                return null;
            }

            const bookData = res.rows[0];
            const book = new NonFictionBook(
                bookData.title,
                bookData.author,
                bookData.year,
                bookData.isbn,
                bookData.price,
                bookData.subject,
                bookData.id
            );
            book.isAvailable = bookData.is_available;

            return book;
        } catch (err) {
            console.error('Error loading non-fiction book by ID:', err);
            throw err;
        }
    }

    // Método estático para buscar por materia
    static async searchBySubject(client, subject) {
        try {
            const sql = `
                SELECT b.id, b.title, b.author, b.year, b.isbn, b.price, b.is_available, nf.subject
                FROM books b
                JOIN non_fiction_books nf ON b.id = nf.book_id
                WHERE nf.subject ILIKE $1
                ORDER BY b.title
            `;
            const res = await client.query(sql, [`%${subject}%`]);

            return res.rows.map(row => {
                const book = new NonFictionBook(
                    row.title,
                    row.author,
                    row.year,
                    row.isbn,
                    row.price,
                    row.subject,
                    row.id
                );
                book.isAvailable = row.is_available;
                return book;
            });
        } catch (err) {
            console.error('Error searching non-fiction books by subject:', err);
            throw err;
        }
    }
}   



class User {
    constructor(name, email, id = null) {
        this.name = name;
        this.email = email;
        this.id = id; // null para usuarios nuevos, valor para usuarios existentes
    }

    getName() {
        return this.name;
    }

    getEmail() {
        return this.email;
    }

    getId() {
        return this.id;
    }

    setName(name) {
        this.name = name;
    }

    setEmail(email) {
        this.email = email;
    }

    getInfo() {
        return `User: ${this.getName()}, Email: ${this.getEmail()}, ID: ${this.getId()}`;
    }

    // Validar email básico
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar datos del usuario
    validate() {
        const errors = [];
        
        if (!this.name || this.name.trim().length === 0) {
            errors.push('Name is required');
        }
        
        if (!this.email || !User.isValidEmail(this.email)) {
            errors.push('Valid email is required');
        }
        
        return errors;
    }

    async save(client) {
        // Validar antes de guardar
        const validationErrors = this.validate();
        if (validationErrors.length > 0) {
            throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
        }

        try {
            await client.query('BEGIN');

            let sql, values, res;

            if (this.id) {
                // Actualizar usuario existente
                sql = `
                    UPDATE users 
                    SET name = $1, email = $2 
                    WHERE id = $3 
                    RETURNING id
                `;
                values = [this.name, this.email, this.id];
            } else {
                // Crear nuevo usuario
                sql = `
                    INSERT INTO users (name, email)
                    VALUES ($1, $2) RETURNING id
                `;
                values = [this.name, this.email];
            }

            res = await client.query(sql, values);

            if (res.rows.length === 0) {
                throw new Error('Failed to save user');
            }

            await client.query('COMMIT');

            // Asignar ID si es un usuario nuevo
            if (!this.id) {
                this.id = res.rows[0].id;
            }

            return this.id;
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error saving user:', err);
            throw err;
        }
    }

    // Método estático para cargar usuario por ID
    static async loadById(client, id) {
        try {
            const sql = `
                SELECT id, name, email 
                FROM users 
                WHERE id = $1
            `;
            const res = await client.query(sql, [id]);

            if (res.rows.length === 0) {
                return null;
            }

            const userData = res.rows[0];
            return new User(userData.name, userData.email, userData.id);
        } catch (err) {
            console.error('Error loading user by ID:', err);
            throw err;
        }
    }

    // Método estático para cargar usuario por email
    static async loadByEmail(client, email) {
        try {
            const sql = `
                SELECT id, name, email 
                FROM users 
                WHERE email = $1
            `;
            const res = await client.query(sql, [email]);

            if (res.rows.length === 0) {
                return null;
            }

            const userData = res.rows[0];
            return new User(userData.name, userData.email, userData.id);
        } catch (err) {
            console.error('Error loading user by email:', err);
            throw err;
        }
    }

    // Método estático para obtener todos los usuarios
    static async getAllUsers(client) {
        try {
            const sql = `
                SELECT id, name, email 
                FROM users 
                ORDER BY name
            `;
            const res = await client.query(sql);

            return res.rows.map(row => 
                new User(row.name, row.email, row.id)
            );
        } catch (err) {
            console.error('Error getting all users:', err);
            throw err;
        }
    }

    // Método para verificar si el email ya existe (útil para validación)
    static async emailExists(client, email, excludeId = null) {
        try {
            let sql = `
                SELECT id FROM users WHERE email = $1
            `;
            let values = [email];

            if (excludeId) {
                sql += ` AND id != $2`;
                values.push(excludeId);
            }

            const res = await client.query(sql, values);
            return res.rows.length > 0;
        } catch (err) {
            console.error('Error checking email existence:', err);
            throw err;
        }
    }

    // Método para eliminar usuario
    async delete(client) {
        if (!this.id) {
            throw new Error('Cannot delete user that hasn\'t been saved');
        }

        try {
            await client.query('BEGIN');

            // Verificar si tiene órdenes asociadas
            const orderCheckSql = `
                SELECT COUNT(*) as count FROM orders WHERE user_id = $1
            `;
            const orderCheck = await client.query(orderCheckSql, [this.id]);
            
            if (parseInt(orderCheck.rows[0].count) > 0) {
                throw new Error('Cannot delete user with existing orders');
            }

            // Eliminar carritos asociados
            const deleteCartBooksSql = `
                DELETE FROM cart_books 
                WHERE cart_id IN (
                    SELECT id FROM carts WHERE user_id = $1
                )
            `;
            await client.query(deleteCartBooksSql, [this.id]);

            const deleteCartsSql = `
                DELETE FROM carts WHERE user_id = $1
            `;
            await client.query(deleteCartsSql, [this.id]);

            // Eliminar usuario
            const deleteUserSql = `
                DELETE FROM users WHERE id = $1
            `;
            await client.query(deleteUserSql, [this.id]);

            await client.query('COMMIT');

            // Limpiar ID local
            this.id = null;

            console.log(`User ${this.name} has been deleted.`);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error deleting user:', err);
            throw err;
        }
    }

    // Método para obtener el historial de órdenes del usuario
    async getOrderHistory(client) {
        if (!this.id) {
            throw new Error('User must be saved before getting order history');
        }

        try {
            return await Order.getUserOrders(client, this.id);
        } catch (err) {
            console.error('Error getting order history:', err);
            throw err;
        }
    }

    // Método para obtener el carrito actual del usuario
    async getCurrentCart(client) {
        if (!this.id) {
            throw new Error('User must be saved before getting cart');
        }

        try {
            return await Cart.loadFromDatabase(client, this.id);
        } catch (err) {
            console.error('Error getting current cart:', err);
            throw err;
        }
    }

    // Método toString para debugging
    toString() {
        return this.getInfo();
    }
}

class Cart {
    constructor(user) {
        this.user = user;
        this.userId = user.id || user; // Acepta objeto user o solo el ID
        this.books = [];
        this.id = null; // Se asignará cuando se guarde en la BD
    }

    getUser() {
        return this.user;
    }

    getBooks() {
        return this.books;
    }

    getId() {
        return this.id;
    }

    // Método para asegurar que el carrito existe en la BD
    async ensureCartExists(client) {
        if (this.id) {
            return this.id;
        }
        
        try {
            await client.query('BEGIN');
            
            const sqlCart = `
                INSERT INTO carts (user_id)
                VALUES ($1) RETURNING id
            `;
            const resCart = await client.query(sqlCart, [this.userId]);
            this.id = resCart.rows[0].id;
            
            await client.query('COMMIT');
            return this.id;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
    }

    async addBook(client, book) {
        if (!book.isAvailable) {
            console.log(`${book.getTitle()} is not available.`);
            return;
        }

        // Verificar si el libro ya está en el carrito
        if (this.books.some(b => b.id === book.id)) {
            console.log(`${book.getTitle()} is already in the cart.`);
            return;
        }

        try {
            // Asegurar que el carrito existe en la BD
            await this.ensureCartExists(client);

            await client.query('BEGIN');

            // 1. Insertar relación en cart_books
            const insertSql = `
                INSERT INTO cart_books (cart_id, book_id)
                VALUES ($1, $2)
            `;
            await client.query(insertSql, [this.id, book.id]);

            // 2. Marcar el libro como no disponible
            const updateBookSql = `
                UPDATE books SET is_available = false WHERE id = $1
            `;
            await client.query(updateBookSql, [book.id]);

            await client.query('COMMIT');

            // 3. Actualizar estado en memoria solo después del commit exitoso
            this.books.push(book);
            book.setAvailable(false);

            console.log(`${book.getTitle()} has been added to the cart.`);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error adding book to cart:', err);
            throw err;
        }
    }

    async removeBook(client, book) {
        const index = this.getBooks().findIndex(b => b.id === book.id);
        if (index === -1) {
            console.log(`${book.getTitle()} is not in the cart.`);
            return;
        }

        try {
            await client.query('BEGIN');

            // 1. Eliminar la relación en la tabla cart_books
            const deleteSql = `
                DELETE FROM cart_books
                WHERE cart_id = $1 AND book_id = $2
            `;
            await client.query(deleteSql, [this.id, book.id]);

            // 2. Marcar el libro como disponible de nuevo
            const updateBookSql = `
                UPDATE books SET is_available = true WHERE id = $1
            `;
            await client.query(updateBookSql, [book.id]);

            await client.query('COMMIT');

            // 3. Actualizar el estado en memoria solo después del commit exitoso
            this.books.splice(index, 1);
            book.setAvailable(true);

            console.log(`${book.getTitle()} has been removed from the cart.`);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error removing book from cart:', err);
            throw err;
        }
    }

    viewCart() {
        if (this.getBooks().length === 0) {
            console.log("Your cart is empty.");
        } else {
            console.log("Books in your cart:");
            this.getBooks().forEach(book => console.log(book.getInfo()));
        }
    }

    // Método para guardar el carrito (si no existe ya)
    async save(client) {
        return await this.ensureCartExists(client);
    }

    // Método para cargar un carrito existente desde la BD
    static async loadFromDatabase(client, userId) {
        try {
            // Buscar el carrito del usuario
            const cartSql = `
                SELECT id FROM carts WHERE user_id = $1
            `;
            const cartResult = await client.query(cartSql, [userId]);
            
            if (cartResult.rows.length === 0) {
                return null; // No hay carrito para este usuario
            }

            const cartId = cartResult.rows[0].id;

            // Obtener los libros del carrito
            const booksSql = `
                SELECT b.* FROM books b
                JOIN cart_books cb ON b.id = cb.book_id
                WHERE cb.cart_id = $1
            `;
            const booksResult = await client.query(booksSql, [cartId]);

            // Crear el carrito y asignar los datos
            const cart = new Cart(userId);
            cart.id = cartId;
            cart.books = booksResult.rows; // Asumiendo que tienes objetos Book

            return cart;
        } catch (err) {
            console.error('Error loading cart from database:', err);
            throw err;
        }
    }

    // Método para limpiar el carrito
    async clear(client) {
        if (!this.id) {
            this.books = [];
            return;
        }

        try {
            await client.query('BEGIN');

            // Marcar todos los libros como disponibles
            const updateBooksSql = `
                UPDATE books SET is_available = true
                WHERE id IN (
                    SELECT book_id FROM cart_books WHERE cart_id = $1
                )
            `;
            await client.query(updateBooksSql, [this.id]);

            // Eliminar todas las relaciones del carrito
            const deleteCartBooksSql = `
                DELETE FROM cart_books WHERE cart_id = $1
            `;
            await client.query(deleteCartBooksSql, [this.id]);

            await client.query('COMMIT');

            // Actualizar estado en memoria
            this.books.forEach(book => book.setAvailable(true));
            this.books = [];

            console.log('Cart has been cleared.');
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error clearing cart:', err);
            throw err;
        }
    }
}

class Order {
    constructor(user, cart) {
        this.user = user;
        this.cart = cart;
        this.orderDate = new Date();
        this.id = null;
        // Propiedades derivadas para consistencia
        this.userId = user.id || user;
        this.cartId = cart.id || cart;
    }

    getUser() {
        return this.user;
    }

    getCart() {
        return this.cart;
    }

    getOrderDate() {
        return this.orderDate;
    }

    getId() {
        return this.id;
    }

    getInfo() {
        // Corregido: viewCart() ya hace console.log, no necesita otro console.log
        this.getCart().viewCart();
        return `Order for ${this.getUser().getName()} on ${this.getOrderDate().toLocaleDateString()}`;
    }

    getTotalAmount() {
        return this.getCart().getBooks().reduce((total, book) => total + book.getPrice(), 0);
    }

    // Método para obtener un resumen detallado del pedido
    getOrderSummary() {
        const books = this.getCart().getBooks();
        const total = this.getTotalAmount();
        
        return {
            orderId: this.id,
            user: this.getUser().getName(),
            date: this.getOrderDate().toLocaleDateString(),
            books: books.map(book => ({
                title: book.getTitle(),
                price: book.getPrice(),
                info: book.getInfo()
            })),
            totalBooks: books.length,
            totalAmount: total
        };
    }

    async save(client) {
        try {
            // Asegurar que el carrito existe en la BD
            if (!this.cart.id) {
                await this.cart.save(client);
                this.cartId = this.cart.id;
            }

            await client.query('BEGIN');

            const sql = `
                INSERT INTO orders (user_id, cart_id, order_date, total_amount)
                VALUES ($1, $2, $3, $4) RETURNING id
            `;
            const values = [
                this.userId, 
                this.cartId, 
                this.orderDate, 
                this.getTotalAmount()
            ];
            const res = await client.query(sql, values);

            this.id = res.rows[0].id;

            await client.query('COMMIT');

            return this.id;
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error saving order:', err);
            throw err;
        }
    }

    // Método estático para cargar una orden desde la BD
    static async loadFromDatabase(client, orderId) {
        try {
            const orderSql = `
                SELECT o.*, u.name as user_name 
                FROM orders o
                JOIN users u ON o.user_id = u.id
                WHERE o.id = $1
            `;
            const orderResult = await client.query(orderSql, [orderId]);

            if (orderResult.rows.length === 0) {
                return null;
            }

            const orderData = orderResult.rows[0];

            // Cargar el carrito asociado
            const cart = await Cart.loadFromDatabase(client, orderData.user_id);
            
            if (!cart) {
                throw new Error(`Cart not found for order ${orderId}`);
            }

            // Crear la orden
            const order = new Order(
                { id: orderData.user_id, name: orderData.user_name }, 
                cart
            );
            
            order.id = orderData.id;
            order.orderDate = new Date(orderData.order_date);

            return order;
        } catch (err) {
            console.error('Error loading order from database:', err);
            throw err;
        }
    }

    // Método para obtener todas las órdenes de un usuario
    static async getUserOrders(client, userId) {
        try {
            const sql = `
                SELECT o.*, u.name as user_name
                FROM orders o
                JOIN users u ON o.user_id = u.id
                WHERE o.user_id = $1
                ORDER BY o.order_date DESC
            `;
            const result = await client.query(sql, [userId]);

            const orders = [];
            for (const row of result.rows) {
                const cart = await Cart.loadFromDatabase(client, row.user_id);
                const order = new Order(
                    { id: row.user_id, name: row.user_name },
                    cart
                );
                order.id = row.id;
                order.orderDate = new Date(row.order_date);
                orders.push(order);
            }

            return orders;
        } catch (err) {
            console.error('Error getting user orders:', err);
            throw err;
        }
    }

    // Método para cancelar una orden (si es necesario)
    async cancel(client) {
        if (!this.id) {
            throw new Error('Cannot cancel an order that hasn\'t been saved');
        }

        try {
            await client.query('BEGIN');

            // Marcar libros como disponibles nuevamente
            const updateBooksSql = `
                UPDATE books SET is_available = true
                WHERE id IN (
                    SELECT book_id FROM cart_books 
                    WHERE cart_id = $1
                )
            `;
            await client.query(updateBooksSql, [this.cartId]);

            // Eliminar la orden
            const deleteOrderSql = `
                DELETE FROM orders WHERE id = $1
            `;
            await client.query(deleteOrderSql, [this.id]);

            await client.query('COMMIT');

            // Actualizar estado en memoria
            this.cart.getBooks().forEach(book => book.setAvailable(true));
            
            console.log(`Order ${this.id} has been cancelled.`);
            
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error cancelling order:', err);
            throw err;
        }
    }

    // Método para mostrar el resumen de la orden
    displayOrderSummary() {
        const summary = this.getOrderSummary();
        console.log('\n--- ORDER SUMMARY ---');
        console.log(`Order ID: ${summary.orderId || 'Not saved yet'}`);
        console.log(`Customer: ${summary.user}`);
        console.log(`Date: ${summary.date}`);
        console.log(`Total Books: ${summary.totalBooks}`);
        console.log(`Total Amount: $${summary.totalAmount.toFixed(2)}`);
        console.log('\nBooks:');
        summary.books.forEach((book, index) => {
            console.log(`${index + 1}. ${book.title} - $${book.price.toFixed(2)}`);
        });
        console.log('-------------------\n');
    }
}


class Library {
    constructor() {
        this.books = [];
        this.users = [];
        this.orders = [];
    }
    getBooks(){
        return this.books;
    }
    getUsers(){
        return this.users;
    }
    getOrders(){
        return this.orders;
    }

    async addBook(client, book) {
  this.books.push(book);
  await book.save(client);
  console.log(`${book.getTitle()} has been added to the library.`);
}

    async registerUser(client, user) {
  this.getUsers().push(user);
  await user.save(client);
  console.log(`${user.getName()} has been registered.`);
}

    createOrder(client, user, cart) {
        const order = new Order(user, cart);
        this.getOrders().push(order);
        order.save(client);
        console.log(order.getInfo());
    }
    showOrders() {
        console.log("Library Orders:");
        this.getOrders().forEach(order => console.log(order.getInfo()));
    }   

}


//EJECUCION 
//EJECUCION 
async function main() {
  const client = await connectToDatabase();

  try {
    // Crear usuarios
    const user1 = new User("Alice", "alice@user.com");
    const user2 = new User("Bob", "bob@user.com");
    const library = new Library();

    // Registrar usuarios
    await library.registerUser(client, user1);
    await library.registerUser(client, user2);

    // Crear libros con parámetros en el orden correcto
    // Constructor: (title, author, year, ISBN, price, genre/subject, id)
    const book1 = new FictionBook("1984", "George Orwell", 1949, "1234567890", 3000, "Dystopian");
    const book2 = new NonFictionBook("Sapiens", "Yuval Noah Harari", 2011, "0987654321", 10000, "History");
    const book3 = new FictionBook("The Great Gatsby", "F. Scott Fitzgerald", 1925, "1122334455", 5000, "Classic");

    // Agregar libros a la biblioteca
    await library.addBook(client, book1);
    await library.addBook(client, book2);
    await library.addBook(client, book3);

    // Crear carritos y agregar libros
    const cart1 = new Cart(user1);
    await cart1.addBook(client, book1);
    await cart1.addBook(client, book2);

    const cart2 = new Cart(user2);
    await cart2.addBook(client, book3);

    // Mostrar contenido de los carritos
    console.log("\n--- CART 1 (Alice) ---");
    cart1.viewCart();
    
    console.log("\n--- CART 2 (Bob) ---");
    cart2.viewCart();

    // Crear órdenes (con await agregado)
    console.log("\n--- CREATING ORDERS ---");
    const order1 = await library.createOrder(client, user1, cart1);
    const order2 = await library.createOrder(client, user2, cart2);

    // Mostrar resumen de órdenes
    console.log("\n--- ORDER SUMMARIES ---");
    if (order1) order1.displayOrderSummary();
    if (order2) order2.displayOrderSummary();

    // Mostrar todas las órdenes de la biblioteca
    console.log("\n--- ALL LIBRARY ORDERS ---");
    library.showOrders();

    // Ejemplo de búsqueda de libros
    console.log("\n--- SEARCHING BOOKS ---");
    const fictionBooks = await FictionBook.searchByGenre(client, "Dystopian");
    console.log("Fiction books found:", fictionBooks.map(book => book.getTitle()));

    const historyBooks = await NonFictionBook.searchBySubject(client, "History");
    console.log("History books found:", historyBooks.map(book => book.getTitle()));

    // Ejemplo de búsqueda de usuarios
    console.log("\n--- USER INFORMATION ---");
    const allUsers = await User.getAllUsers(client);
    console.log("All users:", allUsers.map(user => user.getInfo()));

    // Ejemplo de historial de órdenes de un usuario
    console.log("\n--- USER ORDER HISTORY ---");
    const user1Orders = await user1.getOrderHistory(client);
    console.log(`${user1.getName()}'s order history:`, user1Orders.length, "orders");

  } catch (error) {
    console.error('Error in main execution:', error);
  } finally {
    // Cerrar conexión
    await client.end();
    console.log("\n📦 Database connection closed.");
  }
}

// Función auxiliar para demostrar más funcionalidades
async function demonstrateAdvancedFeatures() {
  const client = await connectToDatabase();

  try {
    console.log("\n=== ADVANCED FEATURES DEMO ===");

    // Cargar un usuario existente
    const existingUser = await User.loadByEmail(client, "alice@user.com");
    if (existingUser) {
      console.log("Loaded user:", existingUser.getInfo());
      
      // Obtener su carrito actual
      const currentCart = await existingUser.getCurrentCart(client);
      if (currentCart) {
        console.log("Current cart has", currentCart.getBooks().length, "books");
      }
    }

    // Cargar un libro específico
    const loadedBook = await Book.loadById(client, 1);
    if (loadedBook) {
      console.log("Loaded book:", loadedBook.getInfo());
    }

    // Buscar libros por título
    const searchResults = await Book.searchByTitle(client, "1984");
    console.log("Search results for '1984':", searchResults.length, "books found");

    // Obtener libros disponibles
    const availableBooks = await Book.getAvailableBooks(client);
    console.log("Available books:", availableBooks.length);

    // Ejemplo de manejo de errores - intentar crear un libro inválido
    try {
      const invalidBook = new Book("", "", 0, "", -100);
      await invalidBook.save(client);
    } catch (error) {
      console.log("Validation error caught:", error.message);
    }

    // Ejemplo de verificación de email duplicado
    const emailExists = await User.emailExists(client, "alice@user.com");
    console.log("Email alice@user.com exists:", emailExists);

  } catch (error) {
    console.error('Error in advanced features demo:', error);
  } finally {
    await client.end();
  }
}

// Ejecutar el programa principal
main().catch(console.error);

// Descomentar la siguiente línea para ejecutar la demo de funcionalidades avanzadas
// demonstrateAdvancedFeatures().catch(console.error);