import React from "react";
import { motion } from "motion/react";
import { Star, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onCardClick?.(book.id)}
      className="cursor-pointer"
    >
      <Card className="group relative overflow-hidden flex flex-col h-full hover:shadow-xl hover:shadow-brand-500/10 dark:hover:shadow-brand-500/20 transition-all duration-500 border-2 border-transparent hover:border-brand-200 dark:hover:border-brand-800 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800">
        {/* Decorative gradient line at top */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 group-hover:from-brand-500 group-hover:via-brand-600 group-hover:to-brand-700 transition-all duration-500" />

        <CardContent className="p-6 flex flex-col flex-1">
          {/* Header: Title & Actions */}
          <div className="flex justify-between items-start mb-4 gap-2">
            <motion.h3
              className="font-bold text-xl text-zinc-900 dark:text-zinc-50 leading-tight line-clamp-2 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors duration-300"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              {book.title}
            </motion.h3>

            {user?.role === "admin" && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick?.(book.id);
                  }}
                  className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-300 p-2 rounded-full"
                  aria-label="Delete Book"
                >
                  <Trash2 size={18} />
                </Button>
              </motion.div>
            )}
          </div>

          <motion.p
            className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-4 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors duration-300"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {book.author}
          </motion.p>

          <motion.div
            className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed line-clamp-3 mb-6 flex-1 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors duration-300"
            dangerouslySetInnerHTML={{ __html: book.summary }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />

          {/* Footer: Stats & Button */}
          <motion.div
            className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <motion.div
                whileHover={{ rotate: 20 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
              </motion.div>
              <span className="text-sm font-semibold">
                {bookReviewsLen} {bookReviewsLen === 1 ? "review" : "reviews"}
              </span>
            </div>

            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenReviewClick?.(book.id);
                  }}
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-brand-700 dark:hover:text-brand-300 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300"
                >
                  Write Review
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
