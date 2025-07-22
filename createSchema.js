const { Client } = require('pg');

// Configuración de la base de datos usando variables de entorno
const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'library',
  password: process.env.DB_PASSWORD || 'N1C0L45M0N74N4R1i$',
  port: process.env.DB_PORT || 5432,
});

async function createFreshSchema() {
  try {
    await client.connect();
    console.log('📦 Conectado a PostgreSQL');

    // PASO 1: Eliminar todas las tablas existentes
    console.log('🗑️ Eliminando esquema existente...');
    
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
      console.log(`   ✓ Tabla ${table} eliminada`);
    }

    // Eliminar función si existe
    await client.query(`DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;`);
    console.log('   ✓ Función update_updated_at_column eliminada');

    console.log('🎯 Esquema limpio, creando nuevas tablas...');

    // PASO 2: Crear todas las tablas desde cero
    
    // Tabla base: books
    await client.query(`
      CREATE TABLE books (
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
    console.log('   ✓ Tabla books creada');

    // Tabla: fiction_books
    await client.query(`
      CREATE TABLE fiction_books (
        book_id INTEGER PRIMARY KEY REFERENCES books(id) ON DELETE CASCADE,
        genre TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✓ Tabla fiction_books creada');

    // Tabla: non_fiction_books
    await client.query(`
      CREATE TABLE non_fiction_books (
        book_id INTEGER PRIMARY KEY REFERENCES books(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✓ Tabla non_fiction_books creada');

    // Tabla: users
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✓ Tabla users creada');

    // Tabla: carts
    await client.query(`
      CREATE TABLE carts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✓ Tabla carts creada');

    // Muchos a muchos: cart_books
    await client.query(`
      CREATE TABLE cart_books (
        cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (cart_id, book_id)
      );
    `);
    console.log('   ✓ Tabla cart_books creada');

    // Tabla: orders (con order_date incluido)
    await client.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
        order_date TIMESTAMP DEFAULT NOW(),
        total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✓ Tabla orders creada (con order_date)');

    // Tabla: libraries
    await client.query(`
      CREATE TABLE libraries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT,
        phone TEXT,
        email TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✓ Tabla libraries creada');

    // Relación: library_books
    await client.query(`
      CREATE TABLE library_books (
        library_id INTEGER REFERENCES libraries(id) ON DELETE CASCADE,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (library_id, book_id)
      );
    `);
    console.log('   ✓ Tabla library_books creada');

    // Relación: library_users
    await client.query(`
      CREATE TABLE library_users (
        library_id INTEGER REFERENCES libraries(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        registration_date TIMESTAMP DEFAULT NOW(),
        membership_type TEXT DEFAULT 'basic',
        PRIMARY KEY (library_id, user_id)
      );
    `);
    console.log('   ✓ Tabla library_users creada');

    // Relación: library_orders
    await client.query(`
      CREATE TABLE library_orders (
        library_id INTEGER REFERENCES libraries(id) ON DELETE CASCADE,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        processed_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (library_id, order_id)
      );
    `);
    console.log('   ✓ Tabla library_orders creada');

    // PASO 3: Crear índices para mejorar el rendimiento
    console.log('📊 Creando índices...');
    await client.query(`
      CREATE INDEX idx_books_title ON books(title);
      CREATE INDEX idx_books_author ON books(author);
      CREATE INDEX idx_books_isbn ON books(isbn);
      CREATE INDEX idx_books_available ON books(is_available);
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_orders_user_id ON orders(user_id);
      CREATE INDEX idx_orders_date ON orders(order_date);
      CREATE INDEX idx_cart_books_cart_id ON cart_books(cart_id);
      CREATE INDEX idx_cart_books_book_id ON cart_books(book_id);
      CREATE INDEX idx_fiction_books_genre ON fiction_books(genre);
      CREATE INDEX idx_non_fiction_books_subject ON non_fiction_books(subject);
    `);
    console.log('   ✓ Todos los índices creados');

    // PASO 4: Crear función para actualizar timestamps
    console.log('🔄 Creando función de timestamps...');
    await client.query(`
      CREATE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    console.log('   ✓ Función update_updated_at_column creada');

    // PASO 5: Crear triggers para actualizar timestamps automáticamente
    console.log('⚡ Creando triggers...');
    await client.query(`
      CREATE TRIGGER update_books_updated_at 
        BEFORE UPDATE ON books 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      CREATE TRIGGER update_libraries_updated_at 
        BEFORE UPDATE ON libraries 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      CREATE TRIGGER update_carts_updated_at 
        BEFORE UPDATE ON carts 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('   ✓ Todos los triggers creados');

    // PASO 6: Insertar datos de ejemplo
    console.log('📚 Insertando datos de ejemplo...');
    await client.query(`
      INSERT INTO libraries (name, address, phone, email)
      VALUES ('Central Library', '123 Main St', '555-0123', 'info@centrallibrary.com');
    `);
    console.log('   ✓ Biblioteca de ejemplo insertada');

    console.log('\n🎉 ¡ESQUEMA CREADO EXITOSAMENTE!');
    console.log('✅ Todas las tablas creadas desde cero');
    console.log('📊 Índices optimizados aplicados');
    console.log('🔄 Triggers automáticos configurados');
    console.log('📚 Datos de ejemplo disponibles');

  } catch (err) {
    console.error('❌ Error creando esquema:', err.message);
    console.error('📍 Detalles:', err.stack);
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
    if (result.rows.length === 0) {
      console.log('   ⚠️ No hay tablas creadas');
    } else {
      result.rows.forEach(row => {
        console.log(`   - ${row.table_name} (${row.table_type})`);
      });
    }

    // Verificar estructura de la tabla orders específicamente
    try {
      const orderColumns = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'orders' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
      
      if (orderColumns.rows.length > 0) {
        console.log('\n🔍 Estructura de la tabla orders:');
        orderColumns.rows.forEach(col => {
          console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
        });
      }
    } catch (err) {
      console.log('   ⚠️ Tabla orders no existe o no es accesible');
    }

    // Verificar datos de ejemplo
    try {
      const libraryCount = await client.query('SELECT COUNT(*) FROM libraries');
      console.log(`\n📚 Bibliotecas registradas: ${libraryCount.rows[0].count}`);
    } catch (err) {
      console.log('   ⚠️ No se pueden verificar las bibliotecas');
    }

  } catch (err) {
    console.error('❌ Error verificando tablas:', err.message);
  } finally {
    await client.end();
    console.log('🛑 Conexión cerrada.');
  }
}

// Ejecutar la función según el argumento de línea de comandos
const action = process.argv[2];

switch (action) {
  case 'check':
    console.log('🔍 Verificando estado actual...');
    checkTables();
    break;
  default:
    console.log('🚀 Creando esquema completo desde cero...');
    createFreshSchema();
}