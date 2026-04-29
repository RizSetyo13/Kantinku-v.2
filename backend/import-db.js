const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function importDatabase() {
  console.log('--- KantinKu Database Importer ---');
  console.log(`Target: ${process.env.DB_HOST} / ${process.env.DB_NAME}`);
  
  if (process.env.DB_HOST === 'localhost') {
    console.error('ERROR: Anda masih menggunakan DB_HOST=localhost. Silakan ganti dengan HOST dari Railway di file .env!');
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true // Penting untuk menjalankan banyak query sekaligus
  });

  try {
    console.log('Reading database_mysql.sql...');
    const sqlPath = path.join(__dirname, 'database_mysql.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing SQL queries on Railway... (Mohon tunggu)');
    await connection.query(sql);
    
    console.log('✅ BERHASIL! Seluruh struktur tabel dan data telah diimpor ke Railway.');
  } catch (err) {
    console.error('❌ GAGAL IMPOR:', err.message);
  } finally {
    await connection.end();
  }
}

importDatabase();
