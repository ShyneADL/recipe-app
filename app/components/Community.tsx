import React from "react";
import CustomButton from "./CustomButton";
import Image from "next/image";

const Community = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 padding-x padding-y max-width">
      <h2 className="big-text">Meet our Community</h2>
      <p className="font-semibold text-[1.4rem] text-grey ">
        Comment, Share and Discover with fellow food enthusiasts
      </p>
      <CustomButton
        title="Join our community"
        btnType="button"
        containerStyles="text-white rounded-2xl bg-primary-red  min-w-[130px]"
      />
      <div className="flex items-center gap-8 mt-6">
        <div className="p-5 bg-lightGrey rounded-lg">
          <Image
            src="/women-kitchen.jpg"
            alt="women cooking"
            width={200}
            height={112.5}
            className="aspect-video object-fit rounded-lg w-[300px]"
          />
        </div>
        <div className="p-5 bg-lightGrey rounded-lg">
          <Image
            src="/kitchen2.jpg"
            alt="man and woman cooking"
            width={200}
            height={112.5}
            className="aspect-video object-fit rounded-lg w-[300px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Community;
