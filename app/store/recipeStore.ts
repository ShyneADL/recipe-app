import { create } from "zustand";
import { RecipeProps, CategoryProps } from "@/app/types";

interface RecipeStore {
  // Base data
  recipes: RecipeProps[];
  categories: CategoryProps[];

  // Derived data
  filteredRecipes: RecipeProps[];

  // UI state
  currentPage: number;
  isLoading: boolean;
  isOpen: boolean;
  pageSize: number;
  isInitialized: boolean;

  // Actions
  initializeStore: () => Promise<void>;
  filterRecipesByCategory: (categoryParam: string | null) => void;
  setCurrentPage: (page: number) => void;
  toggleFilters: () => void;
  closeFilters: () => void;
}

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  // Initial state
  recipes: [],
  categories: [],
  filteredRecipes: [],
  currentPage: 1,
  isLoading: false,
  isOpen: false,
  pageSize: 12,
  isInitialized: false,

  // Initialize store and fetch data
  initializeStore: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });

    try {
      const [recipesResponse, categoriesResponse] = await Promise.all([
        fetch("https://keto-diet.p.rapidapi.com/", {
          headers: {
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
            "x-rapidapi-host": "keto-diet.p.rapidapi.com",
          },
        }),
        fetch("https://keto-diet.p.rapidapi.com/categories/", {
          headers: {
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
            "x-rapidapi-host": "keto-diet.p.rapidapi.com",
          },
        }),
      ]);

      if (!recipesResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [recipes, categories] = await Promise.all([
        recipesResponse.json(),
        categoriesResponse.json(),
      ]);

      set({
        recipes,
        categories,
        filteredRecipes: recipes,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error("Failed to initialize store:", error);
      set({ isLoading: false, isInitialized: false });
    }
  },

  // Filter recipes by category
  filterRecipesByCategory: (categoryParam) => {
    const { recipes } = get();

    if (!categoryParam) {
      set({ filteredRecipes: recipes, currentPage: 1 });
      return;
    }

    const filtered = recipes.filter(
      (recipe) =>
        recipe.category.category.toLowerCase() === categoryParam.toLowerCase()
    );

    set({ filteredRecipes: filtered, currentPage: 1 });
  },

  // Set current page for pagination
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  // Toggle filter visibility
  toggleFilters: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  // Close filter panel
  closeFilters: () => {
    set({ isOpen: false });
  },
}));
