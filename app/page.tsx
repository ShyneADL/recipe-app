import { RecipeProps } from "./types";
import {
  Hero,
  Categories,
  TrendingRecipes,
  Community,
  Newsletter,
  FeaturedMacrosSection,
} from "@/app/components";

export default async function Home() {
  const recipesUrl = "https://keto-diet.p.rapidapi.com/";
  const highProteinUrl =
    "https://keto-diet.p.rapidapi.com/?protein_in_grams__lt=50&protein_in_grams__gt=20";

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
      "x-rapidapi-host": "keto-diet.p.rapidapi.com",
    },
  };

  // Fetch both recipes and high protein recipes simultaneously
  const [recipesResponse, highProteinResponse] = await Promise.all([
    fetch(recipesUrl, options),
    fetch(highProteinUrl, options),
  ]);

  const recipes: RecipeProps[] = await recipesResponse.json();
  const highProteinRecipes: RecipeProps[] = await highProteinResponse.json();

  console.log("Recipes Response:", recipes); // Debugging
  console.log("High Protein Recipes Response:", highProteinRecipes); // Debugging
  return (
    <main className="overflow-hidden">
      <Hero />
      <Categories />
      <TrendingRecipes recipes={recipes} />
      <Community />
      <Newsletter />
      <FeaturedMacrosSection highProteinRecipes={highProteinRecipes} />
    </main>
  );
}
