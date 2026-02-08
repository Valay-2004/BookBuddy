import React from "react";
import { motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import { Button } from "./ui/Core";

export default function BooksHero({ 
  user, 
  searchTerm, 
  isSearching, 
  onSearchChange, 
  onToggleAddForm 
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-8">
      <div className="max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-serif font-black text-ink dark:text-white mb-4 tracking-tighter"
        >
          The <span className="text-accent italic">Review</span>.
        </motion.h1>
        <p className="text-xl text-zinc-500 font-light max-w-lg">
          Curated reading lists and honest critiques for the modern
          bibliophile.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <motion.div 
          className="relative hidden sm:block"
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Search
            className={`absolute left-3 top-2.5 transition-colors duration-300 ${isSearching ? "text-accent animate-pulse" : "text-zinc-400"}`}
            size={18}
          />
          <input
            type="text"
            placeholder="Search titles..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all duration-300 w-64 focus:w-80"
          />
        </motion.div>

        {user?.role === "admin" && (
          <Button onClick={onToggleAddForm}>
            <Plus size={18} />
            <span className="hidden sm:inline">Add Title</span>
          </Button>
        )}
      </div>
    </div>
  );
}
