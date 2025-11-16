import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
  });
  const { user, token } = useAuth();
  const formRef = useRef(null);

  // Focus first input when form appears
  useEffect(() => {
    if (showForm && formRef.current) {
      const firstInput = formRef.current.querySelector("input");
      firstInput?.focus();
    }
  }, [showForm]);

  const fetchBooks = async (p = page) => {
    try {
      setLoading(true);
      const res = await API.get(`/books?page=${p}&limit=${limit}`);
      const data = res.data;
      setBooks(Array.isArray(data.books) ? data.books : []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching books:", err);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await API.post("/books", newBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Book added successfully!");
      await fetchBooks(1); // Refresh to first page to show new book
      setPage(1);
      setShowForm(false);
      setNewBook({ title: "", author: "", description: "" });
    } catch (err) {
      toast.error("Failed to add book");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Review UI state
  const [reviewOpenFor, setReviewOpenFor] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [bookReviews, setBookReviews] = useState({}); // Store reviews by book ID
  const [deleteConfirm, setDeleteConfirm] = useState(null); // For delete confirmation

  const openReview = (bookId) => {
    setReviewOpenFor(bookId);
    setReviewRating(5);
    setReviewText("");
  };

  // Fetch reviews for a specific book
  const fetchBookReviews = async (bookId) => {
    try {
      const res = await API.get(`/books/${bookId}/reviews`);
      setBookReviews((prev) => ({
        ...prev,
        [bookId]: Array.isArray(res.data) ? res.data : [],
      }));
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  // Fetch reviews for all books on component mount
  useEffect(() => {
    books.forEach((book) => {
      if (!bookReviews[book.id]) {
        fetchBookReviews(book.id);
      }
    });
  }, [books]);

  const submitReview = async (bookId) => {
    try {
      if (!reviewRating) return toast.error("Please select a rating");
      await API.post(`/books/${bookId}/reviews`, {
        rating: reviewRating,
        reviewText,
      });
      toast.success("Review saved");
      setReviewOpenFor(null);
      // Refresh reviews for this book
      await fetchBookReviews(bookId);
      // Refresh books list
      await fetchBooks(page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save review");
    }
  };

  // Delete book with confirmation
  const deleteBook = async (bookId) => {
    try {
      await API.delete(`/books/${bookId}`);
      toast.success("Book deleted");
      await fetchBooks(page);
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete book");
    }
  };

  const handleInputChange = (field, value) => {
    setNewBook((prev) => ({ ...prev, [field]: value }));
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <motion.div
      className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md"
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
    >
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </motion.div>
  );

  return (
    <div className="space-y-6 relative max-w-6xl mx-auto px-4 py-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 16px",
          },
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          📚 Books
          <motion.span
            className="text-sm font-normal text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <strong>({books.length})</strong>
          </motion.span>
        </h2>

        {user?.role === "admin" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            {showForm ? "Cancel" : "➕ Add Book"}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.form
              onSubmit={handleAddBook}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter book title"
                    value={newBook.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Author *
                  </label>
                  <input
                    id="author"
                    type="text"
                    placeholder="Enter author name"
                    value={newBook.author}
                    onChange={(e) =>
                      handleInputChange("author", e.target.value)
                    }
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter book description"
                    value={newBook.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {isSubmitting ? "Adding..." : "Add Book"}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
            No books found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Add your first book to get started
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                  {book.title}
                </h3>
                {user?.role === "admin" && (
                  <button
                    onClick={() => setDeleteConfirm(book.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                by {book.author}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {book.description}
              </p>

              {/* Show review count */}
              {bookReviews[book.id] && bookReviews[book.id].length > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  💬 {bookReviews[book.id].length} review
                  {bookReviews[book.id].length !== 1 ? "s" : ""}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between gap-3">
                {user ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setReviewOpenFor((prev) =>
                          prev === book.id ? null : book.id
                        )
                      }
                      className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md cursor-pointer"
                    >
                      {reviewOpenFor === book.id
                        ? "Close"
                        : "Add / Edit Review"}
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Login to review</div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Review modal (fixed) */}
      <AnimatePresence>
        {reviewOpenFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setReviewOpenFor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-lg mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium mb-3">Add / Edit Review</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm">Rating:</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="p-2 rounded-md bg-white dark:bg-gray-700"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} ⭐
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-md bg-white dark:bg-gray-800"
                  placeholder="Write your review (optional)"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setReviewOpenFor(null)}
                    className="px-3 py-1 rounded-md border"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => submitReview(reviewOpenFor)}
                    className="px-4 py-1 bg-green-600 text-white rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-3">
                Delete Book?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete this book? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteBook(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => {
                const np = p - 1;
                fetchBooks(np);
                return np;
              });
            }}
            className="px-3 py-1 rounded-md border disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => {
                const np = p + 1;
                fetchBooks(np);
                return np;
              });
            }}
            className="px-3 py-1 rounded-md border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
