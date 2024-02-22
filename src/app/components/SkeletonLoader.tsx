/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

import { cn } from "../lib/cn";

interface LoaderProps {
  count?: number;
  className?: string;
  type?: string;
}
const SkeletonLoader: React.FC<LoaderProps> = ({
  count = 5,
  className,
  type,
}) => {
  if (type === "grid") {
    return (
      <div
        data-testid="grid-wrapper"
        className="grid animate-pulse grid-cols-1 gap-1 bg-white md:grid-cols-5"
      >
        {[...Array(count)].map((_) => (
          <div
            key={uuidv4()}
            data-testid="grid"
            className={cn("w-full rounded bg-gray-200", className)}
          />
        ))}
      </div>
    );
  }
  if (type === "block") {
    return (
      <div
        data-testid="block-wrapper"
        className="grid animate-pulse grid-cols-1  h-full"
      >
        {[...Array(count)].map((_) => (
          <div
            key={uuidv4()}
            data-testid="block"
            className={cn("w-full rounded bg-gray-200", className)}
          />
        ))}
      </div>
    );
  }
  if (type === "star") {
    return (
      <div
        data-testid="star-wrapper"
        className="grid animate-pulse grid-cols-5"
      >
        {[...Array(count)].map((_) => (
          <MdOutlineStarPurple500
            key={uuidv4()}
            data-testid="star"
            className={cn("mx-2 text-xl text-gray-300", className)}
          />
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
