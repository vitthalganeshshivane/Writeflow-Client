import React from "react";
import { Link } from "react-router-dom";

const SeriesBadge = ({ series, className = "" }) => {
  if (!series || !series.title) return null;

  const seriesId = series.series_id || series._id;

  return (
    <Link
      to={`/series/${seriesId}`}
      onClick={(e) => e.stopPropagation()}
      className={`btn-light py-1 px-3 text-xs flex items-center gap-1.5 hover:text-purple transition-colors ${className}`}
      title={`Part of series: ${series.title}`}
    >
      <i className="fi fi-rr-collection text-[10px] leading-none"></i>
      <span className="truncate max-w-[140px] md:max-w-[200px]">
        {series.title}
      </span>
    </Link>
  );
};

export default SeriesBadge;
