"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Correct useRouter import
import { CategoryProps } from "@/app/types";

interface CategorySectionProps {
  categories: CategoryProps[];
}

const Categories: React.FC<CategorySectionProps> = ({ categories }) => {
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showRightIcon, setShowRightIcon] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Initialize the router

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

  const handleCategoryClick = (category: string) => {
    // Navigate to the filter page with the category as a query parameter
    router.push(`/search?category=${category}`);
  };

  return (
    <div className="mt-12 padding-x padding-y max-width" id="discover">
      <div className="categories-container">
        <h1 className="big-text">Explore recipes by categories</h1>
        {/* The category section */}
        <div className="relative flex items-center gap-5 select-none max-w-[1320px]">
          {/* Left icon */}
          <button
            onClick={scrollLeft}
            className={`absolute -left-40 top-1/2 -translate-y-1/2 z-10 p-4 bg-white/80 hover:bg-gray-300 rounded-full transition-opacity ${
              showLeftIcon ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!showLeftIcon}
          >
            <Image
              src="/icon-left.svg"
              alt="previous icon"
              width={100}
              height={100}
            />
          </button>
          <div
            ref={scrollRef}
            className="flex items-center gap-5 overflow-x-scroll scrollbar max-w-[1000px]"
          >
            {categories.length > 0 ? (
              categories.map((category: CategoryProps) => (
                <div
                  key={category.id}
                  className="p-3 flex flex-col flex-shrink-0 items-center gap-2 rounded-2xl hover:bg-lightGrey cursor-pointer w-[200px]"
                  onClick={() => handleCategoryClick(category.category)} // Handle click event
                >
                  <div className="rounded-full w-[200px]">
                    <Image
                      src={category.thumbnail}
                      alt={category.category}
                      className="object-contain"
                      width={200}
                      height={200}
                    />
                  </div>
                  <h2 className="text-black font-bold text-[1rem] text-center">
                    {category.category}
                  </h2>
                </div>
              ))
            ) : (
              <p>Loading categories...</p>
            )}
          </div>
          {/* Right icon */}
          <button
            onClick={scrollRight}
            className={`absolute -right-40 top-1/2 -translate-y-1/2 z-10 p-4 bg-white/80 hover:bg-gray-300 rounded-full transition-opacity ${
              showRightIcon ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!showRightIcon}
          >
            <Image
              src="/icon-right.svg"
              alt="next icon"
              width={100}
              height={100}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
