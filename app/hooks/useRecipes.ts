import { useQuery } from "@tanstack/react-query";
import {
  fetchRecipes,
  fetchCategories,
  fetchRecipesAndCategories,
} from "../services/api";
import { RecipeProps, CategoryProps } from "../types";

interface RecipesAndCategories {
  recipes: RecipeProps[];
  categories: CategoryProps[];
}

export const useRecipes = () => {
  return useQuery<RecipeProps[]>({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
    staleTime: 3600 * 1000, // Consider data stale after 1 hour
    gcTime: 24 * 3600 * 1000, // Keep in cache for 24 hours
  });
};

export const useCategories = () => {
  return useQuery<CategoryProps[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 3600 * 1000,
    gcTime: 24 * 3600 * 1000,
  });
};

export const useRecipesAndCategories = () => {
  return useQuery<RecipesAndCategories>({
    queryKey: ["recipesAndCategories"],
    queryFn: fetchRecipesAndCategories,
    staleTime: 3600 * 1000,
    gcTime: 24 * 3600 * 1000,
  });
};

export const useFilteredRecipes = (category: string | null) => {
  const { data: recipes = [] } = useRecipes();

  return {
    data: category
      ? recipes.filter(
          (recipe: RecipeProps) =>
            recipe.category?.category?.toLowerCase() === category.toLowerCase()
        )
      : recipes,
    isLoading: false,
    error: null,
  };
};
