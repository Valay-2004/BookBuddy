import axios from "axios";

const OPEN_LIBRARY_BASE = "https://openlibrary.org";

export const fetchTrendingBooks = async (limit = 3) => {
  try {
    // Fetch a larger pool to allow for randomization
    const fetchLimit = Math.max(limit, 20);
    const response = await axios.get(
      `${OPEN_LIBRARY_BASE}/trending/daily.json?limit=${fetchLimit}`,
    );

    // Normalize and shuffle
    const allTrending = response.data.works.map(normalizeOpenLibraryBook);

    // Fisher-Yates shuffle
    for (let i = allTrending.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTrending[i], allTrending[j]] = [allTrending[j], allTrending[i]];
    }

    return allTrending.slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch trending books:", error);
    return [];
  }
};

export const fetchBookDetails = async (olid) => {
  try {
    const response = await axios.get(`${OPEN_LIBRARY_BASE}/works/${olid}.json`);
    return normalizeOpenLibraryBook(response.data);
  } catch (error) {
    console.error("Failed to fetch book details:", error);
    return null;
  }
};

const normalizeOpenLibraryBook = (work) => {
  // Handle different description formats (string or object with value)
  let description = "";
  if (typeof work.description === "string") {
    description = work.description;
  } else if (work.description?.value) {
    description = work.description.value;
  }

  // Extract author names if available (Trending API usually gives author_name array, Works API might give authors array with keys)
  let author = "Unknown Author";
  if (work.author_name) {
    author = Array.isArray(work.author_name)
      ? work.author_name[0]
      : work.author_name;
  } else if (work.authors) {
    // This part is tricky as Works API returns author keys, enabling fetching author names requires another call.
    // For now, we'll try to rely on what's available or leave it generic if only keys are there.
    // In a real robust app valid author fetching is needed.
    // However, for 'Trending' endpoint, 'author_name' is usually present.
  }

  // Cover URL
  // 'cover_i' is often used in search/trending results. 'covers' array in works.
  let cover_url = null;
  if (work.cover_i) {
    cover_url = `https://covers.openlibrary.org/b/id/${work.cover_i}-L.jpg`;
  } else if (work.covers && work.covers.length > 0) {
    cover_url = `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg`;
  }

  // Read URL: prefer Internet Archive viewer link if available
  let read_url_val = null;
  if (work.ia && work.ia.length > 0) {
    read_url_val = `https://archive.org/details/${work.ia[0]}?ref=ol`;
  } else if (work.key) {
    read_url_val = `https://openlibrary.org${work.key}`;
  }

  // Gutenberg ID: check identifiers
  let gutenberg_id_val = null;
  if (work.identifiers?.gutenberg) {
    gutenberg_id_val = work.identifiers.gutenberg[0];
    // PRIORITIZE Gutenberg for direct reading if ID exists
    read_url_val = `https://www.gutenberg.org/cache/epub/${gutenberg_id_val}/pg${gutenberg_id_val}-images.html`;
  }

  return {
    title: work.title,
    author: author,
    description: description,
    cover_url: cover_url,
    published_year: work.first_publish_year,
    read_url: read_url_val,
    gutenberg_id: gutenberg_id_val,
    // Add an external ID flag or prefix to distinguish
    id: `OL_${work.key?.replace("/works/", "")}`,
    isExternal: true,
    key: work.key, // e.g. "/works/OL123W"
  };
};
