import axios from "axios";

const OPEN_LIBRARY_BASE = "https://openlibrary.org";

export const fetchTrendingBooks = async (limit = 3) => {
  try {
    const response = await axios.get(`${OPEN_LIBRARY_BASE}/trending/daily.json?limit=${limit}`);
    return response.data.works.map(normalizeOpenLibraryBook);
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
}


const normalizeOpenLibraryBook = (work) => {
  // Handle different description formats (string or object with value)
  let description = "No description available.";
  if (typeof work.description === "string") {
    description = work.description;
  } else if (work.description?.value) {
    description = work.description.value;
  }

  // Extract author names if available (Trending API usually gives author_name array, Works API might give authors array with keys)
  let author = "Unknown Author";
  if (work.author_name) {
    author = Array.isArray(work.author_name) ? work.author_name[0] : work.author_name;
  } else if(work.authors) {
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

  return {
    title: work.title,
    author: author,
    description: description,
    cover_url: cover_url,
    published_year: work.first_publish_year,
    // Add an external ID flag or prefix to distinguish
    id: `OL_${work.key?.replace("/works/", "")}`, 
    isExternal: true,
    key: work.key // e.g. "/works/OL123W"
  };
};
