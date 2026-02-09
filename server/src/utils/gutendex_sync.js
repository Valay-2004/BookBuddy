const db = require("../config/database");

/**
 * Searches Gutendex for a book and returns its Gutenberg ID.
 * @param {string} title 
 * @param {string} author 
 * @returns {Promise<string|null>}
 */
async function findGutenbergId(title, author) {
  try {
    const query = `search=${encodeURIComponent(title + " " + author)}`;
    const url = `https://gutendex.com/books?${query}`;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      // Find the best match
      // For simplicity, we'll take the first result if it's high confidence
      // or check if title matches closely.
      const match = data.results[0];
      if (match.title.toLowerCase().includes(title.toLowerCase())) {
        return match.id.toString();
      }
    }
    return null;
  } catch (err) {
    console.error(`[Gutendex] Search failed for ${title}:`, err.message);
    return null;
  }
}

/**
 * Backfills Gutenberg IDs for books in the database.
 */
async function syncGutendex() {
  console.log("🔍 Starting Gutendex Sync...");
  
  try {
    // 1. Fetch books without Gutenberg IDs
    const { rows: books } = await db.query(
      "SELECT id, title, author FROM books WHERE gutenberg_id IS NULL"
    );
    
    console.log(`📋 Found ${books.length} books to check.`);
    
    let updatedCount = 0;
    for (const book of books) {
      console.log(`Checking: "${book.title}" by ${book.author}...`);
      
      const gid = await findGutenbergId(book.title, book.author);
      
      if (gid) {
        await db.query(
          "UPDATE books SET gutenberg_id = $1 WHERE id = $2",
          [gid, book.id]
        );
        console.log(`✅ Matches Gutenberg ID: ${gid}`);
        updatedCount++;
      } else {
        console.log("❌ No match found.");
      }
      
      // Delay to be polite to the API
      await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log(`✨ Sync complete! Updated ${updatedCount} books.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Sync failed:", err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  syncGutendex();
}

module.exports = { findGutenbergId };
