import React from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

/**
 * ReviewModal - modal for adding/editing a review for a book.
 *
 * Props:
 * - isOpen: boolean - whether the modal is visible
 * - bookId: id of the book being reviewed
 * - rating: current rating value (1-5)
 * - reviewText: current review text
 * - isSubmitting: boolean - whether submit is in progress
 * - onRatingChange(value): called when rating is changed
 * - onTextChange(value): called when review text is changed
 * - onSubmit(): called when Save button is clicked
 * - onClose(): called when modal should close
 */
export default function ReviewModal({
  isOpen,
  bookId,
  rating,
  reviewText,
  isSubmitting,
  onRatingChange,
  onTextChange,
  onSubmit,
  onClose,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Add / Edit Review
            </h3>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-fit">
                  Rating:
                </label>
                <select
                  value={rating}
                  onChange={(e) => onRatingChange(Number(e.target.value))}
                  className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} ⭐
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Review (optional)
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => onTextChange(e.target.value)}
                  rows={5}
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none"
                  placeholder="Share your thoughts about this book..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
