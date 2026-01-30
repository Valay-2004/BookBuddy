import { motion } from "motion/react";
import { Star, MessageCircle, Trash2, BookOpen } from "lucide-react";
import { Button, Badge } from "./ui/Core";

// Helper for Star Rating Display
const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        className={
          star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-zinc-300 dark:text-zinc-600"
        }
      />
    ))}
  </div>
);

export default function BookList({
  books,
  isLoading,
  user,
  bookReviews,
  onOpenReview,
  onViewReviews,
  onDelete,
  onCardClick,
}) {
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-6 h-48">
            <div className="w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg shrink-0" />
            <div className="flex-1 space-y-4 py-2">
              <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-20 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 mt-8">
        <BookOpen className="mx-auto h-12 w-12 text-zinc-300" />
        <p className="mt-2 text-zinc-500 font-serif text-lg italic">
          No books found in the library.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 mt-8">
      {books.map((book, index) => {
        // Calculate average rating from the reviews prop if available
        // Use server-provided stats
        const avgRating = parseFloat(book.avg_rating) || 0;
        const reviewCount = parseInt(book.review_count) || 0;

        return (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onCardClick?.(book.id)}
            className="group flex flex-col sm:flex-row gap-6 p-4 sm:p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/30 transition-all duration-300 cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="shrink-0 relative">
              <div className="w-32 sm:w-40 aspect-2/3 rounded-lg shadow-md overflow-hidden bg-zinc-200">
                {book.cover_url ? (
                  <img
                    src={book.cover_url || "/covers/fallback-book.png"}
                    alt={book.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/covers/fallback-book.png";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                    <BookOpen size={32} />
                  </div>
                )}
              </div>

              {/* Floating Badge for Rating */}
              {avgRating > 0 && (
                <div className="absolute -bottom-3 -right-3 bg-white dark:bg-zinc-800 shadow-lg px-2 py-1 rounded-lg flex items-center gap-1 border border-zinc-100 dark:border-zinc-700">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold">
                    {avgRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="accent">Fiction</Badge>{" "}
                  {/* Dynamic category if available */}
                  <h3 className="mt-2 text-2xl font-serif font-bold text-ink dark:text-gray-100 leading-tight group-hover:text-accent transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wide">
                    by {book.author}
                  </p>
                </div>

                {/* Admin Actions */}
                {user?.role === "admin" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(book.id);
                    }}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {/* Description / Blurb */}
              {/* Description / Blurb */}
              <div 
                className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3 md:line-clamp-4 font-sans"
                dangerouslySetInnerHTML={{ __html: book.description || "No description available." }}
              />

              {/* Footer Actions */}
              <div className="mt-auto pt-6 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                  <span>{reviewCount} Reviews</span>
                  <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                  <span>
                    {book.published_year ? `Published ${book.published_year}` : "Publication year unknown"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewReviews(book.id);
                    }}
                  >
                    View Reviews
                  </Button>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReview(book.id);
                    }}
                  >
                    <MessageCircle size={16} />
                    Review
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
