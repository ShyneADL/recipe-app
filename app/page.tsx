import { RecipeProps, CategoryProps } from "@/app/types";
import {
  Hero,
  Categories,
  TrendingRecipes,
  Community,
  Newsletter,
  FeaturedMacrosSection,
} from "@/app/containers";

// Function to enable you to shuffle the recipes array and render different data
function shuffleArray(array: RecipeProps[]): RecipeProps[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export default async function Home() {
  const highProteinUrl =
    "https://keto-diet.p.rapidapi.com/?protein_in_grams__lt=50&protein_in_grams__gt=20";
  const categoriesUrl = "https://keto-diet.p.rapidapi.com/categories/";
  const recipesUrl = "https://keto-diet.p.rapidapi.com/";

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
      "x-rapidapi-host": "keto-diet.p.rapidapi.com",
    },
  };

  // Fetch both recipes and high protein recipes simultaneously
  const [recipesResponse, highProteinResponse, categoriesResponse] =
    await Promise.all([
      fetch(recipesUrl, options),
      fetch(highProteinUrl, options),
      fetch(categoriesUrl, options),
    ]);

  const recipes: RecipeProps[] = await recipesResponse.json();
  const sixRecipes = shuffleArray([...recipes]).slice(0, 6); // Shuffle before slicing

  const highProteinRecipes: RecipeProps[] = await highProteinResponse.json();
  const threeProteinRecipes = shuffleArray([...highProteinRecipes]).slice(0, 3);
  const categories: CategoryProps[] = await categoriesResponse.json();

  return (
    <main className="overflow-hidden">
      <Hero />
      <Categories categories={categories} />
      <TrendingRecipes recipes={sixRecipes} />
      <FeaturedMacrosSection highProteinRecipes={threeProteinRecipes} />
      <Community />
      <Newsletter />
    </main>
  );
}
