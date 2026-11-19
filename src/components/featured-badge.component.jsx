import React from "react";

const FeaturedBadge = ({ size = "sm", className = "" }) => {
  const isLarge = size === "lg";

  return (
    <span
      className={`gold-bloom-chip gold-shine-sweep inline-flex items-center gap-1.5 rounded-full select-none cursor-default font-medium leading-none ${
        isLarge
          ? "px-3 py-1 text-xs tracking-wider uppercase font-semibold text-amber-900 dark:text-amber-200"
          : "px-2.5 py-[3px] text-[10.5px] tracking-wide uppercase font-semibold text-amber-900 dark:text-amber-200"
      } ${className}`}
      title="Editor's Pick / Featured Article"
    >
      <svg
        className={`flex-none ${isLarge ? "w-3 h-3" : "w-2.5 h-2.5"} text-amber-600 dark:text-amber-400`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
      </svg>
      <span className="font-semibold">Featured</span>
    </span>
  );
};

export default FeaturedBadge;
