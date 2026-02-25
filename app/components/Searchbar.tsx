"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchRecipe from "./SearchRecipe";
import { RecipeProps } from "@/app/types";
import { Loading } from "@/app/components";
import { useRecipes } from "../hooks/useRecipes";

// Separate the content that uses client-side hooks into its own component
const SearchBarContent = () => {
  const { data: recipes = [], isError } = useRecipes();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize searchQuery from URL params if they exist
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return alert("Please provide some input");
    }

    navigateToSearch(searchQuery.toLowerCase());
  };

  const handleRecipeSelect = (recipe: RecipeProps | null) => {
    if (recipe) {
      navigateToSearch(recipe.recipe.toLowerCase());
    }
  };

  const navigateToSearch = (query: string) => {
    // When searching, only include the search query parameter
    // This effectively resets any category filter
    const newParams = new URLSearchParams();
    newParams.set("q", query);

    router.push(`/search?${newParams.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    // When clearing the search, remove all parameters and return to base search page
    router.push("/search");
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <form className="searchbar" onSubmit={handleSearch}>
        <SearchRecipe
          recipes={recipes}
          onSelect={handleRecipeSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClear={clearSearch}
        />
      </form>
      {isError && (
        <p className="text-red-500 text-xs text-center">
          Suggestions currently unavailable.
        </p>
      )}
    </div>
  );
};

// Main component with Suspense boundary
const SearchBar = () => {
  return (
    <Suspense
      fallback={
        <div className="searchbar">
          <div className="flex items-center justify-center w-full h-10">
            <Loading />
          </div>
        </div>
      }
    >
      <SearchBarContent />
    </Suspense>
  );
};

export default SearchBar;
