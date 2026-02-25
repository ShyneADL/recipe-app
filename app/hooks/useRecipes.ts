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

// All hooks inherit staleTime: Infinity and gcTime: Infinity from the
// global QueryClient config \u2014 data is fetched once and kept forever.
// Individual overrides are no longer needed.

export const useRecipes = () => {
  return useQuery<RecipeProps[]>({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
  });
};

export const useCategories = () => {
  return useQuery<CategoryProps[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};

export const useRecipesAndCategories = () => {
  return useQuery<RecipesAndCategories>({
    queryKey: ["recipesAndCategories"],
    queryFn: fetchRecipesAndCategories,
  });
};

export const useFilteredRecipes = (category: string | null) => {
  const { data: recipes = [] } = useRecipes();

  return {
    data: category
      ? recipes.filter(
          (recipe: RecipeProps) =>
            recipe.category?.category?.toLowerCase() === category.toLowerCase(),
        )
      : recipes,
    isLoading: false,
    error: null,
  };
};
