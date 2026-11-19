import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import axios from "axios";
import { toast } from "react-hot-toast";

const SeriesCard = ({ series, isOwner = false, onDelete }) => {
  const {
    series_id,
    title,
    description,
    banner,
    author,
    blogs = [],
    favorites_count = 0,
    favorites = [],
  } = series;

  const {
    userAuth: { access_token, user_id },
  } = useContext(userContext);

  const [favCount, setFavCount] = useState(favorites_count);
  const [isFavorited, setIsFavorited] = useState(
    Array.isArray(favorites) && user_id ? favorites.includes(user_id) : false
  );
  const [loadingFav, setLoadingFav] = useState(false);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!access_token) {
      toast.error("Please login to favorite this series");
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
        setFavCount(data.favorites_count);
        toast.success(
          data.is_favorited
            ? "Saved to favorites ❤️"
            : "Removed from favorites"
        );
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.error || "Failed to update favorite status"
        );
      })
      .finally(() => {
        setLoadingFav(false);
      });
  };

  const defaultBanner =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group rounded-xl border border-grey bg-white overflow-hidden hover:border-dark-grey/40 transition-all flex flex-col justify-between">
      <div>
        {/* Banner with clean Chapter count overlay */}
        <Link
          to={`/series/${series_id}`}
          className="block relative aspect-video overflow-hidden bg-grey"
        >
          <img
            src={banner || defaultBanner}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <i className="fi fi-rr-collection text-[10px]"></i>
            <span>
              {blogs?.length || 0} {blogs?.length === 1 ? "Chapter" : "Chapters"}
            </span>
          </span>
        </Link>

        {/* Content */}
        <div className="p-5">
          <Link
            to={`/series/${series_id}`}
            className="blog-title mb-2 group-hover:text-purple transition-colors block"
          >
            {title}
          </Link>

          {description && (
            <p className="text-sm text-dark-grey line-clamp-2 mb-4 font-gelasio leading-relaxed">
              {description}
            </p>
          )}

          {author && author.personal_info && (
            <Link
              to={`/user/${author.personal_info.username}`}
              className="flex items-center gap-2.5 my-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={author.personal_info.profile_img}
                alt={author.personal_info.fullname}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs text-dark-grey line-clamp-1">
                {author.personal_info.fullname}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="px-5 pb-5 pt-2 border-t border-grey flex items-center justify-between">
        <button
          onClick={handleFavorite}
          disabled={loadingFav}
          className={`flex items-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-full border transition-all ${
            isFavorited
              ? "border-red text-red"
              : "border-grey text-dark-grey hover:text-black"
          }`}
          title={isFavorited ? "Remove favorite" : "Add to favorites"}
        >
          <i
            className={`fi ${
              isFavorited ? "fi-sr-heart text-red" : "fi-rr-heart"
            } text-xs`}
          ></i>
          <span>{favCount}</span>
        </button>

        <div className="flex items-center gap-3">
          {isOwner && (
            <button
              onClick={() => onDelete && onDelete(series)}
              className="text-xs text-red hover:underline"
            >
              Delete
            </button>
          )}
          <Link
            to={`/series/${series_id}`}
            className="text-xs font-medium text-purple flex items-center gap-1 hover:underline"
          >
            <span>View Series</span>
            <i className="fi fi-rr-arrow-right text-[10px]"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeriesCard;
