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
    userAuth: { access_token, user_id, username },
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
            ? "Added to favorites ❤️"
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
    <div className="group rounded-2xl border border-grey bg-white dark:bg-black/30 overflow-hidden hover:shadow-md hover:border-purple/40 transition-all flex flex-col justify-between">
      <div>
        {/* Banner with YouTube-style playlist overlay */}
        <Link to={`/series/${series_id}`} className="block relative aspect-video overflow-hidden bg-grey">
          <img
            src={banner || defaultBanner}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* YouTube playlist bar on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-1">
            <i className="fi fi-rr-collection text-xl"></i>
            <span className="text-sm font-semibold">{blogs?.length || 0}</span>
            <span className="text-[10px] uppercase tracking-wider text-white/80">
              Videos
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Link
              to={`/series/${series_id}`}
              className="text-lg font-bold text-black dark:text-white group-hover:text-purple transition-colors line-clamp-1"
            >
              {title}
            </Link>
          </div>

          {description && (
            <p className="text-sm text-dark-grey line-clamp-2 mb-4 leading-relaxed">
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
      <div className="px-5 pb-5 pt-2 border-t border-grey/60 flex items-center justify-between">
        <button
          onClick={handleFavorite}
          disabled={loadingFav}
          className={`flex items-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-full border transition-all ${
            isFavorited
              ? "bg-red/10 border-red/30 text-red"
              : "border-grey text-dark-grey hover:text-black hover:border-black/30"
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
