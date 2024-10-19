"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SidebarFilter from "@/app/components/SidebarFilter";
import { RecipeProps, CategoryProps } from "@/app/types";
import { Loading, RecipeCard } from "@/app/components";
import Image from "next/image";

// Separate the content that uses useSearchParams into a client component
const RecipeContent = () => {
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pageSize = 12;

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };
  const closeFilters = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    console.log(isOpen);
  });
  // Reset pagination when search query or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam]);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      const url = "https://keto-diet.p.rapidapi.com/";
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
          "x-rapidapi-host": "keto-diet.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const result = await response.json();

        setRecipes(result);

        // Apply initial filters based on URL parameters
        let filtered = [...result];

        // Apply category filter if exists
        if (categoryParam) {
          filtered = filtered.filter(
            (recipe) =>
              recipe.category.category.toLowerCase() ===
              categoryParam.toLowerCase()
          );
        }

        setFilteredRecipes(filtered);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(result.map((recipe: RecipeProps) => recipe.category.category))
        ).map((category, index) => ({
          id: index,
          category: category as string,
          thumbnail: "",
        }));

        setCategories(uniqueCategories);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [categoryParam]);

  // Pagination logic
  const indexOfLastRecipe = currentPage * pageSize;
  const indexOfFirstRecipe = indexOfLastRecipe - pageSize;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const totalPages = Math.ceil(filteredRecipes.length / pageSize);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="relative flex w-full gap-6">
      <div
        onClick={toggleFilters}
        className="fixed bottom-2 z-2 left-[50%] translate-x-[-50%] rounded-full p-2 bg-black md:hidden flex items-center gap-1"
      >
        <p className="text-white">Filter</p>
        <Image src="/filter.svg" alt="filter icon" width={24} height={24} />
      </div>

      <SidebarFilter
        recipes={recipes}
        setFilteredRecipes={setFilteredRecipes}
        categories={categories}
        onClose={closeFilters}
        isOpen={isOpen}
      />

      <main className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loading />
          </div>
        ) : (
          <>
            <ul className="recipe-container">
              {currentRecipes.length > 0 ? (
                currentRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))
              ) : (
                <li className="text-center w-full py-8">
                  No recipes found matching your criteria.
                </li>
              )}
            </ul>

            {filteredRecipes.length > pageSize && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <button
                  onClick={() => paginate(1)}
                  className={`pagination-btn ${
                    currentPage === 1 ? "active text-primary-red" : ""
                  }`}
                >
                  1
                </button>

                {Array.from({ length: Math.min(totalPages - 2, 3) }).map(
                  (_, index) => {
                    const page = index + 2;
                    return (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`pagination-btn ${
                          currentPage === page ? "active text-primary-red" : ""
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

                {totalPages > 1 && (
                  <button
                    onClick={() => paginate(totalPages)}
                    className={`pagination-btn ${
                      currentPage === totalPages
                        ? "active text-primary-red"
                        : ""
                    }`}
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// Main component with Suspense boundary
const DiscoverPage = () => {
  return (
    <div className="flex flex-col items-start gap-6 padding-x max-width">
      <Suspense fallback={<Loading />}>
        <RecipeContent />
      </Suspense>
    </div>
  );
};

export default DiscoverPage;
