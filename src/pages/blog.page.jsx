// import { createContext, useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import Loader from "../components/loader.component";
// import AnimationWrapper from "../common/page-animation";
// import { getDay } from "../common/date";
// import BlogInteraction from "../components/blog-interaction.component";
// import BlogPostCard from "../components/blog-post.component";
// import BlogContent from "../components/blog-content.component";
// import CommentsContainer, {
//   fetchComments,
// } from "../components/comments.component";

// export const blogStructure = {
//   title: "",
//   des: [],
//   content: [],
//   author: { personal_info: {} },
//   banner: "",
//   publishedAt: "",
//   comments: { results: [] },
// };

// export const BlogContext = createContext({});

// const BlogPage = () => {
//   let { blog_id } = useParams();

//   const [blog, setBlog] = useState(blogStructure);
//   const [similarBlogs, setSimilarBlogs] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isLikedByUser, setLikedByUser] = useState(false);
//   const [commentsWrapper, setCommentsWrapper] = useState(false);
//   const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

//   let {
//     title,
//     content,
//     banner,
//     author: {
//       personal_info: { fullname, username: author_username, profile_img },
//     },
//     publishedAt,
//   } = blog;

//   const fetchBlog = () => {
//     axios
//       .post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/get-blog", { blog_id })
//       .then(async ({ data }) => {
//         const blogData = data.blog;

//         // Step 1 — first set blog without comments
//         setBlog(blogData);

//         // Step 2 — fetch comments using REAL blog id
//         const comments = await fetchComments({
//           blog_id: blogData._id,
//           setParentCommentCountFun: setTotalParentCommentsLoaded,
//         });

//         // Step 3 — attach comments
//         setBlog((prev) => ({ ...prev, comments }));

//         // Step 4 — fetch similar blogs
//         axios
//           .post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/search-blogs", {
//             tag: blogData.tags[0],
//             limit: 6,
//             eliminate_blog: blog_id,
//           })
//           .then(({ data }) => {
//             setSimilarBlogs(data.blogs);
//           });
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoading(false);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   // const fetchBlog = () => {
//   //   axios
//   //     .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
//   //     .then(async ({ data }) => {
//   //       blog.comments = await fetchComments({
//   //         blog_id: blog._id,
//   //         setParentCommentCountFun: setTotalParentCommentsLoaded,
//   //       });

//   //       console.log(data);
//   //       setBlog(data.blog);
//   //       axios
//   //         .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
//   //           tag: data.blog.tags[0],
//   //           limit: 6,
//   //           eliminate_blog: blog_id,
//   //         })
//   //         .then(({ data }) => {
//   //           setSimilarBlogs(data.blogs);
//   //           console.log(data.blogs);
//   //         });
//   //     })
//   //     .catch((err) => {
//   //       console.log(err);
//   //       setLoading(false);
//   //     })
//   //     .finally(() => {
//   //       setLoading(false);
//   //     });
//   // };

//   // const fetchBlog = () => {
//   //   axios
//   //     .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
//   //     .then(async ({ data }) => {
//   //       const blogData = data.blog;

//   //       // 👉 First set blog (without comments)
//   //       setBlog(blogData);

//   //       // 👉 Now fetch comments with REAL ID
//   //       const comments = await fetchComments({
//   //         blog_id: blogData._id,
//   //         setParentCommentCountFun: setTotalParentCommentsLoaded,
//   //       });

//   //       // 👉 Attach comments safely
//   //       setBlog((prev) => ({ ...prev, comments }));

//   //       // Fetch similar blogs
//   //       axios
//   //         .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
//   //           tag: blogData.tags[0],
//   //           limit: 6,
//   //           eliminate_blog: blog_id,
//   //         })
//   //         .then(({ data }) => {
//   //           setSimilarBlogs(data.blogs);
//   //         });
//   //     })
//   //     .catch((err) => {
//   //       console.log(err);
//   //       setLoading(false);
//   //     })
//   //     .finally(() => {
//   //       setLoading(false);
//   //     });
//   // };

//   useEffect(() => {
//     resetStates();
//     fetchBlog();
//   }, [blog_id]);

//   const resetStates = () => {
//     setBlog(blogStructure);
//     setSimilarBlogs(null);
//     setLoading(true);
//     setLikedByUser(false);
//     // setCommentWrapper(false);
//     setTotalParentCommentsLoaded(0);
//   };

//   return (
//     <AnimationWrapper>
//       {loading ? (
//         <Loader />
//       ) : (
//         <BlogContext.Provider
//           value={{
//             blog,
//             setBlog,
//             isLikedByUser,
//             setLikedByUser,
//             commentsWrapper,
//             setCommentsWrapper,
//             totalParentCommentsLoaded,
//             setTotalParentCommentsLoaded,
//           }}
//         >
//           <CommentsContainer />

