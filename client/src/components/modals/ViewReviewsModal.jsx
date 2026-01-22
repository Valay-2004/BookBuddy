import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageSquare, Star } from "lucide-react";
import { Badge } from "../ui/Core";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-paper dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start bg-white/50 dark:bg-zinc-800/50 rounded-t-2xl">
              <div>
                <h3 className="text-2xl font-serif font-bold text-ink dark:text-white">
                  Community Reviews
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="accent">{reviews.length} Reviews</Badge>
                  {reviews.length > 0 && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                      <Star size={14} className="fill-accent text-accent" />
                      {avgRating} Average
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X size={20} className="text-zinc-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center text-zinc-400">
                  <MessageSquare size={48} className="mb-4 opacity-50" />
                  <p className="font-serif text-lg text-zinc-500">
                    No reviews written yet.
                  </p>
                  <p className="text-sm">Be the first to share your opinion!</p>
                </div>
              ) : (
                reviews.map((r, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-ink dark:text-zinc-100 text-sm">
                          {r.userName || r.user || "Anonymous Reader"}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Verified Reviewer
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < r.rating
                                ? "fill-accent text-accent"
                                : "text-zinc-200 dark:text-zinc-700"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {r.reviewText ? (
                      <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed font-serif">
                        "{r.reviewText}"
                      </p>
                    ) : (
                      <p className="text-zinc-400 text-xs italic">
                        Rated without comment.
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
