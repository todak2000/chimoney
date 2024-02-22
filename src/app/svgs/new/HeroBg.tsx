"use client";
import React from "react";
import { SvgProps } from "@/app/constants/types";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
const HeroBg: React.FC<SvgProps> = ({ className }) => {
  return (
    <div className={className}>
      <Player autoplay loop src="/lottie/hero.json" />
    </div>
  );
};
export default React.memo(HeroBg);
