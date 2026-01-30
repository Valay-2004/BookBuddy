import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { ArrowLeft, BookOpen, User, Calendar, Loader } from "lucide-react";
import { motion } from "motion/react";
import toast from "react-hot-toast";

import API from "../services/api";
import { fetchBookDetails } from "../services/openLibrary";
import { Button } from "../components/ui/Core";
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
          // It's an Open Library book
          const olid = id.replace("OL_", "");
          // Prefix back /works/ if needed by helper, but helper expects naked ID or key? 
          // My helper `fetchBookDetails` takes `olid` and does `${OPEN_LIBRARY_BASE}/works/${olid}.json`
          // So I just pass the ID part like "OL123W".
          bookData = await fetchBookDetails(olid);
          
          if (bookData) {
             // Attempt to auto-sync to DB if it doesn't exist
             // We only do this if we successfully fetched it
             // Current API requires Admin to create books.
             // We will try silently. If 403, we ignore.
             if (token) {
                 try {
                     // Check if it exists by title/author first? 
                     // Or just try to create and rely on constraints? 
                     // For now, let's just create.
                     await API.post("/books", {
                         title: bookData.title,
                         author: bookData.author,
                         description: bookData.description,
                         cover_url: bookData.cover_url,
                         published_year: bookData.published_year,
                         // we don't have ISBN easily from works API usually, unless we fetch editions.
                     }, {
                        headers: { Authorization: `Bearer ${token}` }
                     });
                     // If success, user might be redirected to the internal version next time? 
                     // For now, just stay on this view.
                 } catch (e) {
                     // Ignore partial failures (e.g. not admin, or already exists)
                 }
             }
          }

        } else {
          // It's an internal book
          const { data } = await API.get(`/books/${id}`);
          bookData = data.book;
        }

        if (!bookData) {
            throw new Error("Book not found");
        }
        setBook(bookData);

      } catch (err) {
        console.error(err);
        setError("Failed to load book details.");
        toast.error("Could not load book.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        loadBook();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-dark-paper">
        <Loader className="animate-spin text-accent" size={48} />
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
                {/* Cover Image Side (or Top) */}
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

                {/* Details Side */}
                <div className="p-8 md:w-2/3">
                    <h1 className="text-4xl font-serif font-black text-ink dark:text-white mb-2 leading-tight">
                        {book.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-zinc-500 dark:text-zinc-400 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-6">
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
                        {/* Rating could go here if available */}
                    </div>

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
        </motion.div>
      </div>
    </div>
  );
}
