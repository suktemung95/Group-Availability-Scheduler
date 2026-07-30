const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const runQuery = async (query, values) => {
  const result = await pool.query(query, values);
  return result.rows;
};

runQuery.closePool = async () => {
  await pool.end()
}

module.exports = runQuery;