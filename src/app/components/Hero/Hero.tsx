"use client";
import React from "react";

import Button from "@/app/components/Button/Button";
import HeroBg from "@/app/svgs/new/HeroBg";
import { useSelector } from "react-redux";
import { user } from "@/app/store";

const title = "Your Financial Goals, Our Expertise";
const subTitle =
  "With our Innovative finaincial tools and expert guidance, you can be confident in your financial decisions and achieve your goals.";
const Hero = () => {
  const userr = useSelector(user);
  return (
    <section className="flex flex-col items-center space-y-6 my-4 md:my-20 md:pt-10  justify-center w-full ">
      <p className="text-tremor-brand-primary font-bold text-center text-2xl md:text-4xl md:w-[40%]">
        {title}
      </p>
      <p className="text-black dark:invert text-center text-sm md:w-1/2">
        {subTitle}
      </p>
      {userr.name !== "" ? null : <Button title="Get started with" />}
      <HeroBg className="w-full" />
    </section>
  );
};

export default Hero;
