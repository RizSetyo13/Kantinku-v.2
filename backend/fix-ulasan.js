const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kantinku',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    console.log('Adding rating column to ulasan_website table...');
    await connection.query('ALTER TABLE ulasan_website ADD COLUMN rating TINYINT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5) AFTER no_telp');
    console.log('Success!');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Rating column already exists!');
    } else {
      console.error('Error:', err.message);
    }
  } finally {
    await connection.end();
  }
}

fix();