//           <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
//             <img src={banner} alt="" className="aspect-video" />

//             <div className="mt-12">
//               <h2>{title}</h2>

//               <div className="flex max-sm:flex-col justify-between my-8">
//                 <div className="flex gap-5 items-start">
//                   <img
//                     src={profile_img}
//                     alt=""
//                     className="w-12 h-12 rounded-full"
//                   />
//                   <p className="capitalize">
//                     {fullname} <br />@
//                     <Link to={`/user/${author_username}`} className="underline">
//                       {author_username}
//                     </Link>
//                   </p>
//                 </div>
//                 <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
//                   Published on {getDay(publishedAt)}
//                 </p>
//               </div>
//             </div>
//             <BlogInteraction />

//             <div className="my-12 font-gelasio blog-page-content">
//               {content[0].blocks.map((block, i) => {
//                 return (
//                   <div key={i} className="my-4 md:my-8">
//                     <BlogContent block={block} />
//                   </div>
//                 );
//               })}
//             </div>

//             <BlogInteraction />

//             {similarBlogs !== null && similarBlogs.length ? (
//               <>
//                 <h1 className="text-2xl mt-14 mb-10 font-medium">
//                   similar blogs
//                 </h1>
//                 {similarBlogs.map((blog, i) => {
//                   let {
//                     author: { personal_info },
//                   } = blog;

//                   return (
//                     <AnimationWrapper
//                       key={i}
//                       transition={{ duration: 1, delay: i * 0.08 }}
//                     >
//                       <BlogPostCard content={blog} author={personal_info} />
//                     </AnimationWrapper>
//                   );
//                 })}
//               </>
//             ) : (
//               " "
//             )}
//           </div>
//         </BlogContext.Provider>
//       )}
//     </AnimationWrapper>
//   );
// };

// export default BlogPage;

