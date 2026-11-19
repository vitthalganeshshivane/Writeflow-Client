import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLikedByUser,
    setLikedByUser,
    commentsWrapper,
    setCommentsWrapper,
  } = useContext(BlogContext);

  let {
    userAuth: { username, access_token, isAdmin },
  } = useContext(userContext);

  const handleToggleFeatured = () => {
    if (!access_token) {
      toast.error("Please login to feature this blog");
      return;
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/blog/toggle-featured",
        { blog_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )
      .then(({ data }) => {
        setBlog((prev) => ({ ...prev, is_featured: data.is_featured }));
        toast.success(
          data.is_featured
            ? "Marked as featured ⭐"
            : "Removed from featured",
        );
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.error || "Failed to update featured status",
        );
      });
  };

  useEffect(() => {
    if (access_token) {
      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/blog/isLiked-by-user",
          { _id },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        )
        .then(({ data: { result } }) => {
          setLikedByUser(Boolean(result));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleLike = () => {
    if (!access_token) {
      toast.error("Please login to like this blog");
      return;
    }

    const nextLiked = !isLikedByUser;
    const updatedLikes = nextLiked ? total_likes + 1 : total_likes - 1;

    setLikedByUser(nextLiked);
    setBlog({ ...blog, activity: { ...activity, total_likes: updatedLikes } });

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/blog/like-blog",
        { _id, isLikedByUser },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )
      .catch((err) => {
        console.log(err);
      });
  };

  // const handleLike = () => {
  //   if (access_token) {
  //     //like the blog
  //     setLikedByUser((preVal) => !preVal);

  //     !isLikedByUser ? total_likes++ : total_likes--;

  //     setBlog({ ...blog, activity: { ...activity, total_likes } });

  //     axios
  //       .post(
  //         import.meta.env.VITE_SERVER_DOMAIN + "/blog/like-blog",
  //         { _id, isLikedByUser },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${access_token}`,
  //           },
  //         },
  //       )
  //       .then(({ data }) => {
  //         console.log(data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   } else {
  //     toast.error("Please login to like this blog");
  //   }
  // };

  return (
    <>
      <hr className="border-grey my-2" />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={handleLike}
            className={
              "w-10 h-10 rounded-full flex items-center justify-center " +
              (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80")
            }
          >
            <i
              className={
                "fi " + (isLikedByUser ? "fi-sr-heart" : "fi-rr-heart")
              }
            ></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button
            onClick={() => {
              setCommentsWrapper((preVal) => !preVal);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
          >
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-4 sm:gap-6 items-center">
          {(username === author_username || isAdmin) && (
            <button
              onClick={handleToggleFeatured}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                blog?.is_featured
                  ? "featured-badge-pill"
                  : "border-grey text-dark-grey hover:text-black hover:border-dark-grey/40"
              }`}
              title={
                blog?.is_featured
                  ? "Click to remove featured status"
                  : "Click to feature this blog"
              }
            >
              <i className="fi fi-sr-star text-[10px] leading-none"></i>
              <span>{blog?.is_featured ? "Featured" : "Feature"}</span>
            </button>
          )}

          {username === author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          ) : (
            " "
          )}

          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            {" "}
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
