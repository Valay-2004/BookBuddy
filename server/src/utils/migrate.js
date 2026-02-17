const db = require("../config/database");

/**
 * Self-healing database migration — ensures schema is up to date on every server start.
 * Safe to run multiple times (idempotent).
 */
async function runMigrations() {
  try {
    console.log("Checking database schema...");

    // Ensure all tables exist
    await db.query(`
      -- User roles enum
      DO $$ BEGIN
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
        description TEXT NOT NULL DEFAULT '',
        cover_url TEXT,
        published_year INTEGER,
        gutenberg_id VARCHAR(20),
        read_url TEXT
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

      -- Reading lists
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

    // Ensure new columns exist on books (for older DBs) and types are correct
    await db.query(`
      ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_url TEXT;
      ALTER TABLE books ADD COLUMN IF NOT EXISTS published_year INTEGER;
      ALTER TABLE books ADD COLUMN IF NOT EXISTS gutenberg_id VARCHAR(20);
      ALTER TABLE books ADD COLUMN IF NOT EXISTS read_url TEXT;
      
      -- Ensure gutenberg_id is VARCHAR even if it was INTEGER before
      ALTER TABLE books ALTER COLUMN gutenberg_id TYPE VARCHAR(20) USING gutenberg_id::text;
    `);

    // Drop removed columns (cleanup from old schema)
    await db.query(`
      ALTER TABLE books DROP COLUMN IF EXISTS buy_url;
      ALTER TABLE books DROP COLUMN IF EXISTS isbn;
    `);

    // Legacy: rename 'summary' to 'description' if it still exists
    const checkSummary = await db.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'books' AND column_name = 'summary'
    `);
    if (checkSummary.rows.length > 0) {
      await db.query("ALTER TABLE books RENAME COLUMN summary TO description");
      console.log("✅ Migrated 'summary' → 'description'");
    }

    // Deduplicate before adding unique constraint
    await db.query(`
      DELETE FROM books a USING books b
      WHERE a.id < b.id AND a.title = b.title AND a.author = b.author
    `);

    // Unique constraint for seeding stability (Standardized)
    await db.query(`
      DO $$ BEGIN
        -- Drop the auto-generated one if it exists from older init.sql versions
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_title_author_key') THEN
          ALTER TABLE books DROP CONSTRAINT books_title_author_key;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_title_author') THEN
          ALTER TABLE books ADD CONSTRAINT unique_title_author UNIQUE (title, author);
        END IF;
      END $$
    `);

    // Performance indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
      CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON reviews(book_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
      CREATE INDEX IF NOT EXISTS idx_reading_list_user_id ON reading_lists(user_id);
    `);

    console.log("✅ Database schema is up to date.");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    // Don't crash — server can still start, queries may fail for missing columns
  }
}

module.exports = runMigrations;

if (require.main === module) {
  runMigrations().then(() => process.exit(0));
}
