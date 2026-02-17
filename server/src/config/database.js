const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const connectionString = process.env.DATABASE_URL;

// Build pool config: prefer DATABASE_URL, fall back to individual vars
const poolConfig = connectionString
  ? {
      connectionString,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      max: 10, // Supabase free tier connection limit
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

// Crash on unexpected pool errors
pool.on("error", (err) => {
  console.error("Unexpected idle client error:", err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
