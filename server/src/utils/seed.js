const db = require("../config/database");

/**
 * Fetches popular books from Open Library API and seeds the database.
 */
async function seedBooks() {
  try {
    console.log("🚀 Starting database seeding...");
    
    // 1. Check if we already have enough books
    const countRes = await db.query("SELECT COUNT(*) FROM books");
    const count = parseInt(countRes.rows[0].count);
    
    if (count > 50) {
      console.log(`ℹ️ Database already has ${count} books. Updating existing books with better data...`);
      // We'll still run to update descriptions and links
    }

    // 2. Fetch popular books from Open Library
    console.log("📡 Fetching books from Open Library...");
    const query = "subject:fiction";
    const response = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=20`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      console.error("❌ No books found to seed.");
      return;
    }

      // 3. Insert books into database
    let seededCount = 0;
    
    // Process one by one to avoid rate limiting and allow detail fetching
    for (const doc of data.docs) {
      const title = doc.title;
      const author = doc.author_name ? doc.author_name[0] : "Unknown Author";
      const isbn = doc.isbn ? doc.isbn[0] : null;
      const published_year = doc.first_publish_year || null;
      
      // Construct cover URL
      let cover_url = null;
      if (doc.cover_i) {
        cover_url = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
      } else if (isbn) {
        cover_url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
      }

      // Fetch Work Details for better description
      let description = doc.first_sentence ? doc.first_sentence[0] : `A fascinating book titled ${title} by ${author}.`;
      try {
        if (doc.key) { // doc.key is like "/works/OL123W"
            console.log(`   Running detail fetch for: ${title}`);
            const workRes = await fetch(`https://openlibrary.org${doc.key}.json`);
            if (workRes.ok) {
                const workData = await workRes.json();
                if (typeof workData.description === 'string') {
                    description = workData.description;
                } else if (workData.description && workData.description.value) {
                    description = workData.description.value;
                }
            }
            // Polite delay
            await new Promise(r => setTimeout(r, 500)); 
        }
      } catch (e) {
        console.warn(`   Failed to fetch details for ${title}, using fallback description.`);
      }

      // 4. Extract Read/Buy Links
      let read_url = null;
      if (doc.ia && doc.ia.length > 0) {
        // Prefer printdisabled if available as it often implies a real scan, 
        // but any IA ID is a good start. 
        // We will link to the borrow page.
        read_url = `https://openlibrary.org/borrow/${doc.ia[0]}`;
      } else if (doc.key) {
         // Fallback to work page which often has borrow buttons
         read_url = `https://openlibrary.org${doc.key}`;
      }

      let buy_url = null;
      if (isbn) {
        buy_url = `https://www.amazon.com/s?k=${isbn}`; // Direct search by ISBN
      } else {
        buy_url = `https://www.amazon.com/s?k=${encodeURIComponent(title + " " + author)}`;
      }

      try {
        await db.query(
          `INSERT INTO books (title, author, description, isbn, cover_url, published_year, read_url, buy_url) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (title, author) DO UPDATE 
           SET description = EXCLUDED.description,
               read_url = EXCLUDED.read_url, 
               buy_url = EXCLUDED.buy_url,
               cover_url = EXCLUDED.cover_url,
               isbn = EXCLUDED.isbn,
               published_year = EXCLUDED.published_year`,
          [title, author, description, isbn, cover_url, published_year, read_url, buy_url]
        );
        seededCount++;
      } catch (err) {
        console.error(`⚠️ Failed to insert/update "${title}":`, err.message);
      }
    }

    console.log(`✅ Successfully seeded/updated ${seededCount} books into the database!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedBooks();
