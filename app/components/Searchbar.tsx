"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import SearchRecipe from "./SearchRecipe";
import { RecipeProps } from "../types";

const SearchBar = () => {
  const [recipes, setRecipes] = useState<RecipeProps[]>([]); // Store fetched recipes
  const [recipe, setRecipe] = useState<RecipeProps | null>(null); // Store selected recipe

  const router = useRouter();

  // Fetch recipes from the API on mount
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
        const result = await response.json(); // Assuming the API returns JSON

        // Assuming result contains an array of recipes, transform it if needed
        setRecipes(result); // Update with fetched recipes
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure a recipe is selected and has a name
    if (!recipe || !recipe.recipe.trim()) {
      return alert("Please provide some input");
    }

    updateSearchParams(recipe.recipe.toLowerCase());
  };

  const updateSearchParams = (recipeString: string) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (recipeString) {
      searchParams.set("recipe", recipeString);
    } else {
      searchParams.delete("recipe");
    }

    const newPathname = `${
      window.location.pathname
    }?${searchParams.toString()}`;
    router.push(newPathname);
  };

  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <SearchRecipe recipes={recipes} setRecipe={setRecipe} />{" "}
    </form>
  );
};

export default SearchBar;
