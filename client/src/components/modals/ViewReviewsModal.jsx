import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ViewReviewsModal - modal for viewing all reviews of a book (public, visible to everyone).
 *
 * Props:
 * - isOpen: boolean - whether the modal is visible
 * - reviews: array of review objects { rating, reviewText, userName, user, ... }
 * - onClose(): called when modal should close
 */
export default function ViewReviewsModal({ isOpen, reviews = [], onClose }) {
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

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
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.12 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Reviews
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  {reviews.length > 0 && ` • Avg: ${avgRating} ⭐`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-2xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">💭</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No reviews yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                reviews.map((r, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {r.userName || r.user || "Anonymous"}
                        </p>
                      </div>
                      <div className="text-lg font-bold text-yellow-500 flex items-center gap-1">
                        {r.rating} <span>⭐</span>
                      </div>
                    </div>
                    {r.reviewText ? (
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {r.reviewText}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                        (No review text)
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
