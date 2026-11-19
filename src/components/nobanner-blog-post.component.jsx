import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import FeaturedBadge from "./featured-badge.component";

const MinimalBlogPost = ({ blog, index }) => {
  let {
    title,
    publishedAt,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    blog_id: id,
    is_featured,
  } = blog;

  return (
    <Link to={`/blog/${id}`} className="flex gap-5 mb-8 group">
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>
      <div>
        <div className="flex gap-2 items-center mb-4 flex-wrap">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
          {is_featured && <FeaturedBadge size="sm" />}
        </div>
        <h1 className="blog-title group-hover:text-purple transition-colors">{title}</h1>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
