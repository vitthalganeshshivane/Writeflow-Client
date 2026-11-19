import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "../components/nodata.component";
import { getDay } from "../common/date";
import { userContext } from "../App";
import { toast } from "react-hot-toast";
import FeaturedBadge from "../components/featured-badge.component";

const SeriesPage = () => {
  const { series_id } = useParams();
  const {
    userAuth: { access_token, user_id },
  } = useContext(userContext);

  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loadingFav, setLoadingFav] = useState(false);

  const fetchSeries = () => {
    setLoading(true);
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/series/get", {
        series_id,
        user_id,
      })
      .then(({ data }) => {
        setSeries(data.series);
        setIsFavorited(data.is_favorited);
        setFavoritesCount(data.series?.favorites_count || 0);
      })
      .catch((err) => {
        console.error("Fetch Series Error:", err);
        toast.error("Failed to load series");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSeries();
  }, [series_id]);

  const handleFavorite = () => {
    if (!access_token) {
      toast.error("Please sign in to save this series");
      return;
    }

    setLoadingFav(true);
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/series/toggle-favorite",
        { series_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setIsFavorited(data.is_favorited);
        setFavoritesCount(data.favorites_count);
        toast.success(
          data.is_favorited
            ? "Saved to your favorite series ❤️"
            : "Removed from favorites"
        );
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Error favoriting series");
      })
      .finally(() => {
        setLoadingFav(false);
      });
  };

  if (loading) return <Loader />;
  if (!series) {
    return (
      <div className="h-cover flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold mb-2">Series Not Found</h1>
        <p className="text-dark-grey mb-6">
          The requested series playlist doesn't exist or has been removed.
        </p>
        <Link to="/" className="btn-dark py-2 px-6 text-sm">
          Return Home
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    banner,
    author,
    blogs = [],
    createdAt,
  } = series;

  const firstBlogId = blogs[0]?.blog_id;

  return (
    <AnimationWrapper>
      <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
        {/* Banner */}
        {banner && (
          <img
            src={banner}
            alt={title}
            className="aspect-video w-full rounded-xl object-cover mb-8"
          />
        )}

        {/* Series Tag & Title */}
        <div className="flex items-center gap-2 mb-3">
          <span className="btn-light py-1 px-4 text-xs font-semibold uppercase tracking-wider">
            Series
          </span>
          <span className="text-sm text-dark-grey">
            {blogs.length} {blogs.length === 1 ? "Chapter" : "Chapters"}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold font-inter leading-tight mb-4">
          {title}
        </h1>

        {description && (
          <p className="text-xl font-gelasio text-dark-grey leading-relaxed mb-6">
            {description}
          </p>
        )}

        {/* Author row & actions - Matching blog.page.jsx style */}
        <div className="flex max-sm:flex-col justify-between items-start my-8 gap-4 border-b border-grey pb-8">
          {author && author.personal_info && (
            <div className="flex gap-4 items-center">
              <img
                src={author.personal_info.profile_img}
                alt={author.personal_info.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="capitalize leading-relaxed font-medium">
                  {author.personal_info.fullname}
                </p>
                <Link
                  to={`/user/${author.personal_info.username}`}
                  className="text-dark-grey text-sm hover:underline"
                >
                  @{author.personal_info.username} • Created {getDay(createdAt)}
                </Link>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            {firstBlogId && (
              <Link
                to={`/blog/${firstBlogId}`}
                className="btn-dark py-2 px-5 text-sm flex items-center gap-2"
              >
                <i className="fi fi-rr-play text-xs"></i>
                <span>Start Reading</span>
              </Link>
            )}

            <button
              onClick={handleFavorite}
              disabled={loadingFav}
              className={`btn-light py-2 px-4 text-sm flex items-center gap-2 ${
                isFavorited ? "text-red" : ""
              }`}
            >
              <i
                className={`fi ${isFavorited ? "fi-sr-heart" : "fi-rr-heart"}`}
              ></i>
              <span>{isFavorited ? "Saved" : "Save"}</span>
              <span>({favoritesCount})</span>
            </button>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-medium mb-8">
            {blogs.length} {blogs.length === 1 ? "Chapter" : "Chapters"} in this Series
          </h2>

          {blogs.length === 0 ? (
            <NoDataMessage message="No chapters added to this series yet" />
          ) : (
            blogs.map((b, index) => (
              <Link
                key={b.blog_id || index}
                to={`/blog/${b.blog_id}`}
                className="flex gap-6 md:gap-8 items-center border-b border-grey pb-6 mb-6 group"
              >
                {/* Signature Writeflow blog-index */}
                <h1 className="blog-index">
                  {index < 9 ? "0" + (index + 1) : index + 1}
                </h1>

                <div className="w-full">
                  <div className="flex gap-2 items-center mb-3 flex-wrap">
                    <span className="text-sm text-dark-grey">
                      {getDay(b.publishedAt)}
                    </span>
                    {b.is_featured && <FeaturedBadge size="sm" />}
                  </div>
                  <h2 className="blog-title group-hover:text-purple transition-colors mb-2">
                    {b.title}
                  </h2>
                  {b.des && (
                    <p className="my-2 text-xl font-gelasio leading-7 max-sm:hidden line-clamp-2 text-dark-grey">
                      {b.des}
                    </p>
                  )}
                </div>

                {b.banner && (
                  <div className="h-24 w-32 aspect-video bg-grey flex-none rounded-md overflow-hidden">
                    <img
                      src={b.banner}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default SeriesPage;
