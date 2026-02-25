import React from "react";

const RecipeCardSkeleton = () => {
  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl p-3 md:w-[33%] w-[49.5%] animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-video bg-gray-200 dark:bg-slate-700 rounded-xl" />

      {/* Title skeleton */}
      <div className="w-3/4 h-6 bg-gray-200 dark:bg-slate-700 rounded" />

      {/* Description skeleton */}
      <div className="w-full h-4 bg-gray-200 dark:bg-slate-700 rounded" />
      <div className="w-2/3 h-4 bg-gray-200 dark:bg-slate-700 rounded" />

      {/* Category skeleton */}
      <div className="w-1/2 h-4 bg-gray-200 dark:bg-slate-700 rounded" />
    </div>
  );
};

export default RecipeCardSkeleton;
