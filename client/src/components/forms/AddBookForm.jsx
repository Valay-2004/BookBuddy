import React, { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

export default function AddBookForm({ onAdd, onCancel, isSubmitting }) {
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newBook);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -20 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -20 }}
      className="mb-8 overflow-hidden"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 relative"
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Add to Library
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="The Great Gatsby"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                Author
              </label>
              <input
                type="text"
                required
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="F. Scott Fitzgerald"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={newBook.description}
              onChange={(e) =>
                setNewBook({ ...newBook, description: e.target.value })
              }
              className="w-full flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              placeholder="A short summary..."
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Book"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
