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

  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    // Don't crash the server, just log it. 
    // Worst case, the specific column query fails later.
  }
}

module.exports = runMigrations;
