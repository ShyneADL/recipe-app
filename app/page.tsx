"use client";
import {
  Hero,
  Categories,
  TrendingRecipes,
  Community,
  Newsletter,
  FeaturedMacrosSection,
} from "@/app/containers";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Categories />
      <TrendingRecipes />
      <FeaturedMacrosSection />
      <Community />
      <Newsletter />
    </main>
  );
}
