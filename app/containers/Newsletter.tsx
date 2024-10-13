import React from "react";
import CustomButton from "@/app/components/CustomButton";

const Newsletter = () => {
  return (
    <div className="bg-primary-red padding-x padding-y w-full">
      <div className="flex md:flex-row flex-col items-center justify-between lg:gap-[220px] gap-[40px] bg-white lg:p-20 md:p-8 p-4 max-width">
        <div className="flex flex-col md:items-start items-center md:gap-6 gap-4 md:w-[600px] w-full">
          <h3 className="big-text md:text-left text-center md:w-fit w-full">
            Get inspired by KetoHub's superstar recipes.
          </h3>
          <p className="text-black md:text-left text-center font-bold text-[1rem] leading-[22px] md:w-[250px] w-full">
            Join the KetoHub community and get exclusive keto recipes from
            around the globe delivered straight to your inbox! Stay inspired
            with low-carb meal ideas, cooking tips, and more. Subscribe now to
            fuel your keto journey!
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 lg:max-w-[400px] max-w-[320px]">
          <label className="text-black text-[1.4rem] font-semibold">
            Subscribe to our Newsletter
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="newsletter"
          />
          <p className="text-black font-semibold text-[0.9rem] font-left ">
            By signing up, you accept our{" "}
            <span className="newsletter-links">Privacy Policy </span>
            and agree that your information may be used across our{" "}
            <span className="newsletter-links">family of brands.</span>
          </p>
          <CustomButton
            title="Signup now"
            btnType="button"
            containerStyles="text-white rounded-2xl bg-primary-red min-w-[65px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
