import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Search } from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

// Components
import BookList from "../components/BookList"; // Replaces BookGrid
import AddBookForm from "../components/forms/AddBookForm";
import ReviewModal from "../components/modals/ReviewModal";
import ViewReviewsModal from "../components/modals/ViewReviewsModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import { Button, Input } from "../components/ui/Core";

export default function Books() {
  const { user, token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // UI States
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewOpenFor, setReviewOpenFor] = useState(null);
  const [viewReviewsFor, setViewReviewsFor] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Review Data
  const [bookReviews, setBookReviews] = useState({});
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const attachCoverUrls = (books) => {
    return books.map((book) => ({
      ...book,
      cover_url: `https://covers.openlibrary.org/b/title/${encodeURIComponent(
        book.title,
      )}-L.jpg`,
    }));
  };

  const fetchBooks = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/books?page=${pageNum}&limit=5`); // Lower limit for list view
      const booksWithCovers = attachCoverUrls(data.books);
      setBooks(booksWithCovers);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(page);
  }, [page, fetchBooks]);

  // Fetch reviews for visible books
  useEffect(() => {
    books.forEach(async (book) => {
      try {
        const { data } = await API.get(`/books/${book.id}/reviews`);
        setBookReviews((prev) => ({ ...prev, [book.id]: data || [] }));
      } catch (e) {
        console.error(e);
      }
    });
  }, [books]);

  const handleAddBook = async (bookData) => {
    setIsSubmitting(true);
    try {
      await API.post("/books", bookData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Book added!");
      setShowAddForm(false);
      fetchBooks(1);
    } catch (err) {
      toast.error("Failed to add book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async () => {
    setIsReviewSubmitting(true);
    try {
      await API.post(`/books/${reviewOpenFor}/reviews`, {
        rating: reviewRating,
        reviewText,
      });
      toast.success("Review posted");
      setReviewOpenFor(null);
      // Refresh reviews for this book
      const { data } = await API.get(`/books/${reviewOpenFor}/reviews`);
      setBookReviews((prev) => ({ ...prev, [reviewOpenFor]: data }));
    } catch (err) {
      toast.error("Failed to post review");
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-paper">
      <div className="editorial-container py-12">
        <Toaster position="bottom-right" />

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-8">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-serif font-black text-ink dark:text-white mb-4 tracking-tighter"
            >
              The <span className="text-accent italic">Review</span>.
            </motion.h1>
            <p className="text-xl text-zinc-500 font-light max-w-lg">
              Curated reading lists and honest critiques for the modern
              bibliophile.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Search Mockup */}
            <div className="relative hidden sm:block">
              <Search
                className="absolute left-3 top-2.5 text-zinc-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search titles..."
                className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm outline-none focus:border-accent"
              />
            </div>

            {user?.role === "admin" && (
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus size={18} />
                <span className="hidden sm:inline">Add Title</span>
              </Button>
            )}
          </div>
        </div>

        {/* Add Form Collapse */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                <AddBookForm
                  onAdd={handleAddBook}
                  onCancel={() => setShowAddForm(false)}
                  isSubmitting={isSubmitting}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content: 8 Columns */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-serif">Latest Releases</h2>
              <span className="text-sm text-zinc-400">
                Showing page {page} of {totalPages}
              </span>
            </div>

            <BookList
              books={books}
              isLoading={loading}
              user={user}
              bookReviews={bookReviews}
              onOpenReview={setReviewOpenFor}
              onDelete={setDeleteConfirmId}
            />

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-16">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Sidebar: 4 Columns (Kirkus style "Trending" or "Featured") */}
          <div className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="sticky top-24">
              <div className="p-6 bg-accent/5 dark:bg-accent/10 rounded-2xl border border-accent/10">
                <h3 className="text-lg font-bold font-serif mb-4 text-accent-hover">
                  Editor's Pick
                </h3>
                <div className="relative aspect-[2/3] mb-4 w-full overflow-hidden rounded-lg shadow-md group">
                  <img
                    // Example using the first book in your list as Editor's pick
                    src={books[0]?.cover_url || "/covers/fallback-book.png"}
                    alt={books[0]?.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/covers/fallback-book.png";
                    }}
                  />
                </div>
                <h4 className="font-bold text-lg leading-tight">
                  {books[0]?.title || "The Silent Patient"}
                </h4>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold font-serif mb-4 border-b pb-2">
                  Trending Now
                </h3>
                <ul className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex gap-3 group cursor-pointer">
                      <span className="text-2xl font-black text-zinc-200 group-hover:text-accent transition-colors">
                        0{i}
                      </span>
                      <div>
                        <p className="font-bold text-sm group-hover:underline">
                          Demon Copperhead
                        </p>
                        <p className="text-xs text-zinc-500">
                          Barbara Kingsolver
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modals - Keeping your existing logic, just wrapping them */}
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

        <DeleteConfirmModal
          isOpen={!!deleteConfirmId}
          isDeleting={loading}
          onConfirm={async () => {
            await API.delete(`/books/${deleteConfirmId}`);
            setDeleteConfirmId(null);
            fetchBooks(page);
          }}
          onCancel={() => setDeleteConfirmId(null)}
        />
      </div>
    </div>
  );
}
