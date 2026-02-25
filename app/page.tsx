"use client";
import dynamic from "next/dynamic";
import Hero from "@/app/containers/Hero";
import Categories from "@/app/containers/Categories";
import TrendingRecipes from "@/app/containers/TrendingRecipes";

// Lazy-load below-the-fold sections — they don't need to be in the initial JS bundle
const FeaturedMacrosSection = dynamic(
  () => import("@/app/containers/FeaturedMacrosSection"),
  { ssr: false },
);
const Community = dynamic(() => import("@/app/containers/Community"), {
  ssr: false,
});
const Newsletter = dynamic(() => import("@/app/containers/Newsletter"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Above-the-fold: load eagerly */}
      <Hero />
      <Categories />
      <TrendingRecipes />
      {/* Below-the-fold: lazy-loaded to reduce initial bundle size */}
      <FeaturedMacrosSection />
      <Community />
      <Newsletter />
    </main>
  );
}
