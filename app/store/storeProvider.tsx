// StoreProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRecipeStore, RecipeStore } from "./recipeStore";

const StoreContext = createContext<RecipeStore | null>(null);

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return store;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<RecipeStore | null>(null);
  const recipeStore = useRecipeStore();

  useEffect(() => {
    const initStore = async () => {
      await recipeStore.initializeStore();
      setStore(recipeStore);
    };

    initStore();
  }, [recipeStore]);

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
