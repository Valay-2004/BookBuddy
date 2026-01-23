import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Search, BookPlus } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Input, Label } from "../ui/Core";
import { toast } from "react-hot-toast";

export default function AddBookForm({ onAdd, onCancel, isSubmitting }) {
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    summary: "",
    isbn: "",
    cover_url: "",
    published_year: "",
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: newBook.summary,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm focus:outline-none min-h-[120px] max-w-none dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      setNewBook((prev) => ({ ...prev, summary: editor.getHTML() }));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newBook);
  };

  const fetchBookData = async () => {
    if (!newBook.title.trim()) {
      toast.error("Please enter a title first");
      return;
    }
    const toastId = toast.loading("Searching archives...");
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(newBook.title)}&limit=1`,
      );
      const data = await response.json();
      if (data.docs && data.docs.length > 0) {
        const book = data.docs[0];
        const summaryText = book.first_sentence ? book.first_sentence[0] : "";

        setNewBook({
          ...newBook,
          author: book.author_name ? book.author_name[0] : newBook.author,
          summary: summaryText,
        });

        if (editor) editor.commands.setContent(summaryText);
        toast.success("Found it!", { id: toastId });
      } else {
        toast.error("Book not found in archives", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to connect to library database", { id: toastId });
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-ink dark:text-white flex items-center gap-2">
            <BookPlus className="text-accent" size={24} />
            Acquire New Title
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Add a new book to the public collection.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title Input with Search */}
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <div className="relative flex gap-2">
              <Input
                id="title"
                required
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                placeholder="e.g. The Great Gatsby"
                className="pr-12"
              />
              <button
                type="button"
                onClick={fetchBookData}
                className="absolute right-2 top-1.5 p-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-accent rounded-md transition-colors"
                title="Auto-fill from OpenLibrary"
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              required
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
              placeholder="e.g. F. Scott Fitzgerald"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label>Summary / Notes</Label>
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-900 focus-within:ring-2 focus-within:ring-accent/10 focus-within:border-accent transition-all">
            <EditorContent editor={editor} />
          </div>
          <p className="text-xs text-zinc-400 text-right pt-1">
            Powered by Tiptap Editor
          </p>
        </div>

        {/* Optional Metadata Fields */}
        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Optional Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={newBook.isbn}
                onChange={(e) =>
                  setNewBook({ ...newBook, isbn: e.target.value })
                }
                placeholder="e.g. 978-0743273565"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="cover_url">Cover URL</Label>
              <Input
                id="cover_url"
                value={newBook.cover_url}
                onChange={(e) =>
                  setNewBook({ ...newBook, cover_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="published_year">Published Year</Label>
              <Input
                id="published_year"
                type="number"
                value={newBook.published_year}
                onChange={(e) =>
                  setNewBook({ ...newBook, published_year: e.target.value })
                }
                placeholder="e.g. 2024"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Cataloging..." : "Add to Library"}
          </Button>
        </div>
      </form>
    </div>
  );
}
