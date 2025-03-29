"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryProps } from "@/app/types";
import { useCategories } from "../hooks/useRecipes";
import CategorySkeleton from "../components/CategorySkeleton";

const Categories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showRightIcon, setShowRightIcon] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      // Check if the user can scroll left (not at the start)
      setShowLeftIcon(scrollContainer.scrollLeft > 0);

      // Check if the user can scroll right (not at the end)
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      setShowRightIcon(scrollContainer.scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="mt-12 padding-x padding-y max-width" id="discover">
      <div className="categories-container">
        <h1 className="big-text">Explore recipes by categories</h1>
        <div className="flex items-center justify-center gap-4 w-full max-w-[1320px] mx-auto">
          {/* Left icon */}
          <button
            onClick={scrollLeft}
            className={`flex-shrink-0 p-2 bg-white/80 hover:bg-gray-300 rounded-full transition-opacity ${
              showLeftIcon ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!showLeftIcon}
          >
            <Image
              src="/icon-left.svg"
              alt="previous icon"
              width={40}
              height={40}
              className="w-12 h-12"
            />
          </button>

          {/* Categories scroll container */}
          <div
            ref={scrollRef}
            className="flex items-center gap-5 overflow-x-scroll scrollbar max-w-[1000px]"
          >
            {isLoading
              ? // Show 8 skeletons while loading
                Array.from({ length: 8 }).map((_, index) => (
                  <CategorySkeleton key={index} />
                ))
              : categories.map((category: CategoryProps) => (
                  <Link
                    key={category.id}
                    href={`/discover?category=${encodeURIComponent(
                      category.category
                    )}`}
                    className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="rounded-full lg:w-[200px] w-[120px]">
                      <Image
                        src={category.thumbnail || "/placeholder.jpg"}
                        alt={category.category}
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-black font-bold text-[1rem] text-center">
                      {category.category}
                    </span>
                  </Link>
                ))}
          </div>

          {/* Right icon */}
          <button
            onClick={scrollRight}
            className={`flex-shrink-0 p-2 bg-white/80 hover:bg-gray-300 rounded-full transition-opacity ${
              showRightIcon ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!showRightIcon}
          >
            <Image
              src="/icon-right.svg"
              alt="next icon"
              width={40}
              height={40}
              className="w-12 h-12"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
