"use client";
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryProps } from "@/app/types";
import { useCategories } from "../hooks/useRecipes";
import CategorySkeleton from "../components/CategorySkeleton";

// Memoized individual category item to avoid re-rendering all items on scroll
const CategoryItem = memo(({ category }: { category: CategoryProps }) => (
  <Link
    href={`/discover?category=${encodeURIComponent(category.category)}`}
    className="flex flex-col items-center p-2 md:p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors snap-center shrink-0"
  >
    <div className="rounded-full lg:w-[180px] md:w-[150px] w-[80px] aspect-square overflow-hidden bg-gray-50 dark:bg-slate-700 flex-center relative">
      <Image
        src={category.thumbnail || "/placeholder.jpg"}
        alt={category.category}
        width={180}
        height={180}
        className="object-cover w-full h-full"
        loading="lazy"
        sizes="(max-width: 768px) 80px, (max-width: 1024px) 150px, 180px"
      />
    </div>
    <span className="text-black dark:text-slate-200 font-bold text-[0.85rem] md:text-[1rem] text-center mt-2 whitespace-nowrap">
      {category.category}
    </span>
  </Link>
));

CategoryItem.displayName = "CategoryItem";

const Categories = () => {
  const { data: categories = [], isLoading, isError, error } = useCategories();
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showRightIcon, setShowRightIcon] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftIcon(el.scrollLeft > 0);
    setShowRightIcon(el.scrollLeft + el.clientWidth < el.scrollWidth);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Use passive listener — the handler never calls preventDefault, so this
    // lets the browser optimise scrolling on mobile threads
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="mt-12 padding-x padding-y max-width" id="discover">
      <div className="categories-container">
        <h1 className="big-text">Explore recipes by categories</h1>
        <div className="flex items-center justify-center gap-2 md:gap-4 w-full max-w-[1320px] mx-auto overflow-hidden">
          {/* Left icon - Hidden on mobile */}
          <button
            onClick={scrollLeft}
            className={`hidden md:flex flex-shrink-0 p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-gray-300 dark:hover:bg-slate-700 rounded-full transition-opacity ${
              showLeftIcon ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!showLeftIcon}
            aria-label="Scroll left"
          >
            <Image
              src="/icon-left.svg"
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 md:w-12 md:h-12"
              aria-hidden
            />
          </button>

          {/* Categories scroll container */}
          <div
            ref={scrollRef}
            className="flex items-center gap-4 md:gap-5 overflow-x-scroll scrollbar max-w-full md:max-w-[1000px] snap-x snap-mandatory"
          >
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))
            ) : isError ? (
              <div className="text-center py-4 text-red-500">
                Failed to load categories. {(error as Error)?.message}
              </div>
            ) : (
              categories.map((category: CategoryProps) => (
                <CategoryItem key={category.id} category={category} />
              ))
            )}
          </div>

          {/* Right icon - Hidden on mobile */}
          <button
            onClick={scrollRight}
            className={`hidden md:flex flex-shrink-0 p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-gray-300 dark:hover:bg-slate-700 rounded-full transition-opacity ${
              showRightIcon ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!showRightIcon}
            aria-label="Scroll right"
          >
            <Image
              src="/icon-right.svg"
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 md:w-12 md:h-12"
              aria-hidden
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
