import React from "react";
import { Link } from "react-router-dom";

const SeriesBadge = ({ series, className = "" }) => {
  if (!series || !series.title) return null;

  const seriesId = series.series_id || series._id;

  return (
    <Link
      to={`/series/${seriesId}`}
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple/10 text-purple border border-purple/20 hover:bg-purple/20 hover:border-purple/40 transition-colors ${className}`}
      title={`Part of series: ${series.title}`}
    >
      <i className="fi fi-rr-collection text-[11px] leading-none"></i>
      <span className="truncate max-w-[140px] md:max-w-[200px]">
        {series.title}
      </span>
    </Link>
  );
};

export default SeriesBadge;
