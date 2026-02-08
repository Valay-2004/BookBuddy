import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import { Plus, BookOpen, X, List, Trash2 } from "lucide-react";
import { readingListAPI } from "../services/api";
import { Button, Input, Label, Textarea, Badge, Skeleton } from "../components/ui/Core";

export default function ReadingLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newList, setNewList] = useState({
    name: "",
    description: "",
    isPublic: true,
  });

  // Collection Details State
  const [selectedList, setSelectedList] = useState(null);
  const [listBooks, setListBooks] = useState([]);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await readingListAPI.getUserLists();
      setLists(response.data.lists);
    } catch (error) {
      console.error("Failed to fetch lists", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCollection = async (list) => {
    setSelectedList(list);
    setIsDetailsLoading(true);
    setListBooks([]);
    try {
      const { data } = await readingListAPI.getList(list.id);
      setListBooks(data.books);
    } catch (error) {
      console.error("Failed to fetch list books", error);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newList.name.trim()) return;
    try {
      await readingListAPI.createList(newList);
      setNewList({ name: "", description: "", isPublic: true });
      setIsCreateDialogOpen(false);
      fetchLists();
    } catch (error) {
      console.error("Failed to create list", error);
    }
  };

  const handleRemoveBook = async (bookId) => {
    if (!selectedList) return;
    
    // Optimistic Update: Remove book from local state instantly
    const previousBooks = [...listBooks];
    setListBooks(listBooks.filter(b => b.id !== bookId));
    
    try {
      await readingListAPI.removeBook(selectedList.id, bookId);
      toast.success("Removed from list");
    } catch (error) {
      console.error("Failed to remove book", error);
      toast.error("Failed to remove book");
      // Rollback if server fails
      setListBooks(previousBooks);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper dark:bg-dark-paper p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-paper p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <h1 className="text-4xl font-serif font-black text-ink dark:text-white tracking-tight">
              Curated <span className="text-accent italic">Collections</span>
            </h1>
            <p className="mt-2 text-zinc-500 max-w-lg">
              Organize your reading journey into custom lists and track your
              progress.
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus size={18} />
            Create List
          </Button>
        </div>

        {/* Empty State */}
        {lists.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <List className="mx-auto h-12 w-12 text-zinc-300 mb-3" />
            <h3 className="font-serif text-xl text-zinc-500">
              No lists created yet
            </h3>
            <p className="text-zinc-400 text-sm">
              Start by creating your first collection.
            </p>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list, i) => (
            <motion.div
              key={list.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleViewCollection(list)}
              className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl hover:shadow-xl hover:border-accent/30 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute top-6 right-6">
                <Badge variant={list.is_public ? "accent" : "neutral"}>
                  {list.is_public ? "Public" : "Private"}
                </Badge>
              </div>

              <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800 w-fit rounded-lg text-accent">
                <BookOpen size={24} />
              </div>

              <h3 className="text-xl font-serif font-bold text-ink dark:text-white mb-2 group-hover:text-accent transition-colors">
                {list.name}
              </h3>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 min-h-[40px]">
                {list.description || "No description provided."}
              </p>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs font-medium text-zinc-400">
                <span>Updated recently</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  View Collection &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Collection Details Modal */}
      <AnimatePresence>
        {selectedList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => setSelectedList(null)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-2xl bg-paper dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-ink dark:text-white">
                    {selectedList.name}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1 italic">
                    {selectedList.description || "A curated collection of titles."}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedList(null)}
                  className="text-zinc-400 hover:text-ink transition-colors p-1"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 custom-scrollbar">
                {isDetailsLoading ? (
                  <div className="space-y-4 py-8">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="flex gap-4 p-4 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <Skeleton className="w-16 h-24 shrink-0 rounded" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-3 w-1/4" />
                          <div className="pt-2 space-y-1">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : listBooks.length === 0 ? (
                  <div className="text-center py-12 text-zinc-400">
                    <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="font-serif italic">This collection is currently empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listBooks.map((book) => (
                      <div 
                        key={book.id}
                        className="flex gap-4 p-4 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 group hover:border-accent/40 transition-all duration-300"
                      >
                        <div className="w-16 h-24 shrink-0 rounded shadow-sm overflow-hidden bg-zinc-200">
                          <img 
                            src={book.cover_url || `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-M.jpg`} 
                            alt={book.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/covers/fallback-book.png";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-ink dark:text-white group-hover:text-accent transition-colors">
                              {book.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveBook(book.id);
                              }}
                              className="text-zinc-300 hover:text-red-500 transition-colors"
                              title="Remove from list"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-xs text-zinc-500 mb-2">by {book.author}</p>
                          <div 
                            className="text-xs text-zinc-400 line-clamp-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: book.description }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Modal for Create List */}
      <AnimatePresence>
        {isCreateDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => setIsCreateDialogOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-bold">New Collection</h3>
                <button
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="text-zinc-400 hover:text-ink transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Collection Name</Label>
                  <Input
                    id="name"
                    value={newList.name}
                    onChange={(e) =>
                      setNewList({ ...newList, name: e.target.value })
                    }
                    placeholder="e.g. Summer Reads 2026"
                    autoFocus
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newList.description}
                    onChange={(e) =>
                      setNewList({ ...newList, description: e.target.value })
                    }
                    placeholder="What is this collection about?"
                    rows={3}
                  />
                </div>

                <div className="pt-2 flex gap-3 justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateList}>Create List</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
