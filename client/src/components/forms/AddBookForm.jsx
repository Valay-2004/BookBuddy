import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Search } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AddBookForm({ onAdd, onCancel, isSubmitting }) {
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    summary: "",
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: newBook.summary,
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
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
          newBook.title
        )}&limit=1`
      );
      const data = await response.json();
      if (data.docs && data.docs.length > 0) {
        const book = data.docs[0];
        setNewBook({
          ...newBook,
          author: book.author_name ? book.author_name[0] : newBook.author,
          summary: book.first_sentence
            ? book.first_sentence[0]
            : book.description
            ? typeof book.description === "string"
              ? book.description
              : book.description.value
            : newBook.summary,
        });
        toast.success("Book data fetched successfully");
      } else {
        toast.error("Book not found");
      }
    } catch (error) {
      toast.error("Failed to fetch book data");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -20 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -20 }}
      className="mb-8 overflow-hidden"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Add to Library</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <div className="flex gap-2">
                  <Input
                    id="title"
                    type="text"
                    required
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook({ ...newBook, title: e.target.value })
                    }
                    placeholder="The Great Gatsby"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fetchBookData}
                  >
                    <Search size={16} />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  type="text"
                  required
                  value={newBook.author}
                  onChange={(e) =>
                    setNewBook({ ...newBook, author: e.target.value })
                  }
                  placeholder="F. Scott Fitzgerald"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <div className="border rounded-md p-2 min-h-[100px] bg-background">
                <EditorContent editor={editor} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Book"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
