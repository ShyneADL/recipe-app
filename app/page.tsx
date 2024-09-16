import { fetchRecipes } from "@/app/utils";
import { HomeProps } from "@/app/types";
import {
  ShowMore,
  Hero,
  RecipeCard,
  Categories,
  TrendingRecipes,
  Community,
  Newsletter,
} from "@/app/components";

export default async function Home({ searchParams }: HomeProps) {
  const allRecipes = await fetchRecipes({
    protein: searchParams.protein || "",
    carbohydrates: searchParams.carbohydrates || "",
    fats: searchParams.fats || "",
    calories: searchParams.calories || 200,
    cooktimeinminutes: searchParams.cooktimeinminutes || 10,
    preptimeinminutes: searchParams.preptimeinminutes || 10,
  });

  const isDataEmpty =
    !Array.isArray(allRecipes) || allRecipes.length < 1 || !allRecipes;

  return (
    <main className="overflow-hidden">
      <Hero />
      <Categories />
      <TrendingRecipes />
      <Community />
      <Newsletter />

      {/* {!isDataEmpty ? (
          <section>
            <div className='home__cars-wrapper'>
              {allRecipes?.map((car) => (
                <CarCard car={car} />
              ))}
            </div>

            <ShowMore
              pageNumber={(searchParams.calories || 10) / 10}
              isNext={(searchParams.calories || 10) > allRecipes.length}
            />
          </section>
        ) : (
          <div className='home__error-container'>
            <h2 className='text-black text-xl font-bold'>Oops, no results</h2>
            <p>{allRecipes?.message}</p>
          </div>
        )} */}
    </main>
  );
}
