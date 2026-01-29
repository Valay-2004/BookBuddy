const db = require("../config/database");

async function runMigrations() {
  try {
    console.log("Checking database schema...");

    // Check if 'summary' column exists
    const checkRes = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='books' AND column_name='summary';
    `);

    if (checkRes.rows.length > 0) {
      console.log("⚠️ Found legacy column 'summary'. Migrating to 'description'...");
      await db.query("ALTER TABLE books RENAME COLUMN summary TO description;");
      console.log("✅ Successfully migrated 'summary' to 'description'.");
    } else {
      console.log("✅ Schema check passed: 'summary' column not found (already 'description'?).");
    }

    // Also ensure new columns exist (just in case)
    await db.query(`
      ALTER TABLE books ADD COLUMN IF NOT EXISTS isbn VARCHAR(20);
      ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_url TEXT;
      ALTER TABLE books ADD COLUMN IF NOT EXISTS published_year INTEGER;
    `);
    console.log("✅ Checked/Added optional columns (isbn, cover_url, published_year).");

    // Ensure all tables exist (Self-healing schema)
    console.log("Ensuring all tables exist...");
    await db.query(`
      -- Roles enum
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('user', 'admin');
        END IF;
      END$$;

      -- Users
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role user_role NOT NULL DEFAULT 'user'
      );

      -- Books
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        author VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        isbn VARCHAR(20),
        cover_url TEXT,
        published_year INTEGER
      );

      -- Reviews
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, book_id)
      );

      -- Reading Lists
      CREATE TABLE IF NOT EXISTS reading_lists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Junction table for books in reading lists
      CREATE TABLE IF NOT EXISTS reading_list_books (
        id SERIAL PRIMARY KEY,
        reading_list_id INTEGER REFERENCES reading_lists(id) ON DELETE CASCADE,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(reading_list_id, book_id)
      );
    `);
    console.log("✅ Database schema is up to date.");

    // optimize performance with indexes
    console.log("Checking/Adding Indexes...");
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
      CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON reviews(book_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
      CREATE INDEX IF NOT EXISTS idx_reading_list_user_id ON reading_lists(user_id);
    `);
    console.log("✅ Indexes verified.");

  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    // Don't crash the server, just log it. 
    // Worst case, the specific column query fails later.
  }
}

module.exports = runMigrations;