// blog.page.jsx
import { createContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, {
  fetchComments,
} from "../components/comments.component";

/* ─────────────────────────────────────────────
   Default blog structure — prevents destructure
   crashes before data loads.
───────────────────────────────────────────── */
export const blogStructure = {
  title: "",
  des: "",
  content: [{ blocks: [] }], // ← safe default so content[0].blocks never throws
  tags: [],
  author: { personal_info: { fullname: "", username: "", profile_img: "" } },
  banner: "",
  publishedAt: "",
  comments: { results: [] },
};

export const BlogContext = createContext({});

/* ─────────────────────────────────────────────
   READING TIME — counts words across all text
   blocks and divides by avg 200 wpm reading speed.
───────────────────────────────────────────── */
const calcReadingTime = (blocks = []) => {
  const TEXT_BLOCK_TYPES = new Set([
    "paragraph",
    "header",
    "quote",
    "list",
    "callout",
    "warning",
  ]);

  let wordCount = 0;

  blocks.forEach(({ type, data }) => {
    if (!TEXT_BLOCK_TYPES.has(type) || !data) return;

    let raw = "";

    if (type === "list") {
      raw = (data.items || []).join(" ");
    } else {
      raw = data.text || data.message || data.title || "";
    }

    // Strip HTML tags then count
    const plain = raw.replace(/<[^>]+>/g, "").trim();
    if (plain) {
      wordCount += plain.split(/\s+/).length;
    }
  });

  const minutes = Math.ceil(wordCount / 200);
  return minutes < 1 ? "< 1 min read" : `${minutes} min read`;
};

/* ─────────────────────────────────────────────
   TABLE OF CONTENTS — extracted from heading
   blocks. Clicking a TOC entry smooth-scrolls
   to the corresponding heading via its id.
───────────────────────────────────────────── */
const buildTOC = (blocks = []) => {
  return blocks
    .filter((b) => b.type === "header" && b.data?.text)
    .map((b) => {
      const plain = b.data.text.replace(/<[^>]+>/g, "");
      const id = plain
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      return { level: b.data.level, text: plain, id };
    });
};

const TOCItem = ({ item }) => {
  const indent = {
    1: "ml-0",
    2: "ml-0",
    3: "ml-3",
    4: "ml-6",
    5: "ml-9",
    6: "ml-12",
  };

  const handleClick = (e) => {
    e.preventDefault();
    const el = document.getElementById(item.id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL hash without jumping
      history.pushState(null, "", `#${item.id}`);
    }
  };

  return (
    <li className={indent[item.level] || "ml-0"}>
      <a
        href={`#${item.id}`}
        onClick={handleClick}
        className={`
          block py-1 text-sm leading-snug hover:text-black transition-colors
          ${item.level <= 2 ? "font-medium text-dark-grey" : "text-dark-grey/70"}
        `}
      >
        {item.text}
      </a>
    </li>
  );
};

const TableOfContents = ({ blocks }) => {
  const [open, setOpen] = useState(true);
  const toc = useMemo(() => buildTOC(blocks), [blocks]);

  if (toc.length < 2) return null; // Don't show TOC for very short articles

  return (
    <div className="my-8 border border-grey/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-3 bg-grey/10 hover:bg-grey/20 transition-colors text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm uppercase tracking-wide">
          📋 Table of Contents
        </span>
        <span className="text-dark-grey/60 text-lg leading-none">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <nav className="px-5 py-4" aria-label="Table of contents">
          <ul className="space-y-0.5">
            {toc.map((item, i) => (
              <TOCItem key={i} item={item} />
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   BLOG PAGE
───────────────────────────────────────────── */
const BlogPage = () => {
  const { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLikedByUser, setLikedByUser] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  // Safe destructuring — blogStructure guarantees these paths always exist
  const {
    title,
    des,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  // All blocks from the first (and usually only) content item
  const blocks = content?.[0]?.blocks ?? [];

  const readingTime = useMemo(() => calcReadingTime(blocks), [blocks]);

  /* ── Fetch ────────────────────────────────── */
  const fetchBlog = async () => {
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/blog/get-blog",
        { blog_id },
      );

      const blogData = data.blog;

      // Set blog first (without comments) so page renders quickly
      setBlog(blogData);

      // Fetch comments using the real Mongo _id (not the URL slug)
      const comments = await fetchComments({
        blog_id: blogData._id,
        setParentCommentCountFun: setTotalParentCommentsLoaded,
      });

      setBlog((prev) => ({ ...prev, comments }));

      // Fetch similar blogs (non-blocking — fire and forget)
      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/search-blogs", {
          tag: blogData.tags?.[0],
          limit: 6,
          eliminate_blog: blog_id,
        })
        .then(({ data }) => setSimilarBlogs(data.blogs))
        .catch(() => setSimilarBlogs([]));
    } catch (err) {
      console.error("[BlogPage] fetchBlog error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [blog_id]);

  const resetStates = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
    setLikedByUser(false);
    setCommentsWrapper(false); // ← was commented out, now fixed
    setTotalParentCommentsLoaded(0);
  };

  /* ── Render ───────────────────────────────── */
  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            isLikedByUser,
            setLikedByUser,
            commentsWrapper,
            setCommentsWrapper,
            totalParentCommentsLoaded,
            setTotalParentCommentsLoaded,
          }}
        >
          <CommentsContainer />

          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            {/* Banner */}
            {banner && (
              <img
                src={banner}
                alt={title}
                loading="lazy"
                className="aspect-video w-full rounded-xl object-cover"
              />
            )}

            <div className="mt-12">
              <h2 className="leading-tight">{title}</h2>

              {/* Description / subtitle */}
              {des && (
                <p className="text-xl text-dark-grey/80 mt-4 leading-relaxed font-light">
                  {des}
                </p>
              )}

              {/* Author row + reading time */}
              <div className="flex max-sm:flex-col justify-between items-start my-8 gap-4">
                <div className="flex gap-5 items-start">
                  <img
                    src={profile_img}
                    alt={fullname}
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <p className="capitalize leading-relaxed">
                    {fullname}
                    <br />
                    <Link
                      to={`/user/${author_username}`}
                      className="underline text-dark-grey/70 hover:text-black transition-colors"
                    >
                      @{author_username}
                    </Link>
                  </p>
                </div>

                <div className="text-right max-sm:text-left max-sm:ml-17 text-dark-grey/70 text-sm space-y-1">
                  <p>Published on {getDay(publishedAt)}</p>
                  <p className="font-medium text-dark-grey">⏱ {readingTime}</p>
                </div>
              </div>
            </div>

            <BlogInteraction />

            {/* Table of Contents — auto-generated from headings */}
            <TableOfContents blocks={blocks} />

            {/* Blog body */}
            <div className="my-12 font-gelasio blog-page-content">
              {blocks.length > 0 ? (
                blocks.map((block, i) => (
                  <div key={block.id || i} className="my-4 md:my-8">
                    <BlogContent block={block} />
                  </div>
                ))
              ) : (
                <p className="text-dark-grey/60 italic">
                  No content available.
                </p>
              )}
            </div>

            <BlogInteraction />

            {/* Similar blogs */}
            {similarBlogs !== null && similarBlogs.length > 0 && (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Similar Blogs
                </h1>
                {similarBlogs.map((blog, i) => {
                  const {
                    author: { personal_info },
                  } = blog;
                  return (
                    <AnimationWrapper
                      key={blog.blog_id || i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogPostCard content={blog} author={personal_info} />
                    </AnimationWrapper>
                  );
                })}
              </>
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
