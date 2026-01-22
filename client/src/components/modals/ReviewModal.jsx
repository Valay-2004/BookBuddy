import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, X } from "lucide-react";
import { Button, Textarea, Label } from "../ui/Core";

export default function ReviewModal({
  isOpen,
  rating = 0,
  reviewText = "",
  isSubmitting,
  onRatingChange,
  onTextChange,
  onSubmit,
  onClose,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-lg bg-paper dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-zinc-800/50">
              <h3 className="text-xl font-serif font-bold text-ink dark:text-white">
                Write a Review
              </h3>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-ink transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Star Rating Picker */}
              <div className="flex flex-col items-center justify-center gap-3 py-2">
                <Label className="mb-0">Your Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => onRatingChange(star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`transition-colors duration-200 ${
                          star <= (hoverRating || rating)
                            ? "fill-accent text-accent"
                            : "text-zinc-300 dark:text-zinc-700"
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-medium text-accent h-5">
                  {(hoverRating || rating) > 0
                    ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][
                        (hoverRating || rating) - 1
                      ]
                    : ""}
                </span>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <Label>Critique</Label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => onTextChange(e.target.value)}
                  placeholder="What did you think of the plot? The pacing? Share your honest thoughts..."
                  rows={4}
                  className="bg-white dark:bg-zinc-950/50"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="ghost" onClick={onClose}>
                  Discard
                </Button>
                <Button
                  onClick={onSubmit}
                  disabled={isSubmitting || rating === 0}
                >
                  {isSubmitting ? "Publishing..." : "Publish Review"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
