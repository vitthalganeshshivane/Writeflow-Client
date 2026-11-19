import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
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
      toast.error("Please sign in to favorite this series");
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
          data.is_favorited ? "Saved to your favorite series ❤️" : "Removed from favorites"
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
        <i className="fi fi-rr-collection text-5xl text-dark-grey/50 mb-4"></i>
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
  const defaultBanner =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80";

  return (
    <AnimationWrapper>
      <section className="h-cover max-w-[1200px] center py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Playlist Details & Cover (YouTube style) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-purple/10 via-purple/5 to-transparent border border-purple/20 shadow-sm">
              {/* Cover Banner */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-grey shadow-md mb-6 relative">
                <img
                  src={banner || defaultBanner}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-medium px-3 py-1 rounded-full bg-black/60 backdrop-blur-md flex items-center gap-1.5">
                    <i className="fi fi-rr-collection text-[11px]"></i>
                    <span>{blogs.length} Chapters / Articles</span>
                  </span>
                </div>
              </div>

              {/* Title & Desc */}
              <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
                {title}
              </h1>

              {description && (
                <p className="text-dark-grey text-base leading-relaxed mb-6">
                  {description}
                </p>
              )}

              {/* Author Row */}
              {author && author.personal_info && (
                <div className="flex items-center gap-3 py-4 border-y border-grey/60 mb-6">
                  <img
                    src={author.personal_info.profile_img}
                    alt={author.personal_info.fullname}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <Link
                      to={`/user/${author.personal_info.username}`}
                      className="font-medium text-black dark:text-white hover:text-purple transition-colors block"
                    >
                      {author.personal_info.fullname}
                    </Link>
                    <p className="text-xs text-dark-grey">
                      @{author.personal_info.username} • Created {getDay(createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {firstBlogId ? (
                  <Link
                    to={`/blog/${firstBlogId}`}
                    className="btn-dark flex-1 py-3 px-6 text-sm flex items-center justify-center gap-2 rounded-xl shadow-sm"
                  >
                    <i className="fi fi-rr-play text-xs"></i>
                    <span>Start Reading</span>
                  </Link>
                ) : null}

                <button
                  onClick={handleFavorite}
                  disabled={loadingFav}
                  className={`py-3 px-5 text-sm rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    isFavorited
                      ? "bg-red/10 border-red/30 text-red font-medium"
                      : "btn-light"
                  }`}
                >
                  <i
                    className={`fi ${
                      isFavorited ? "fi-sr-heart text-red" : "fi-rr-heart"
                    }`}
                  ></i>
                  <span>{isFavorited ? "Saved" : "Save Series"}</span>
                  <span className="text-xs opacity-75">({favoritesCount})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Ordered List of Blogs in Series */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between pb-4 border-b border-grey mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>Chapters</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-grey text-dark-grey">
                  {blogs.length}
                </span>
              </h2>
              <p className="text-xs text-dark-grey">Ordered Reading List</p>
            </div>

            {blogs.length === 0 ? (
              <div className="text-center py-16 p-6 rounded-2xl border border-dashed border-grey text-dark-grey">
                <i className="fi fi-rr-document text-3xl mb-2 block"></i>
                <p>This series has no blogs added yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {blogs.map((b, index) => {
                  return (
                    <Link
                      key={b.blog_id || index}
                      to={`/blog/${b.blog_id}`}
                      className="p-4 md:p-5 rounded-2xl border border-grey bg-white dark:bg-black/20 hover:border-purple/50 hover:shadow-md transition-all flex gap-4 md:gap-5 items-center group"
                    >
                      {/* Chapter Index number */}
                      <span className="text-xl md:text-2xl font-bold text-dark-grey/60 group-hover:text-purple transition-colors w-8 flex-none text-center">
                        {index + 1}
                      </span>

                      {/* Thumbnail */}
                      {b.banner && (
                        <div className="w-20 md:w-28 aspect-video rounded-lg overflow-hidden bg-grey flex-none">
                          <img
                            src={b.banner}
                            alt={b.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {b.is_featured && <FeaturedBadge size="sm" />}
                          <span className="text-xs text-dark-grey">
                            {getDay(b.publishedAt)}
                          </span>
                        </div>
                        <h3 className="text-base md:text-lg font-semibold text-black dark:text-white group-hover:text-purple transition-colors truncate">
                          {b.title}
                        </h3>
                        {b.des && (
                          <p className="text-xs md:text-sm text-dark-grey line-clamp-1 mt-1">
                            {b.des}
                          </p>
                        )}
                      </div>

                      {/* Arrow Icon */}
                      <i className="fi fi-rr-arrow-right text-dark-grey group-hover:text-purple group-hover:translate-x-1 transition-all flex-none"></i>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default SeriesPage;
