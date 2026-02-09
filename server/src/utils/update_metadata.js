require("dotenv").config();
const db = require("../config/database");

/**
 * Fetches better metadata (description and cover) from Google Books API.
 */
async function updateBookMetadata() {
  console.log("🚀 Starting metadata update process...");

  try {
    // Parse limit from command line arguments
    const args = process.argv.slice(2);
    const limitArg = args.find((arg) => arg.startsWith("--limit="));
    const limit = limitArg ? parseInt(limitArg.split("=")[1]) : null;

    // 1. Fetch books that might need updates
    // We look for books with short descriptions (e.g., < 200 chars) or default descriptions
    const query = `
      SELECT id, title, author, description, cover_url 
      FROM books 
      WHERE LENGTH(description) < 200 
         OR description LIKE 'A fascinating book%'
         OR cover_url IS NULL
      ${limit ? `LIMIT ${limit}` : ""}
    `;
    const { rows: books } = await db.query(query);

    console.log(
      `📋 Found ${books.length} books that potentially need better metadata.`,
    );

    let updatedCount = 0;
    let skippedCount = 0;

    for (const book of books) {
      console.log(`\n🔍 Checking: "${book.title}" by ${book.author}...`);

      try {
        const query = encodeURIComponent(
          `intitle:${book.title} inauthor:${book.author}`,
        );
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;

        const response = await fetch(url);
        if (!response.ok) {
          console.warn(
            `   ⚠️ Google Books API error for "${book.title}": ${response.statusText}`,
          );
          continue;
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const info = data.items[0].volumeInfo;

          const newDescription = info.description || book.description;
          let newCoverUrl = book.cover_url;

          // Try to get a high-quality cover
          if (info.imageLinks) {
            newCoverUrl =
              info.imageLinks.extraLarge ||
              info.imageLinks.large ||
              info.imageLinks.medium ||
              info.imageLinks.thumbnail ||
              book.cover_url;

            // Standardize thumbnail URL to https if it's http
            if (newCoverUrl && newCoverUrl.startsWith("http:")) {
              newCoverUrl = newCoverUrl.replace("http:", "https:");
            }
          }

          // Only update if the new description is significantly better (longer) or cover changed
          const isBetterDescription =
            newDescription &&
            newDescription.length >
              (book.description ? book.description.length : 0);
          const isNewCover = newCoverUrl !== book.cover_url;

          if (isBetterDescription || isNewCover) {
            await db.query(
              "UPDATE books SET description = $1, cover_url = $2 WHERE id = $3",
              [newDescription, newCoverUrl, book.id],
            );
            console.log(
              `   ✅ Updated! (Desc length: ${newDescription.length}${isNewCover ? ", New cover" : ""})`,
            );
            updatedCount++;
          } else {
            console.log("   ℹ️ No better metadata found.");
            skippedCount++;
          }
        } else {
          console.log("   ❌ No matches found on Google Books.");
          skippedCount++;
        }
      } catch (err) {
        console.error(
          `   ⚠️ Failed to fetch/update "${book.title}":`,
          err.message,
        );
      }

      // Delay to respect API limits
      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log(`\n✨ Process complete!`);
    console.log(`✅ Updated: ${updatedCount}`);
    console.log(`ℹ️ Skipped/No change: ${skippedCount}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Metadata update failed:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  updateBookMetadata();
}
