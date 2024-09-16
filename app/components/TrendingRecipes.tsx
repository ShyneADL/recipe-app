"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { RecipeProps } from "../types";

const TrendingRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);

  // Fetch the recipes when the component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      const url = "https://keto-diet.p.rapidapi.com/"; // Fetch 6 random recipes
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
          "x-rapidapi-host": "keto-diet.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result: RecipeProps[] = await response.json(); // Ensure the result is an array of Recipe objects
        const randomRecipes = result.sort(() => 0.5 - Math.random()).slice(0, 6);

        setRecipes(randomRecipes); // Set the result to the state
        console.log(randomRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center padding-y padding-x max-width">
      <div className="flex gap-1">
        <h2 className="big-text">Trending Recipes</h2>
        <Image src="/trending.svg" alt="Trending icon" width={50} height={50} />
      </div>
      <div className="recipe-container">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-item">
              <Image
                src={recipe.image}
                alt={recipe.recipe}
                width={200}
                height={112.5}
                className="object-contain aspect-video rounded-xl"
              />
              <h3 className="recipe-name">{recipe.recipe}</h3>
              <p className="recipe-text">
                Cooking Time:{" "}
                <span className="text-grey">
                  {recipe.cook_time_in_minutes} min
                </span>
              </p>
              {/* <p className="recipe-text">Difficulty: {recipe.difficulty}</p> */}
              <p className="recipe-text">
                Ingredients:{" "}
                {/* <span className="text-grey">
                  {recipe.ingredients.filter(Boolean).length}
                </span> */}
              </p>
            </div>
          ))
        ) : (
          <p>Loading trending recipes...</p>
        )}
      </div>
    </div>
  );
};

export default TrendingRecipes;
