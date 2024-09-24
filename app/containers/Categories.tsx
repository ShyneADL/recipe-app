"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { CategoryProps } from "../types";

interface CategorySectionProps {
  categories: CategoryProps[];
}
const Categories: React.FC<CategorySectionProps> = ({ categories }) => {
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
        {/* The category section */}
        <div className="flex items-center gap-5 select-none w-full">
          {/* Left icon */}
          <div
            onClick={scrollLeft}
            className={`${
              showLeftIcon ? "visible" : "invisible"
            } p-4 bg-transparent hover:bg-gray-300 icon_box rounded-full`}
          >
            <Image
              src="/icon-left.svg"
              alt="previous icon"
              width={100}
              height={100}
            />
          </div>
          <div
            ref={scrollRef}
            className="flex items-center gap-5 overflow-x-scroll scrollbar w-full"
          >
            {categories.length > 0 ? (
              categories.map((category: CategoryProps) => (
                <div
                  key={category.id}
                  className="p-3 flex flex-col items-center gap-2 rounded-2xl hover:bg-lightGrey cursor-pointer w-[200px]"
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
          <div
            onClick={scrollRight}
            className={`${
              showRightIcon ? "visible" : "invisible"
            } p-4 bg-transparent hover:bg-gray-300 icon_box rounded-full`}
          >
            <Image
              src="/icon-right.svg"
              alt="previous icon"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;