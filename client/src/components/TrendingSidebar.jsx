import React from "react";

export default function TrendingSidebar({ trendingBooks, onBookClick }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold font-serif mb-4 border-b pb-2">
        Trending Now
      </h3>
      <ul className="space-y-4">
        {trendingBooks.length > 0
          ? trendingBooks.map((book, i) => (
              <li
                key={book.id || i}
                className="flex gap-3 group cursor-pointer"
                onClick={() => onBookClick(book.id)}
              >
                <span className="text-2xl font-black text-zinc-200 group-hover:text-accent transition-colors">
                  0{i + 1}
                </span>
                <div>
                  <p className="font-bold text-sm group-hover:underline line-clamp-2">
                    {book.title}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {book.author}
                  </p>
                </div>
              </li>
            ))
          : [1, 2, 3].map((i) => (
              <li key={i} className="flex gap-3 group animate-pulse">
                <span className="text-2xl font-black text-zinc-200">
                  0{i}
                </span>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                  <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                </div>
              </li>
            ))}
      </ul>
    </div>
  );
}
