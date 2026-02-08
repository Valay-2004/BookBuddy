import React from "react";

export default function EditorsPick({ topRatedBook, defaultBook }) {
  const book = topRatedBook || defaultBook;
  
  return (
    <div className="p-6 bg-accent/5 dark:bg-accent/10 rounded-2xl border border-accent/10">
      <h3 className="text-lg font-bold font-serif mb-4 text-accent-hover">
        Editor's Pick
      </h3>
      <div className="relative aspect-[2/3] mb-4 w-full overflow-hidden rounded-lg shadow-md group">
        <img
          src={
            book?.cover_url?.replace("-M.jpg", "-L.jpg") ||
            "/covers/fallback-book.png"
          }
          alt={book?.title || "Seeking Recommendations..."}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/covers/fallback-book.png";
          }}
        />
      </div>
      <h4 className="font-bold text-lg leading-tight">
        {book?.title || "Seeking Recommendations..."}
      </h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
        by {book?.author || "Unknown"}
      </p>
      {book?.published_year && (
        <p className="text-xs text-zinc-400 mt-1">
          Published {book.published_year}
        </p>
      )}
    </div>
  );
}
