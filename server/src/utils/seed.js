// Use this script to populate the database with new books automatically
// or you can always add books using admin account manually
require("dotenv").config();
const db = require("../config/database");

/**
 * Fetches books from Open Library and seeds the database.
 * Uses ON CONFLICT to safely update existing entries.
 */
async function seedBooks() {
  try {
    console.log("🚀 Starting database seeding...");

    // Check current book count
    const countRes = await db.query("SELECT COUNT(*)::int AS count FROM books");
    const count = countRes.rows[0].count;
    if (count > 100) {
      console.log(
        `ℹ️  Already ${count} books — updating existing entries with better data.`,
      );
    }

    // Subjects to fetch from Open Library
    const subjects = [
      "classic_literature",
      "science_fiction",
      "mystery_and_detective_stories",
      "fantasy",
      "history",
    ];
    let allDocs = [];

    for (const subject of subjects) {
      console.log(`📡 Fetching subject: ${subject}...`);
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?subject=${subject}&limit=12`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.docs) allDocs.push(...data.docs);
        }
      } catch (e) {
        console.warn(
          `   ⚠️  Failed to fetch subject: ${subject} - ${e.message}`,
        );
      }
      await delay(500);
    }

    // Trending endpoints
    const trending = [
      "https://openlibrary.org/trending/daily.json",
      "https://openlibrary.org/trending/weekly.json",
    ];

    for (const url of trending) {
      const type = url.includes("daily") ? "Daily" : "Weekly";
      console.log(`📡 Fetching Trending: ${type}...`);
      try {
        const res = await fetch(`${url}?limit=15`);
        if (res.ok) {
          const data = await res.json();
          if (data.works) allDocs.push(...data.works);
        }
      } catch (e) {
        console.warn(`   ⚠️  Failed to fetch Trending: ${type} - ${e.message}`);
      }
      await delay(500);
    }

    if (allDocs.length === 0) {
      console.error("❌ No books fetched.");
      return process.exit(1);
    }

    // Deduplicate by Open Library key
    const uniqueDocs = [...new Map(allDocs.map((d) => [d.key, d])).values()];
    console.log(`📚 Processing ${uniqueDocs.length} unique titles...`);

    let seededCount = 0;

    for (const doc of uniqueDocs) {
      const title = doc.title;
      const author =
        doc.author_name?.[0] || doc.authors?.[0]?.name || "Unknown Author";
      const published_year =
        doc.first_publish_year || doc.publish_year?.[0] || null;

      // Cover URL: MUST exist to maintain premium look
      const cover_url = doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : null;

      if (!cover_url) {
        console.log(`⏩ Skipping: "${title}" (No cover image)`);
        continue;
      }

      // Fetch work details for a better description
      let description = doc.first_sentence?.[0] || "";
      try {
        if (doc.key) {
          const workRes = await fetch(`https://openlibrary.org${doc.key}.json`);
          if (workRes.ok) {
            const work = await workRes.json();
            if (typeof work.description === "string")
              description = work.description;
            else if (work.description?.value)
              description = work.description.value;
          }
          await delay(500);
        }
      } catch {
        // Skip on fetch error
      }

      // Quality Check for Description
      const isGeneric =
        description.toLowerCase().includes("a book titled") ||
        description.toLowerCase() === title.toLowerCase();
      const hasEnoughWords = description.split(/\s+/).length >= 20;

      if (!description || isGeneric || !hasEnoughWords) {
        console.log(`⏩ Skipping: "${title}" (Poor quality summary)`);
        continue;
      }

      // Read URL: prefer Internet Archive viewer link, else Open Library work page
      let read_url = null;
      if (doc.ia?.length > 0) {
        read_url = `https://archive.org/details/${doc.ia[0]}?ref=ol`;
      } else if (doc.key) {
        read_url = `https://openlibrary.org${doc.key}`;
      }

      // Gutenberg ID: quick inline lookup
      let gutenberg_id = null;
      try {
        const gRes = await fetch(
          `https://gutendex.com/books?search=${encodeURIComponent(title + " " + author)}`,
        );
        if (gRes.ok) {
          const gData = await gRes.json();
          const match = gData.results?.[0];
          if (match?.title?.toLowerCase().includes(title.toLowerCase())) {
            gutenberg_id = match.id.toString();
            // PRIORITIZE Gutenberg as the primary read_url if found
            read_url = `https://www.gutenberg.org/cache/epub/${gutenberg_id}/pg${gutenberg_id}-images.html`;
          }
        }
        await delay(300);
      } catch {
        // Skip gutenberg lookup
      }

      try {
        await db.query(
          `INSERT INTO books (title, author, description, cover_url, published_year, read_url, gutenberg_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (title, author) DO UPDATE SET
             description = EXCLUDED.description,
             cover_url = COALESCE(EXCLUDED.cover_url, books.cover_url),
             published_year = COALESCE(EXCLUDED.published_year, books.published_year),
             read_url = COALESCE(EXCLUDED.read_url, books.read_url),
             gutenberg_id = COALESCE(books.gutenberg_id, EXCLUDED.gutenberg_id)`,
          [
            title,
            author,
            description,
            cover_url,
            published_year,
            read_url,
            gutenberg_id,
          ],
        );
        seededCount++;
      } catch (err) {
        console.error(`⚠️  Failed: "${title}" — ${err.message}`);
      }
    }

    console.log(`✅ Seeded/updated ${seededCount} books.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

if (require.main === module) {
  console.log("\n🚀 Seeding process initiated...");
  seedBooks();
}
