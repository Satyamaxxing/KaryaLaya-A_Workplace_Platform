
// backend/src/db.js
const { Pool } = require("pg");

let pool;

const cfgFromEnv = () => {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }
  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "synergysphere",
  };
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function initDB(maxRetries = 10, delayMs = 1500) {
  const config = cfgFromEnv();
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Connecting to the database...`);
      pool = new Pool(config);
      await pool.query("SELECT 1");
      console.log("✅ Database connection successful!");
      return pool;
    } catch (err) {
      console.error("❌ DB connection failed:", err.message);
      if (pool) try { await pool.end(); } catch {}
      if (attempt === maxRetries) throw err;
      await wait(delayMs);
    }
  }
}

async function closeDB() {
  if (pool) {
    await pool.end();
    console.log("Database connection closed.");
  }
}

module.exports = { initDB, closeDB };
