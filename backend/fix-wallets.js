const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkWallets() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await connection.query('SELECT * FROM wallets');
    console.log('Wallets:', rows);
    
    // Create wallets for seeded users if not exist
    const [users] = await connection.query('SELECT id, role FROM users WHERE role = "customer"');
    for (const u of users) {
       const [w] = await connection.query('SELECT id FROM wallets WHERE user_id = ?', [u.id]);
       if (w.length === 0) {
           await connection.query('INSERT INTO wallets (user_id, saldo) VALUES (?, 0)', [u.id]);
           console.log(`Created wallet for user ID ${u.id}`);
       }
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await connection.end();
  }
}

checkWallets();
