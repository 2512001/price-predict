const { Pool } = require('pg');

let pool = null;

const getPool = () => {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle Postgres client', err);
    });
  }
  return pool;
};

const connectPostgres = async () => {
  try {
    const pool = getPool();
    await pool.query('SELECT NOW()');
    console.log('Postgres database connected');
  } catch (error) {
    console.error('Postgres connection error:', error.message);
    throw error;
  }
};

module.exports = { getPool, connectPostgres };




