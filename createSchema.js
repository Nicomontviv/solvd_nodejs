const { Client } = require('pg');

// Configuración de la base de datos usando variables de entorno
const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'library',
  password: process.env.DB_PASSWORD || 'N1C0L45M0N74N4R1i$',
  port: process.env.DB_PORT || 5432,
});

async function createSchema() {
  try {
    await client.connect();
    console.log('📦 Conectado a PostgreSQL');

    // Tabla base: books
    await client.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        year INT NOT NULL CHECK (year > 0),
        isbn TEXT UNIQUE NOT NULL,
        price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla: fiction_books
    await client.query(`
      CREATE TABLE IF NOT EXISTS fiction_books (
        book_id INTEGER PRIMARY KEY REFERENCES books(id) ON DELETE CASCADE,
        genre TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla: non_fiction_books
    await client.query(`
      CREATE TABLE IF NOT EXISTS non_fiction_books (
        book_id INTEGER PRIMARY KEY REFERENCES books(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla: users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla: carts
    await client.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Muchos a muchos: cart_books
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart_books (
        cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (cart_id, book_id)
      );
    `);

    // Tabla: orders (corregida con los campos que usa el código)
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
        order_date TIMESTAMP DEFAULT NOW(),
        total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla: libraries
    await client.query(`
      CREATE TABLE IF NOT EXISTS libraries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT,
        phone TEXT,
        email TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Relación: library_books
    await client.query(`
      CREATE TABLE IF NOT EXISTS library_books (
        library_id INTEGER REFERENCES libraries(id) ON DELETE CASCADE,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (library_id, book_id)
      );
    `);

    // Relación: library_users
    await client.query(`
      CREATE TABLE IF NOT EXISTS library_users (
        library_id INTEGER REFERENCES libraries(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        registration_date TIMESTAMP DEFAULT NOW(),
        membership_type TEXT DEFAULT 'basic',
        PRIMARY KEY (library_id, user_id)
      );
    `);

    // Relación: library_orders
    await client.query(`
      CREATE TABLE IF NOT EXISTS library_orders (
        library_id INTEGER REFERENCES libraries(id) ON DELETE CASCADE,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        processed_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (library_id, order_id)
      );
    `);

    // Crear índices para mejorar el rendimiento
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
      CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
      CREATE INDEX IF NOT EXISTS idx_books_available ON books(is_available);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
      CREATE INDEX IF NOT EXISTS idx_cart_books_cart_id ON cart_books(cart_id);
      CREATE INDEX IF NOT EXISTS idx_cart_books_book_id ON cart_books(book_id);
      CREATE INDEX IF NOT EXISTS idx_fiction_books_genre ON fiction_books(genre);
      CREATE INDEX IF NOT EXISTS idx_non_fiction_books_subject ON non_fiction_books(subject);
    `);

    // Crear función para actualizar timestamps
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Crear triggers para actualizar timestamps automáticamente
    await client.query(`
      CREATE TRIGGER IF NOT EXISTS update_books_updated_at 
        BEFORE UPDATE ON books 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      CREATE TRIGGER IF NOT EXISTS update_libraries_updated_at 
        BEFORE UPDATE ON libraries 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      CREATE TRIGGER IF NOT EXISTS update_carts_updated_at 
        BEFORE UPDATE ON carts 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);

    // Insertar datos de ejemplo si no existen
    await client.query(`
      INSERT INTO libraries (name, address, phone, email)
      SELECT 'Central Library', '123 Main St', '555-0123', 'info@centrallibrary.com'
      WHERE NOT EXISTS (SELECT 1 FROM libraries WHERE name = 'Central Library');
    `);

    console.log('✅ Esquema completo creado correctamente.');
    console.log('📊 Índices creados para mejorar el rendimiento.');
    console.log('🔄 Triggers creados para timestamps automáticos.');
    console.log('📚 Datos de ejemplo insertados.');

  } catch (err) {
    console.error('❌ Error:', err);
    console.error('Stack trace:', err.stack);
  } finally {
    await client.end();
    console.log('🛑 Conexión cerrada.');
  }
}

// Función para resetear la base de datos (útil para desarrollo)
async function resetSchema() {
  try {
    await client.connect();
    console.log('📦 Conectado a PostgreSQL para resetear esquema');

    // Eliminar tablas en orden inverso para evitar errores de foreign key
    const tables = [
      'library_orders',
      'library_users', 
      'library_books',
      'cart_books',
      'orders',
      'carts',
      'fiction_books',
      'non_fiction_books',
      'books',
      'users',
      'libraries'
    ];

    for (const table of tables) {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
      console.log(`🗑️ Tabla ${table} eliminada`);
    }

    // Eliminar función si existe
    await client.query(`DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;`);
    console.log('🗑️ Función update_updated_at_column eliminada');

    console.log('✅ Esquema reseteado correctamente.');

  } catch (err) {
    console.error('❌ Error reseteando esquema:', err);
  } finally {
    await client.end();
    console.log('🛑 Conexión cerrada.');
  }
}

// Función para verificar el estado de las tablas
async function checkTables() {
  try {
    await client.connect();
    console.log('📦 Verificando estado de las tablas...');

    const result = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('📋 Tablas existentes:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name} (${row.table_type})`);
    });

    // Verificar datos de ejemplo
    const libraryCount = await client.query('SELECT COUNT(*) FROM libraries');
    console.log(`📚 Bibliotecas registradas: ${libraryCount.rows[0].count}`);

  } catch (err) {
    console.error('❌ Error verificando tablas:', err);
  } finally {
    await client.end();
    console.log('🛑 Conexión cerrada.');
  }
}

// Ejecutar la función según el argumento de línea de comandos
const action = process.argv[2];

switch (action) {
  case 'reset':
    console.log('🔄 Reseteando esquema...');
    resetSchema();
    break;
  case 'check':
    console.log('🔍 Verificando tablas...');
    checkTables();
    break;
  default:
    console.log('🚀 Creando esquema...');
    createSchema();
}