import React from "react";

const FeaturedBadge = ({ size = "sm", className = "" }) => {
  const isLarge = size === "lg";

  return (
    <span
      className={`gold-bloom-chip gold-shine-sweep inline-flex items-center gap-1.5 font-medium rounded-full select-none cursor-default ${
        isLarge
          ? "px-3.5 py-1 text-xs tracking-wider uppercase font-semibold text-amber-900 dark:text-amber-100"
          : "px-2.5 py-0.5 text-[11px] tracking-wide uppercase font-semibold text-amber-900 dark:text-amber-100"
      } ${className}`}
      title="Featured Blog"
    >
      <span className="text-amber-600 dark:text-yellow-300 animate-pulse text-[12px] leading-none">
        ✦
      </span>
      <span>Featured</span>
    </span>
  );
};

export default FeaturedBadge;
