"use client";

import Image from "next/image";

import { CustomButton, CustomFilter, SearchBar } from "@/app/components";

const Hero = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById("discover");

    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero">
      <div className="flex flex-1 justify-center items-start pt-52 padding-x">
        <div className="flex flex-col text-[2.5rem] items-center gap-6 relative w-[900px]">
          <h1 className="~text-[28px]/[40px] font-bold text-black ~leading-[30px]/[52px] text-center w-[700px]">
            <span className="text-primary-red">Discover</span>,{" "}
            <span className="text-primary-red">Share</span> and{" "}
            <span className="text-primary-red">Connect</span> with Foodies
            around the world.
          </h1>
          <div className="home__filters">
            <SearchBar />
          </div>

          {/* Images */}
          <div className="absolute ~bottom-[40px]/[80px] xl:left-[-75px] md:left-[-40px] z-[-1]">
            <Image
              src="/ingredients.jpg"
              alt="ingredients illustration"
              width={200}
              height={200}
              className="hero-images"
            />
          </div>
          <div className="absolute ~bottom-[40px]/[80px] xl:right-[-75px] md:right-[-40px] z-[-1]">
            <Image
              src="/girl.svg"
              alt="Girl illustration"
              width={200}
              height={200}
              className="hero-images"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
