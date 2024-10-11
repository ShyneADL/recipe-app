"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchRecipe from "./SearchRecipe";
import { RecipeProps } from "@/app/types";
import { Loading } from "@/app/components";

// Separate the content that uses client-side hooks into its own component
const SearchBarContent = () => {
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
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

  useEffect(() => {
    const fetchRecipes = async () => {
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
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipes();
  }, []);

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
    <form className="searchbar" onSubmit={handleSearch}>
      <SearchRecipe
        recipes={recipes}
        onSelect={handleRecipeSelect}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClear={clearSearch}
      />
    </form>
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
