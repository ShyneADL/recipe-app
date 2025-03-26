"use client";
import Hero from "@/app/containers/Hero";
import Categories from "@/app/containers/Categories";
import TrendingRecipes from "@/app/containers/TrendingRecipes";
import FeaturedMacrosSection from "@/app/containers/FeaturedMacrosSection";
import Community from "@/app/containers/Community";
import Newsletter from "@/app/containers/Newsletter";

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
