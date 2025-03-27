import { RecipeProps, CategoryProps } from "@/app/types";

const API_BASE_URL = "https://keto-diet.p.rapidapi.com";
const API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY || "";
const API_HOST = "keto-diet.p.rapidapi.com";

const headers = {
  "x-rapidapi-key": API_KEY,
  "x-rapidapi-host": API_HOST,
};

export const fetchRecipes = async (): Promise<RecipeProps[]> => {
  const response = await fetch(`${API_BASE_URL}/`, {
    headers,
    cache: "force-cache",
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return response.json();
};

export const fetchCategories = async (): Promise<CategoryProps[]> => {
  const response = await fetch(`${API_BASE_URL}/categories/`, {
    headers,
    cache: "force-cache",
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

export const fetchRecipesAndCategories = async () => {
  const [recipes, categories] = await Promise.all([
    fetchRecipes(),
    fetchCategories(),
  ]);

  return { recipes, categories };
};
