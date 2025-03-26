import { create } from "zustand";
import { RecipeProps, CategoryProps } from "@/app/types";

export interface RecipeStore {
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

const CACHE_KEY = "recipe_cache";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheData {
  recipes: RecipeProps[];
  categories: CategoryProps[];
  timestamp: number;
}

// Memoize the cache check to avoid unnecessary localStorage access
const getCachedData = (() => {
  let cachedData: CacheData | null = null;
  let lastCheck = 0;

  return (): CacheData | null => {
    const now = Date.now();
    // Only check localStorage every 5 seconds
    if (now - lastCheck < 5000) {
      return cachedData;
    }

    if (typeof window === "undefined") return null;

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      cachedData = null;
      lastCheck = now;
      return null;
    }

    try {
      const data: CacheData = JSON.parse(cached);
      const isExpired = now - data.timestamp > CACHE_EXPIRY;

      if (isExpired) {
        localStorage.removeItem(CACHE_KEY);
        cachedData = null;
      } else {
        cachedData = data;
      }
    } catch (error) {
      console.error("Error parsing cache:", error);
      cachedData = null;
    }

    lastCheck = now;
    return cachedData;
  };
})();

// Debounce cache updates to avoid excessive localStorage writes
const setCachedData = (() => {
  let timeoutId: NodeJS.Timeout;
  let pendingData: CacheData | null = null;

  return (recipes: RecipeProps[], categories: CategoryProps[]) => {
    if (typeof window === "undefined") return;

    pendingData = {
      recipes,
      categories,
      timestamp: Date.now(),
    };

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (pendingData) {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(pendingData));
        } catch (error) {
          console.error("Error setting cache:", error);
        }
        pendingData = null;
      }
    }, 1000); // Debounce for 1 second
  };
})();

// Pre-fetch data in the background
const prefetchData = async () => {
  try {
    const [recipesResponse, categoriesResponse] = await Promise.all([
      fetch("https://keto-diet.p.rapidapi.com/", {
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
          "x-rapidapi-host": "keto-diet.p.rapidapi.com",
        },
        // Add cache control headers
        cache: "force-cache",
        next: { revalidate: 3600 }, // Revalidate every hour
      }),
      fetch("https://keto-diet.p.rapidapi.com/categories/", {
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
          "x-rapidapi-host": "keto-diet.p.rapidapi.com",
        },
        // Add cache control headers
        cache: "force-cache",
        next: { revalidate: 3600 }, // Revalidate every hour
      }),
    ]);

    if (!recipesResponse.ok || !categoriesResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const [recipes, categories] = await Promise.all([
      recipesResponse.json(),
      categoriesResponse.json(),
    ]);

    return { recipes, categories };
  } catch (error) {
    console.error("Failed to prefetch data:", error);
    return null;
  }
};

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
      // Check cache first
      const cachedData = getCachedData();
      if (cachedData) {
        set({
          recipes: cachedData.recipes,
          categories: cachedData.categories,
          filteredRecipes: cachedData.recipes,
          isLoading: false,
          isInitialized: true,
        });
        // Prefetch in the background for next time
        prefetchData().then((data) => {
          if (data) {
            setCachedData(data.recipes, data.categories);
          }
        });
        return;
      }

      // If no cache, fetch from API
      const data = await prefetchData();
      if (!data) {
        throw new Error("Failed to fetch data");
      }

      // Cache the fetched data
      setCachedData(data.recipes, data.categories);

      set({
        recipes: data.recipes,
        categories: data.categories,
        filteredRecipes: data.recipes,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error("Failed to initialize store:", error);
      set({ isLoading: false, isInitialized: false });
    }
  },

  // Filter recipes by category with memoization
  filterRecipesByCategory: (categoryParam) => {
    const { recipes } = get();

    if (!categoryParam) {
      set({ filteredRecipes: recipes, currentPage: 1 });
      return;
    }

    // Use a more efficient filter with early return
    const filtered = recipes.filter((recipe) => {
      const category = recipe.category.category.toLowerCase();
      return category === categoryParam.toLowerCase();
    });

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
