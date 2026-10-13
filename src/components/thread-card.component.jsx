import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { userContext } from "../App";
import { getRelativeTime } from "../common/date";
import defaultProfileImg from "../imgs/user profile.png";

// Helper to parse @mentions into clickable Links
const renderFormattedContent = (text) => {
  if (!text) return null;

  // Split text by @mentions
  const parts = text.split(/(@[a-zA-Z0-9_]+)/g);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const mentionUsername = part.slice(1);
      return (
        <Link
          key={index}
          to={`/user/${mentionUsername}`}
          onClick={(e) => e.stopPropagation()}
          className="text-purple hover:underline font-medium"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
};

const ThreadCard = ({ thread, onThreadDeleted }) => {
  const {
    userAuth: { access_token, username: currentUsername, isAdmin },
  } = useContext(userContext);

  const {
    thread_id,
    content,
    image,
    youtube,
    author: { personal_info: { fullname, username, profile_img } = {} } = {},
    likes = [],
    createdAt,
  } = thread;

  const [isLiked, setIsLiked] = useState(
    access_token && likes.includes(access_token) ? true : false,
  );
  const [likesCount, setLikesCount] = useState(likes?.length || 0);
  const [imageLightbox, setImageLightbox] = useState(false);

  const isAuthor =
    (currentUsername && currentUsername === username) || isAdmin;

  const handleLike = async () => {
    if (!access_token) {
      return toast.error("Please sign in to like this thread");
    }

    // Optimistic toggle
    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/thread/like-thread`,
        { thread_id },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
    } catch (err) {
      // Revert on error
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Failed to like thread");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this thread?")) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/thread/delete-thread`,
        { thread_id },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      toast.success("Thread deleted");
      if (onThreadDeleted) onThreadDeleted(thread_id);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete thread");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/#thread-${thread_id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Thread link copied to clipboard 📋");
    }
  };

  return (
    <>
      {/* Lightbox for attached image */}
      {imageLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setImageLightbox(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={image}
              alt="Expanded"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      <div
        id={`thread-${thread_id}`}
        className="border-b border-grey/60 py-5 hover:bg-grey/5 transition px-2 md:px-3 rounded-xl"
      >
        {/* Header: Author + Timestamp */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <Link
            to={`/user/${username}`}
            className="flex items-center gap-3 group"
          >
            <img
              src={profile_img || defaultProfileImg}
              alt={fullname || username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm group-hover:underline leading-tight line-clamp-1">
                {fullname || username}
              </p>
              <p className="text-xs text-dark-grey leading-tight">
                @{username}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-grey whitespace-nowrap">
              {getRelativeTime(createdAt)}
            </span>

            {isAuthor && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-dark-grey hover:text-red p-1 rounded transition"
                title="Delete thread"
              >
                <i className="fi fi-rr-trash text-sm"></i>
              </button>
            )}
          </div>
        </div>

        {/* Thread Text Content */}
        {content && (
          <p className="font-gelasio text-base md:text-lg text-black/90 leading-relaxed whitespace-pre-wrap my-2 pl-1">
            {renderFormattedContent(content)}
          </p>
        )}

        {/* Attached Image */}
        {image && (
          <div className="my-3 rounded-xl overflow-hidden border border-grey/50 max-h-96 w-fit cursor-zoom-in">
            <img
              src={image}
              alt="Attached"
              loading="lazy"
              onClick={() => setImageLightbox(true)}
              className="max-h-96 w-auto object-cover rounded-xl hover:opacity-95 transition"
            />
          </div>
        )}

        {/* Attached YouTube Player */}
        {youtube && youtube.embedUrl && (
          <div className="my-3 rounded-xl overflow-hidden border border-grey/50 aspect-video w-full max-w-[560px]">
            <iframe
              src={youtube.embedUrl}
              title="YouTube video"
              loading="lazy"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full border-0"
            />
          </div>
        )}

        {/* Action Buttons: Like, Share */}
        <div className="flex items-center gap-6 mt-3 text-dark-grey text-sm pl-1">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition ${
              isLiked ? "text-red" : "hover:text-red"
            }`}
          >
            <i
              className={`fi ${
                isLiked ? "fi-sr-heart" : "fi-rr-heart"
              } text-base`}
            ></i>
            <span className="text-xs font-medium">{likesCount}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-black transition"
            title="Share thread"
          >
            <i className="fi fi-rr-share text-base"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default ThreadCard;
