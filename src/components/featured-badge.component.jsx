import React from "react";

const FeaturedBadge = ({ size = "sm", className = "" }) => {
  const isLarge = size === "lg";

  return (
    <span
      className={`featured-badge-pill glint-effect relative overflow-hidden inline-flex items-center gap-1.5 rounded-full font-semibold select-none cursor-default leading-none ${
        isLarge
          ? "px-3 py-1.5 text-xs tracking-wider uppercase"
          : "px-2.5 py-1 text-[11px] tracking-wide uppercase"
      } ${className}`}
      title="Editor's Pick / Featured Article"
    >
      <i className="fi fi-sr-star text-[10px] leading-none"></i>
      <span>Featured</span>
    </span>
  );
};

export default FeaturedBadge;
