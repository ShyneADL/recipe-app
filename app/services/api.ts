import { RecipeProps, CategoryProps } from "@/app/types";

const API_BASE_URL = "https://keto-diet.p.rapidapi.com";
const API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY || "";
const API_HOST = "keto-diet.p.rapidapi.com";

const getHeaders = () => {
  if (!API_KEY) {
    console.warn(
      "NEXT_PUBLIC_RAPID_API_KEY is not defined. API requests will likely fail.",
    );
  }
  return {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": API_HOST,
  };
};

export const fetchRecipes = async (): Promise<RecipeProps[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      headers: getHeaders(),
      // Cache the raw response at the HTTP layer indefinitely \u2014
      // the API is static so there's no value in revalidating.
      // React Query also holds the parsed result in-memory for the session.
      cache: "force-cache",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Invalid or missing API key. Please check your .env file.",
        );
      }
      throw new Error(`Failed to fetch recipes: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<CategoryProps[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      headers: getHeaders(),
      cache: "force-cache",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Invalid or missing API key. Please check your .env file.",
        );
      }
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchRecipesAndCategories = async () => {
  try {
    const [recipes, categories] = await Promise.all([
      fetchRecipes(),
      fetchCategories(),
    ]);
    return { recipes, categories };
  } catch (error) {
    console.error("Error fetching recipes and categories:", error);
    throw error;
  }
};
