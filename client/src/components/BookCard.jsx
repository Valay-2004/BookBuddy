import React from "react";
import { motion } from "framer-motion";

/**
 * BookCard - presentational component for a single book card.
 * Modern bento-grid inspired design with sleek animations.
 *
 * Props:
 * - book: book object { id, title, author, description, ... }
 * - user: current user object (used to show admin delete control)
 * - bookReviewsLen: number of reviews for this book
 * - reviewOpenFor: id of book currently opened for review (to toggle Add/Edit text)
 * - onOpenReviewClick(bookId): open/close review editor for this book
 * - onDeleteClick(bookId): called when delete is clicked (admin only)
 * - onCardClick(bookId): called when the card itself is clicked (e.g. view reviews)
 */
export default function BookCard({
  book,
  user,
  bookReviewsLen = 0,
  reviewOpenFor,
  onOpenReviewClick,
  onDeleteClick,
  onCardClick,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={() => onCardClick?.(book.id)}
      className="group relative bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-md hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight pr-2 line-clamp-2">
            {book.title}
          </h3>

          {user?.role === "admin" && (
            <motion.button
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick?.(book.id);
              }}
              className="shrink-0 text-red-500 hover:text-red-700 dark:hover:text-red-400 text-lg font-bold transition-colors"
              aria-label={`Delete ${book.title}`}
              type="button"
            >
              ✕
            </motion.button>
          )}
        </div>

        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3">
          {book.author}
        </p>

        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {book.description}
        </p>

        {/* Review badge with modern styling */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30 border border-purple-200/50 dark:border-purple-700/50">
          <span className="text-lg">⭐</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {bookReviewsLen} {bookReviewsLen === 1 ? "review" : "reviews"}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2">
          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenReviewClick?.(book.id);
              }}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-purple-600 to-cyan-600 rounded-lg hover:shadow-lg transition-all duration-200"
              type="button"
            >
              {reviewOpenFor === book.id ? "Close" : "Review"}
            </motion.button>
          ) : (
            <div className="flex-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
              Sign in to review
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
