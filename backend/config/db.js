const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); // Ensure .env is loaded from backend root

// Configuration for the database connection
// It will try to use individual DB_ variables first,
// then fall back to DATABASE_URL if it's defined.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  // Use connectionString if DATABASE_URL is set and individual components are not
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // Basic SSL support
});

// Test the connection (optional, can be done in server.js or on first query)
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database with pg Pool:', err.message);
    if (process.env.DATABASE_URL) {
        console.error('Using DATABASE_URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':********@')); // Mask password
    } else {
        console.error(`Using DB_USER: ${process.env.DB_USER}, DB_HOST: ${process.env.DB_HOST}, DB_NAME: ${process.env.DB_NAME}, DB_PORT: ${process.env.DB_PORT}`);
    }
  } else {
    console.log('Successfully connected to PostgreSQL database. Current time:', res.rows[0].now);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // Export the pool itself if needed for transactions etc.
};