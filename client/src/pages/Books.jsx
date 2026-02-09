import React, { useEffect, useReducer, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

// Components
import BookList from "../components/BookList"; 
import AddBookForm from "../components/forms/AddBookForm";
import ReviewModal from "../components/modals/ReviewModal";
import ViewReviewsModal from "../components/modals/ViewReviewsModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import { Button } from "../components/ui/Core";
import BooksHero from "../components/BooksHero";
import EditorsPick from "../components/EditorsPick";
import TrendingSidebar from "../components/TrendingSidebar";

// Books reducer for complex state management
const booksReducer = (state, action) => {
  switch (action.type) {
    case "SET_BOOKS":
      return { ...state, books: action.payload.books, totalPages: action.payload.totalPages };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SEARCHING":
      return { ...state, isSearching: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_TOP_RATED":
      return { ...state, topRatedBook: action.payload };
    case "TOGGLE_ADD_FORM":
      return { ...state, showAddForm: !state.showAddForm };
    case "SET_ADD_FORM":
      return { ...state, showAddForm: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_REVIEW_OPEN":
      return { ...state, reviewOpenFor: action.payload };
    case "SET_VIEW_REVIEWS":
      return { ...state, viewReviewsFor: action.payload };
    case "SET_DELETE_CONFIRM":
      return { ...state, deleteConfirmId: action.payload };
    case "SET_BOOK_REVIEWS":
      return { ...state, bookReviews: { ...state.bookReviews, ...action.payload } };
    case "SET_REVIEW_RATING":
      return { ...state, reviewRating: action.payload };
    case "SET_REVIEW_TEXT":
      return { ...state, reviewText: action.payload };
    case "SET_REVIEW_SUBMITTING":
      return { ...state, isReviewSubmitting: action.payload };
    case "RESET_REVIEW_FORM":
      return { ...state, reviewRating: 5, reviewText: "", reviewOpenFor: null };
    default:
      return state;
  }
};

const initialBooksState = {
  books: [],
  loading: true,
  page: 1,
  totalPages: 1,
  searchTerm: "",
  isSearching: false,
  topRatedBook: null,
  showAddForm: false,
  isSubmitting: false,
  reviewOpenFor: null,
  viewReviewsFor: null,
  deleteConfirmId: null,
  bookReviews: {},
  reviewRating: 5,
  reviewText: "",
  isReviewSubmitting: false,
};

import { useSearchParams } from "react-router-dom";

// ... (imports remain the same)

export default function Books() {
  const { user, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialSearch = searchParams.get("search") || "";

  const [state, dispatch] = useReducer(booksReducer, {
    ...initialBooksState,
    page: initialPage,
    searchTerm: initialSearch,
    // If there's a search term, we should probably be in "searching" mode initially, 
    // but the effect will handle the fetch.
  });

  // Sync URL with state changes
  useEffect(() => {
    const params = {};
    if (state.page > 1) params.page = state.page;
    if (state.searchTerm) params.search = state.searchTerm;
    setSearchParams(params, { replace: true });
  }, [state.page, state.searchTerm, setSearchParams]);

  // Handle back/forward navigation or manual URL changes (including logo click)
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1", 10);
    const urlSearch = searchParams.get("search") || "";

    if (urlPage !== state.page) {
      dispatch({ type: "SET_PAGE", payload: urlPage });
    }
    if (urlSearch !== state.searchTerm) {
      dispatch({ type: "SET_SEARCH_TERM", payload: urlSearch });
    }
  }, [searchParams]); // Only run when URL params change

  const attachCoverUrls = (books) => {
    // ... (same as before)
    return books.map((book) => {
      let cover_url = book.cover_url;
      if (!cover_url) {
        cover_url = `https://covers.openlibrary.org/b/title/${encodeURIComponent(
          book.title,
        )}-M.jpg`;
      }
      return { ...book, cover_url };
    });
  };

  const fetchBooks = useCallback(async (pageNum) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data } = await API.get(`/books?page=${pageNum}&limit=5`);
      const booksWithCovers = attachCoverUrls(data.books);
      dispatch({ type: "SET_BOOKS", payload: { books: booksWithCovers, totalPages: data.totalPages } });
    } catch (err) {
      toast.error("Failed to load library");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Handle Search & Initial Load
  useEffect(() => {
    if (state.searchTerm) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch(state.searchTerm);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      // If no search term, fetch normal list
      fetchBooks(state.page);
    }
  }, [state.searchTerm, state.page, fetchBooks]);

  const handleSearch = async (query) => {
    dispatch({ type: "SET_SEARCHING", payload: true });
    try {
      const { data } = await API.get(`/books/search?q=${query}`);
      const booksWithCovers = attachCoverUrls(data.books);
      dispatch({ type: "SET_BOOKS", payload: { books: booksWithCovers, totalPages: 1 } });
    } catch (err) {
      toast.error("Search failed");
    } finally {
      dispatch({ type: "SET_SEARCHING", payload: false });
    }
  };

  // N+1 problem fixed: Reviews are now aggregated on the server in listBooks
  // We only need to fetch reviews when the user actually views them or opens the review modal

  // Fetch top rated book for sidebar
  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const { data } = await API.get("/books/top-rated");
        if (data.book) {
          const [bookWithCover] = attachCoverUrls([data.book]);
          dispatch({ type: "SET_TOP_RATED", payload: bookWithCover });
        }
      } catch (e) {
        console.error("Top rated error", e);
      }
    };
    fetchTopRated();
  }, []);

  const [trendingBooks, setTrendingBooks] = useState([]);

  useEffect(() => {
    import("../services/openLibrary").then(({ fetchTrendingBooks }) => {
      fetchTrendingBooks().then(setTrendingBooks);
    });
  }, []);

  const navigate = useNavigate();
  const handleBookClick = (bookId) => {
     navigate(`/book/${bookId}`);
  };

  const handleAddBook = async (bookData) => {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      await API.post("/books", bookData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Book added!");
      dispatch({ type: "SET_ADD_FORM", payload: false });
      fetchBooks(1);
    } catch (err) {
      toast.error("Failed to add book");
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const handleReviewSubmit = async () => {
    if (!state.reviewOpenFor) {
      toast.error("Book ID is missing");
      return;
    }
    dispatch({ type: "SET_REVIEW_SUBMITTING", payload: true });
    try {
      await API.post(`/books/${state.reviewOpenFor}/reviews`, {
        rating: state.reviewRating,
        reviewText: state.reviewText,
      });
      toast.success("Review posted");
      // Refresh reviews for this book
      const { data } = await API.get(`/books/${state.reviewOpenFor}/reviews`);
      dispatch({ type: "SET_BOOK_REVIEWS", payload: { [state.reviewOpenFor]: data } });
      dispatch({ type: "RESET_REVIEW_FORM" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post review");
    } finally {
      dispatch({ type: "SET_REVIEW_SUBMITTING", payload: false });
    }
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-paper">
      <div className="editorial-container py-12">
        <Toaster position="bottom-right" />

        <BooksHero 
          user={user}
          searchTerm={state.searchTerm}
          isSearching={state.isSearching}
          onSearchChange={(val) => dispatch({ type: "SET_SEARCH_TERM", payload: val })}
          onToggleAddForm={() => dispatch({ type: "TOGGLE_ADD_FORM" })}
        />

        {/* Add Form Collapse */}
        <AnimatePresence>
          {state.showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                <AddBookForm
                  onAdd={handleAddBook}
                  onCancel={() => dispatch({ type: "SET_ADD_FORM", payload: false })}
                  isSubmitting={state.isSubmitting}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content: 8 Columns */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-serif">Latest Releases</h2>
              <span className="text-sm text-zinc-400">
                Showing page {state.page} of {state.totalPages}
              </span>
            </div>

            <BookList
              books={state.books}
              isLoading={state.loading}
              user={user}
              bookReviews={state.bookReviews}
              onOpenReview={(id) => dispatch({ type: "SET_REVIEW_OPEN", payload: id })}
              onViewReviews={(id) => dispatch({ type: "SET_VIEW_REVIEWS", payload: id })}
              onDelete={(id) => dispatch({ type: "SET_DELETE_CONFIRM", payload: id })}
              onCardClick={handleBookClick}
            />

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-16">
              <Button
                variant="secondary"
                onClick={() => dispatch({ type: "SET_PAGE", payload: Math.max(1, state.page - 1) })}
                disabled={state.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => dispatch({ type: "SET_PAGE", payload: Math.min(state.totalPages, state.page + 1) })}
                disabled={state.page === state.totalPages}
              >
                Next
              </Button>
            </div>
          </div>


          {/* Sidebar: 4 Columns */}
          <div className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="sticky top-24">
              <EditorsPick 
                topRatedBook={state.topRatedBook} 
                defaultBook={state.books[0]} 
              />
              <TrendingSidebar 
                trendingBooks={trendingBooks} 
                onBookClick={handleBookClick} 
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <ViewReviewsModal
          isOpen={!!state.viewReviewsFor}
          reviews={state.bookReviews[state.viewReviewsFor] || []}
          onClose={() => dispatch({ type: "SET_VIEW_REVIEWS", payload: null })}
        />

        <ReviewModal
          isOpen={!!state.reviewOpenFor}
          rating={state.reviewRating}
          reviewText={state.reviewText}
          isSubmitting={state.isReviewSubmitting}
          onRatingChange={(rating) => dispatch({ type: "SET_REVIEW_RATING", payload: rating })}
          onTextChange={(text) => dispatch({ type: "SET_REVIEW_TEXT", payload: text })}
          onSubmit={handleReviewSubmit}
          onClose={() => dispatch({ type: "RESET_REVIEW_FORM" })}
        />

        <DeleteConfirmModal
          isOpen={!!state.deleteConfirmId}
          isDeleting={state.loading}
          onConfirm={async () => {
            await API.delete(`/books/${state.deleteConfirmId}`);
            dispatch({ type: "SET_DELETE_CONFIRM", payload: null });
            fetchBooks(state.page);
          }}
          onCancel={() => dispatch({ type: "SET_DELETE_CONFIRM", payload: null })}
        />
      </div>
    </div>
  );
}
