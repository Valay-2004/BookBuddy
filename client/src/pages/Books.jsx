import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import toast, { Toaster } from "react-hot-toast";
import { Plus } from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

// Components/modals
import BookGrid from "../components/BookGrid";
import AddBookForm from "../components/forms/AddBookForm";
import ReviewModal from "../components/modals/ReviewModal"; // Use your existing path if different
import ViewReviewsModal from "../components/modals/ViewReviewsModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";

export default function Books() {
  const { user, token } = useAuth();

  // Data States
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // Increased limit for modern screens

  // UI States
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal States
  const [reviewOpenFor, setReviewOpenFor] = useState(null);
  const [viewReviewsFor, setViewReviewsFor] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Review Data
  const [bookReviews, setBookReviews] = useState({});
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  // --- API Handlers ---

  const fetchBooks = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/books?page=${pageNum}&limit=${limit}`);
      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load library");
    } finally {
      // Small delay to prevent flicker on fast connections, ensure skeleton shows briefly
      setTimeout(() => setLoading(false), 300);
    }
  }, []);

  useEffect(() => {
    fetchBooks(page);
  }, [page, fetchBooks]);

  const fetchBookReviews = async (bookId) => {
    if (bookReviews[bookId]) return; // Cache check
    try {
      const { data } = await API.get(`/books/${bookId}/reviews`);
      setBookReviews((prev) => ({ ...prev, [bookId]: data || [] }));
    } catch (err) {
      console.error(err);
    }
  };

  // Prefetch reviews for visible books
  useEffect(() => {
    books.forEach((book) => fetchBookReviews(book.id));
  }, [books]);

  const handleAddBook = async (bookData) => {
    setIsSubmitting(true);
    try {
      await API.post("/books", bookData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Book added successfully!");
      setShowAddForm(false);
      fetchBooks(1);
      setPage(1);
    } catch (err) {
      toast.error("Failed to add book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await API.delete(`/books/${deleteConfirmId}`);
      toast.success("Book deleted");
      fetchBooks(page);
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleReviewSubmit = async () => {
    setIsReviewSubmitting(true);
    try {
      await API.post(`/books/${reviewOpenFor}/reviews`, {
        rating: reviewRating,
        reviewText,
      });
      toast.success("Review saved");

      // Update local cache immediately
      const { data } = await API.get(`/books/${reviewOpenFor}/reviews`);
      setBookReviews((prev) => ({ ...prev, [reviewOpenFor]: data }));

      setReviewOpenFor(null);
    } catch (err) {
      toast.error("Failed to save review");
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  // --- Render ---

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      <Toaster
        position="bottom-right"
        toastOptions={{ className: "dark:bg-gray-800 dark:text-white" }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Library
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and review your collection.
          </p>
        </div>

        {user?.role === "admin" && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all"
          >
            {showAddForm ? (
              "Close Form"
            ) : (
              <>
                <Plus size={20} /> Add Book
              </>
            )}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <AddBookForm
            onAdd={handleAddBook}
            onCancel={() => setShowAddForm(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>

      {/* Main Grid */}
      <BookGrid
        books={books}
        isLoading={loading}
        user={user}
        bookReviews={bookReviews}
        reviewOpenFor={reviewOpenFor}
        onOpenReview={(id) => {
          setReviewOpenFor(id);
          setReviewRating(5);
          setReviewText("");
        }}
        onDelete={setDeleteConfirmId}
        onViewReviews={(id) => {
          setViewReviewsFor(id);
          fetchBookReviews(id);
        }}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors text-gray-700 dark:text-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-mono">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors text-gray-700 dark:text-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <ReviewModal
        isOpen={!!reviewOpenFor}
        rating={reviewRating}
        reviewText={reviewText}
        isSubmitting={isReviewSubmitting}
        onRatingChange={setReviewRating}
        onTextChange={setReviewText}
        onSubmit={handleReviewSubmit}
        onClose={() => setReviewOpenFor(null)}
      />

      <ViewReviewsModal
        isOpen={!!viewReviewsFor}
        reviews={bookReviews[viewReviewsFor]}
        onClose={() => setViewReviewsFor(null)}
      />

      <DeleteConfirmModal
        isOpen={!!deleteConfirmId}
        isDeleting={loading} // Reusing loading state for delete spinner
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
