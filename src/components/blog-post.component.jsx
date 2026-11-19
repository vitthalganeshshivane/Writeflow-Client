import { getDay } from "../common/date";
import { Link } from "react-router-dom";
import FeaturedBadge from "./featured-badge.component";
import SeriesBadge from "./series-badge.component";

const BlogPostCard = ({ content, author }) => {
  let {
    publishedAt,
    tags,
    title,
    des,
    banner,
    activity: { total_likes },
    blog_id: id,
    is_featured,
    series,
  } = content;

  let { fullname, profile_img, username } = author;

  return (
    <Link
      to={`/blog/${id}`}
      className="flex gap-8 items-center border-b border-grey pb-5 mb-4 group"
    >
      <div className="w-full">
        <div className="flex gap-2 items-center mb-5 flex-wrap">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
          {is_featured && <FeaturedBadge size="sm" />}
          {series && <SeriesBadge series={series} />}
        </div>
        <h1 className="blog-title group-hover:text-purple transition-colors">{title}</h1>
        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {des}
        </p>
        <div className="flex gap-4 mt-7 items-center">
          <span className="btn-light py-1 px-4"> {tags[0]}</span>
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <i className="fi fi-rr-heart text-xl">{total_likes}</i>
          </span>
        </div>
      </div>

      <div className="h-28 aspect-square bg-grey flex-shrink-0 rounded-md overflow-hidden">
        <img
          src={banner}
          alt=""
          className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    </Link>
  );
};

export default BlogPostCard;
