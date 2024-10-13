"use client";

import Image from "next/image";

import { SearchBar } from "@/app/components";

const Hero = () => {
  return (
    <div className="hero">
      <div className="flex flex-1 justify-center items-start lg:pt-52 pt-16 padding-x">
        <div className="flex flex-col text-[2.5rem] items-center gap-6 relative lg:w-[900px] w-full">
          <h1 className="lg:text-[40px] text-[28px] font-bold text-black ~leading-[30px]/[52px] text-center lg:w-[700px] w-full">
            <span className="text-primary-red">Discover</span>,{" "}
            <span className="text-primary-red">Share</span> and{" "}
            <span className="text-primary-red">Connect</span> with Foodies
            around the world.
          </h1>
          <div className="w-full max-w-3xl mx-auto mb-6">
            <SearchBar />
          </div>

          {/* Images */}
          <div className="lg:flex hidden absolute ~bottom-[40px]/[80px] xl:left-[-75px] md:left-[-40px] z-[-1]">
            <Image
              src="/ingredients.jpg"
              alt="ingredients illustration"
              width={200}
              height={200}
              className="hero-images"
            />
          </div>
          <div className="lg:flex hidden absolute ~bottom-[40px]/[80px] xl:right-[-75px] md:right-[-40px] z-[-1]">
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
