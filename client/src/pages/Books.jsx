import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
  });
  const { user, token } = useAuth();
  const formRef = useRef(null);

  // Focus first input when form appears
  useEffect(() => {
    if (showForm && formRef.current) {
      const firstInput = formRef.current.querySelector("input");
      firstInput?.focus();
    }
  }, [showForm]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/books?limit=1000"); // Get all books without pagination
      setBooks(Array.isArray(res.data.books) ? res.data.books : res.data || []);
    } catch (err) {
      console.error("Error fetching books:", err);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await API.post("/books", newBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Book added successfully!");
      await fetchBooks(); // Refresh the books list
      setShowForm(false);
      setNewBook({ title: "", author: "", description: "" });
    } catch (err) {
      toast.error("Failed to add book");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewBook((prev) => ({ ...prev, [field]: value }));
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <motion.div
      className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md"
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
    >
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </motion.div>
  );

  return (
    <div className="space-y-6 relative max-w-6xl mx-auto px-4 py-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 16px",
          },
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          📚 Books
          <motion.span
            className="text-sm font-normal text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <strong>({books.length})</strong>
          </motion.span>
        </h2>

        {user?.role === "admin" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            {showForm ? "Cancel" : "➕ Add Book"}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.form
              onSubmit={handleAddBook}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter book title"
                    value={newBook.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Author *
                  </label>
                  <input
                    id="author"
                    type="text"
                    placeholder="Enter author name"
                    value={newBook.author}
                    onChange={(e) =>
                      handleInputChange("author", e.target.value)
                    }
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter book description"
                    value={newBook.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {isSubmitting ? "Adding..." : "Add Book"}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
            No books found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Add your first book to get started
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                  {book.title}
                </h3>
              </div>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                by {book.author}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {book.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
