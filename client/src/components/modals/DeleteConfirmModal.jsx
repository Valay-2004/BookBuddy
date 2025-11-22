import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * DeleteConfirmModal - confirmation modal before deleting a book (admin only).
 *
 * Props:
 * - isOpen: boolean - whether the modal is visible
 * - isDeleting: boolean - whether delete is in progress
 * - onConfirm(): called when Delete button is clicked
 * - onCancel(): called when Cancel button is clicked
 */
export default function DeleteConfirmModal({
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Delete Book?
            </h3>

            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              This action cannot be undone. All reviews associated with this
              book will also be deleted.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-6 py-3 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
