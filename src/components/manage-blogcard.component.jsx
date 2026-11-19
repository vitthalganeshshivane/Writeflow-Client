import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import { userContext } from "../App";
import axios from "axios";
import { toast } from "react-hot-toast";
import FeaturedBadge from "./featured-badge.component";
import SeriesBadge from "./series-badge.component";

const BlogStats = ({ stats }) => {
  return (
    <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">
      {Object.keys(stats).map((key, i) => {
        return !key.includes("parent") ? (
          <div
            key={i}
            className={
              "flex flex-col items-center w-full h-full justify-center p-4 px-6 " +
              (i !== 0 ? "border-grey border-l " : "")
            }
          >
            <h1 className="text-xl lg:text-2xl mb-2">
              {stats[key].toLocaleString()}
            </h1>
            <p className="max-lg:text-dark-grey capitalize">
              {key.split("_")[1]}
            </p>
          </div>
        ) : (
          ""
        );
      })}
    </div>
  );
};

export const ManagePublishedBlogsCard = ({ blog }) => {
  let { banner, blog_id, title, publishedAt, activity, is_featured, series } = blog;

  let {
    userAuth: { access_token },
  } = useContext(userContext);

  let [showStat, setShowStat] = useState(false);
  let [isFeatured, setIsFeatured] = useState(Boolean(is_featured));

  const toggleFeatured = () => {
    if (!access_token) return;

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
        setIsFeatured(data.is_featured);
        toast.success(
          data.is_featured ? "Marked as featured ⭐" : "Removed from featured",
        );
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.error || "Failed to toggle featured status",
        );
      });
  };

  return (
    <>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
        <img
          src={banner}
          className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover"
          alt=""
        />

        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isFeatured && <FeaturedBadge size="sm" />}
              {series && <SeriesBadge series={series} />}
            </div>
            <Link
              className="blog-title mb-4 hover:underline"
              to={`/blog/${blog_id}`}
            >
              {title}
            </Link>
            <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>
          </div>
          <div className="flex gap-6 mt-3 items-center">
            <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
              Edit
            </Link>
            <button
              className={`pr-4 py-2 underline flex items-center gap-1.5 transition-colors ${
                isFeatured
                  ? "text-amber-700 dark:text-amber-300 font-semibold"
                  : "text-dark-grey hover:text-black"
              }`}
              onClick={toggleFeatured}
            >
              <svg
                className={`w-2.5 h-2.5 ${
                  isFeatured
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-dark-grey"
                }`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
              </svg>
              <span>{isFeatured ? "Featured" : "Feature"}</span>
            </button>
            <button
              className="lg:hidden pr-4 py-2 underline"
              onClick={() => setShowStat((preVal) => !preVal)}
            >
              Stats
            </button>
            <button
              className="pr-4 py-2 underline text-red"
              onClick={(e) => deleteBlog(blog, access_token, e.target)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="max-lg:hidden">
          <BlogStats stats={activity} />
        </div>
      </div>
      {showStat ? (
        <div className="lg:hidden">
          {" "}
          <BlogStats stats={activity} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const ManageDraftBlogPost = ({ blog }) => {
  let { title, des, blog_id, index } = blog;

  let {
    userAuth: { access_token },
  } = useContext(userContext);
  index++;

  return (
    <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
      <h1 className="blog-index  text-center pl-4 md:pl-6 flex-mode">
        {index < 10 ? "0" + index : index}
      </h1>

      <div>
        <h1 className="blog-title mb-3">{title}</h1>
        <p className="line-clamp-2 font-gelasio">
          {des.length ? des : "No Description"}
        </p>
        <div className="flex gap-6 mt-3">
          <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
            Edit
          </Link>
          <button
            className="pr-4 py-2 mt-3 underline text-red"
            onClick={(e) => deleteBlog(blog, access_token, e.target)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const deleteBlog = (blog, access_token, target) => {
  let { index, blog_id, setStateFunc } = blog;

  target.setAttribute("disabled", true);

  axios
    .post(
      import.meta.env.VITE_SERVER_DOMAIN + "/blog/delete-blog",
      { blog_id },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    )
    .then(({ data }) => {
      target.removeAttribute("disabled");
      setStateFunc((preVal) => {
        let { deletedDocCount, totalDocs, results } = preVal;

        results.splice(index, 1);

        if (!deletedDocCount) {
          deletedDocCount = 0;
        }

        if (!results.length && totalDocs - 1 > 0) {
          return null;
        }

        return {
          ...preVal,
          totalDocs: totalDocs - 1,
          deletedDocCount: deletedDocCount + 1,
        };
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
