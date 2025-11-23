import React from "react";
import { motion, AnimatePresence } from "motion/react";
import BookCard from "./BookCard";
import BookSkeleton from "./ui/BookSkeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function BookGrid({
  books,
  isLoading,
  user,
  bookReviews,
  reviewOpenFor,
  onOpenReview,
  onDelete,
  onViewReviews,
}) {
  // 1. Show Skeletons when loading (Prevents flashing empty screen)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <BookSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 2. Empty State
  if (!books?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="text-8xl mb-4 opacity-20 grayscale">📚</div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          No books found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add a book to get the library started.
        </p>
      </motion.div>
    );
  }

  // 3. Grid Content
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {books.map((book) => (
          <motion.div
            key={book.id}
            variants={itemVariants}
            layout // This magic prop smooths out grid re-shuffling
          >
            <BookCard
              book={book}
              user={user}
              bookReviewsLen={bookReviews[book.id]?.length ?? 0}
              reviewOpenFor={reviewOpenFor}
              onOpenReviewClick={onOpenReview}
              onDeleteClick={onDelete}
              onCardClick={onViewReviews}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
