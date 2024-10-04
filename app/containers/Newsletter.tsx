import React from "react";
import CustomButton from "@/app/components/CustomButton";

const Newsletter = () => {
  return (
    <div className="bg-primary-red padding-x padding-y w-full">
      <div className="flex items-center justify-between gap-[220px] bg-white p-20 max-width">
        <div className="flex flex-col items-start gap-6 w-[600px]">
          <h3 className="text-primary-red text-[1.6rem] font-bold w-fit">
            Get inspired by KetoHub's superstar recipes.
          </h3>
          <p className="text-black font-bold text-[1rem] leading-[22px] ~w-{250px]/[600px]">
            Join the KetoHub community and get exclusive keto recipes from
            around the globe delivered straight to your inbox! Stay inspired
            with low-carb meal ideas, cooking tips, and more. Subscribe now to
            fuel your keto journey!
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 max-w-[400px]">
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
