import React from "react";

export default function BookSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 h-full flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />

      <div className="space-y-2 flex-1">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}
