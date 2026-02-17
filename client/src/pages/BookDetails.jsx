import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  ArrowLeft,
  BookOpen,
  User,
  Calendar,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import { motion } from "motion/react";
import toast from "react-hot-toast";

import API from "../services/api";
import { fetchBookDetails } from "../services/openLibrary";
import { Skeleton, Button, cn } from "../components/ui/Core";
import { useAuth } from "../context/AuthContext";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      setError(null);
      try {
        let bookData = null;

        if (id.startsWith("OL_")) {
          // Open Library external book
          const olid = id.replace("OL_", "");
          bookData = await fetchBookDetails(olid);

          // Try to sync to DB silently (admin-only, may fail)
          if (bookData && token) {
            // Quality Check: Ensure it has a cover and a non-generic, substantial summary
            const isGeneric =
              bookData.description?.toLowerCase().includes("a book titled") ||
              bookData.description?.toLowerCase() ===
                bookData.title.toLowerCase();
            const hasEnoughWords =
              (bookData.description?.split(/\s+/).length || 0) >= 20;

            if (bookData.cover_url && !isGeneric && hasEnoughWords) {
              try {
                await API.post("/books", {
                  title: bookData.title,
                  author: bookData.author,
                  description: bookData.description,
                  cover_url: bookData.cover_url,
                  published_year: bookData.published_year,
                  read_url: bookData.read_url,
                  gutenberg_id: bookData.gutenberg_id,
                });
              } catch {
                // Ignore — already exists or network error
              }
            }
          }
        } else {
          // Internal book
          const { data } = await API.get(`/books/${id}`);
          bookData = data.book;
        }

        if (!bookData) throw new Error("Book not found");
        setBook(bookData);
      } catch (err) {
        console.error(err);
        setError("Failed to load book details.");
        toast.error("Could not load book.");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadBook();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper dark:bg-dark-paper py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-24 mb-8" />
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
            <div className="md:flex">
              <div className="md:w-1/3 bg-zinc-50 dark:bg-zinc-950 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800">
                <Skeleton className="w-48 aspect-[2/3] rounded-lg" />
              </div>
              <div className="p-8 md:w-2/3 space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="flex gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper dark:bg-dark-paper space-y-4">
        <p className="text-xl text-zinc-500">{error || "Book not found"}</p>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-paper py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
        >
          <div className="md:flex">
            {/* Cover Image */}
            <div className="md:w-1/3 bg-zinc-50 dark:bg-zinc-950 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800">
              <div className="w-48 aspect-[2/3] shadow-lg rounded-lg overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src={book.cover_url || "/covers/fallback-book.png"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/covers/fallback-book.png";
                  }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="p-8 md:w-2/3">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-serif font-black text-ink dark:text-white mb-2 leading-tight">
                    {book.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <User size={18} />
                      <span className="font-medium">{book.author}</span>
                    </div>
                    {book.published_year && (
                      <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        <span>{book.published_year}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Read Online Button */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                  <Button
                    disabled={!book.read_url && !book.gutenberg_id}
                    onClick={() => {
                      if (book.gutenberg_id) {
                        const url = `https://www.gutenberg.org/cache/epub/${book.gutenberg_id}/pg${book.gutenberg_id}-images.html`;
                        window.open(url, "_blank");
                      } else if (book.read_url) {
                        window.open(book.read_url, "_blank");
                      }
                    }}
                    className={cn(
                      "font-bold flex items-center justify-center gap-2 py-6 text-lg shadow-lg transition-all",
                      !book.read_url && !book.gutenberg_id
                        ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed shadow-none"
                        : "bg-accent hover:bg-accent/90 text-white",
                    )}
                  >
                    <BookOpen size={20} />
                    {!book.read_url && !book.gutenberg_id
                      ? "Read Unavailable"
                      : "Read Online"}
                  </Button>

                  <Button
                    onClick={() => {
                      const query = encodeURIComponent(
                        `buy "${book.title}" "${book.author}" online`,
                      );
                      window.open(
                        `https://www.google.com/search?q=${query}`,
                        "_blank",
                      );
                    }}
                    variant="outline"
                    className="font-bold flex items-center justify-center gap-2 py-6 text-lg shadow-sm hover:shadow-md transition-all border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <ShoppingCart size={20} className="text-accent" />
                    Buy Book
                  </Button>
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                <div className="prose dark:prose-invert prose-lg max-w-none text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed">
                  <h3 className="text-lg font-bold font-serif text-ink dark:text-white mb-4 flex items-center gap-2">
                    <BookOpen size={20} className="text-accent" />
                    Synopsis
                  </h3>
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {book.description || "*No description available.*"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
