import React from "react";
import { motion } from "motion/react";
import { Star, Trash2 } from "lucide-react";

export default function BookCard({
  book,
  user,
  bookReviewsLen = 0,
  onOpenReviewClick,
  onDeleteClick,
  onCardClick,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onClick={() => onCardClick?.(book.id)}
      className="surface-card group relative overflow-hidden cursor-pointer flex flex-col h-full hover:border-brand-300 dark:hover:border-brand-700 transition-colors duration-300"
    >
      {/* Decorative colored line at top */}
      <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-brand-500 transition-colors duration-300" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header: Title & Actions */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2">
            {book.title}
          </h3>

          {user?.role === "admin" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick?.(book.id);
              }}
              className="text-zinc-400 hover:text-red-500 transition-colors p-1 -mr-2"
              aria-label="Delete Book"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-3">
          {book.author}
        </p>

        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
          {book.description}
        </p>

        {/* Footer: Stats & Button */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">
              {bookReviewsLen} {bookReviewsLen === 1 ? "review" : "reviews"}
            </span>
          </div>

          {user && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenReviewClick?.(book.id);
              }}
              className="text-xs font-medium text-zinc-500 hover:text-brand-600 dark:hover:text-brand-400 underline underline-offset-2 transition-colors"
            >
              Write Review
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
