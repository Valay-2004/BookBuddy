import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import BookCard from "../components/BookCard";
import ReviewModal from "../components/modals/ReviewModal";
import ViewReviewsModal from "../components/modals/ViewReviewsModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [viewReviewsFor, setViewReviewsFor] = useState(null);

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

  // When user opens the public reviews modal, ensure reviews are fetched
  useEffect(() => {
    if (viewReviewsFor && !bookReviews[viewReviewsFor]) {
      fetchBookReviews(viewReviewsFor);
    }
  }, [viewReviewsFor]);

  const submitReview = async (bookId) => {
    if (!reviewRating) return toast.error("Please select a rating");
    setIsReviewSubmitting(true);
    try {
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
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  // Delete book with confirmation
  const deleteBook = async (bookId) => {
    setIsDeleting(true);
    try {
      await API.delete(`/books/${bookId}`);
      toast.success("Book deleted");
      await fetchBooks(page);
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete book");
    } finally {
      setIsDeleting(false);
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl sm:text-5xl font-black bg-linear-to-r from-emerald-500 to-teal-700 bg-clip-text text-transparent mb-2">
            📚 Library
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Discover and review amazing books
          </p>
        </div>

        {user?.role === "admin" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-lg transition-all duration-200 w-fit"
          >
            {showForm ? "✕ Cancel" : "✨ Add Book"}
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
              className="bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
            >
              <h3 className="text-2xl font-bold mb-6 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Add New Book
              </h3>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter book title"
                    value={newBook.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
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
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
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
                    rows={4}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
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
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl shadow-md h-64"
            />
          ))}
        </div>
      ) : books.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="text-8xl mb-4 opacity-20">📚</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            No books yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Start by adding your first book to the library. Click the "Add Book"
            button to get started.
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              user={user}
              bookReviewsLen={bookReviews[book.id]?.length ?? 0}
              reviewOpenFor={reviewOpenFor}
              onOpenReviewClick={(id) =>
                setReviewOpenFor((prev) => (prev === id ? null : id))
              }
              onDeleteClick={(id) => setDeleteConfirm(id)}
              onCardClick={(id) => setViewReviewsFor(id)}
            />
          ))}
        </motion.div>
      )}

      {/* Review modal (extracted component) */}
      <ReviewModal
        isOpen={reviewOpenFor !== null}
        bookId={reviewOpenFor}
        rating={reviewRating}
        reviewText={reviewText}
        isSubmitting={isReviewSubmitting}
        onRatingChange={(val) => setReviewRating(val)}
        onTextChange={(val) => setReviewText(val)}
        onSubmit={() => submitReview(reviewOpenFor)}
        onClose={() => setReviewOpenFor(null)}
      />

      {/* Public view reviews modal (extracted component) */}
      <ViewReviewsModal
        isOpen={viewReviewsFor !== null}
        reviews={bookReviews[viewReviewsFor] || []}
        onClose={() => setViewReviewsFor(null)}
      />

      {/* Delete confirmation modal (extracted component) */}
      <DeleteConfirmModal
        isOpen={deleteConfirm !== null}
        isDeleting={isDeleting}
        onConfirm={() => deleteBook(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* Pagination controls */}
      {!loading && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => {
                const np = p - 1;
                fetchBooks(np);
                return np;
              });
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition"
          >
            ← Prev
          </motion.button>
          <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 font-semibold text-gray-800 dark:text-gray-200">
            {page} / {totalPages}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => {
                const np = p + 1;
                fetchBooks(np);
                return np;
              });
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition"
          >
            Next →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
