"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SidebarFilter from "@/app/components/SidebarFilter";
import { RecipeProps, CategoryProps } from "@/app/types";
import { Loading, RecipeCard } from "@/app/components";
import Image from "next/image";

const RecipeContent = () => {
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Initialize as true
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 12;

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const toggleFilters = () => setIsOpen(!isOpen);
  const closeFilters = () => setIsOpen(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const url = "https://keto-diet.p.rapidapi.com/";
        const options = {
          method: "GET",
          headers: {
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
            "x-rapidapi-host": "keto-diet.p.rapidapi.com",
          },
        };

        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (!Array.isArray(result)) {
          throw new Error("Invalid data format received from API");
        }

        setRecipes(result);

        let filtered = [...result];
        if (categoryParam) {
          filtered = filtered.filter(
            (recipe) =>
              recipe.category?.category?.toLowerCase() ===
              categoryParam.toLowerCase()
          );
        }

        setFilteredRecipes(filtered);

        const uniqueCategories = Array.from(
          new Set(
            result
              .map((recipe: RecipeProps) => recipe.category?.category)
              .filter(Boolean)
          )
        ).map(
          (category: string, index: number): CategoryProps => ({
            id: index,
            category: category,
            thumbnail: "",
          })
        );

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch recipes"
        );
        setFilteredRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [categoryParam]);

  const handleFilterChange = (newFilteredRecipes: RecipeProps[]) => {
    setIsLoading(true);
    setFilteredRecipes(newFilteredRecipes);
    setIsLoading(false);
  };

  const indexOfLastRecipe = currentPage * pageSize;
  const indexOfFirstRecipe = indexOfLastRecipe - pageSize;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const totalPages = Math.ceil(filteredRecipes.length / pageSize);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (error) {
    return (
      <div className="w-full text-center py-8 text-red-500">Error: {error}</div>
    );
  }

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
        setFilteredRecipes={handleFilterChange}
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

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  // Show limited pagination for many pages
                  if (
                    totalPages > 5 &&
                    page !== 1 &&
                    page !== totalPages &&
                    Math.abs(page - currentPage) > 1
                  ) {
                    if (page === 2 || page === totalPages - 1) {
                      return <span key={page}>...</span>;
                    }
                    return null;
                  }
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
                })}

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

const DiscoverPage = () => {
  return (
    <div className="flex flex-col items-start gap-6 padding-x max-width">
      <Suspense
        fallback={
          <div className="flex justify-center items-center w-full h-40">
            <Loading />
          </div>
        }
      >
        <RecipeContent />
      </Suspense>
    </div>
  );
};

export default DiscoverPage;
