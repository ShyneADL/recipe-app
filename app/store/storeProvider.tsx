// StoreProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useRecipeStore } from "./recipeStore";
import { Loading } from "../components";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializeStore = useRecipeStore((state) => state.initializeStore);

  useEffect(() => {
    const init = async () => {
      await initializeStore();
      setIsInitialized(true);
    };
    init();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}
