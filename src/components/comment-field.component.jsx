import { useContext, useState } from "react";
import { userContext } from "../App";
import toast from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";

const CommentField = ({
  action,
  index = undefined,
  replyingTo = undefined,
  setReplying,
}) => {
  // let {
  //   blog,
  //   blog: {
  //     _id,
  //     author: { _id: blog_author },
  //     comments,
  //     comments: { results: commentsArr },
  //     activity,
  //     activity: { total_comments, total_parent_comments },
  //   },
  //   setBlog,
  //   setTotalParentCommentsLoaded,
  // } = useContext(BlogContext);

  let { blog, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext);

  const _id = blog?._id;
  const blog_author = blog?.author?._id;

  const comments = blog?.comments;
  const commentsArr = comments?.results || [];

  const activity = blog?.activity || {};
  const total_comments = activity.total_comments || 0;
  const total_parent_comments = activity.total_parent_comments || 0;

  let {
    userAuth: { access_token, username, fullname, profile_img },
  } = useContext(userContext);

  const [comment, setComment] = useState("");

  const handleComment = () => {
    if (!access_token) {
      return toast.error("login first to leave the comment..");
    }

    if (!comment.length) {
      return toast.error("Write something to leave the comment...");
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/blog/add-comment",
        { _id, blog_author, comment, replying_to: replyingTo },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )
      .then(({ data }) => {
        setComment("");

        data.commented_by = {
          personal_info: { username, profile_img, fullname },
        };

        let newCommentArr;

        if (replyingTo) {
          commentsArr[index].children.push(data._id);

          data.childrenLevel = commentsArr[index].childrenLevel + 1;

          data.parentIndex = index;

          commentsArr[index].isReplyLoaded = true;

          commentsArr.splice(index + 1, 0, data);

          newCommentArr = commentsArr;

          setReplying(false);
        } else {
          data.childrenLevel = 0;

          newCommentArr = [data, ...(comments?.results || [])];
        }

        let parentInc = replyingTo ? 0 : 1;

        setBlog({
          ...blog,
          comments: { ...comments, results: newCommentArr },
          activity: {
            ...activity,
            total_comments: total_comments + 1,
            total_parent_comments: total_parent_comments + parentInc,
          },
        });

        setTotalParentCommentsLoaded((prev) => prev + parentInc);
      })
      .catch((err) => console.log(err));
  };

  // const handleComment = () => {
  //   if (!access_token) {
  //     return toast.error("login first to leave the comment..");
  //   }

  //   if (!comment.length) {
  //     return toast.error("Write something to leave the comment...");
  //   }

  //   axios
  //     .post(
  //       import.meta.env.VITE_SERVER_DOMAIN + "/add-comment",
  //       { _id, blog_author, comment },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     )

  //     .then(({ data }) => {
  //       console.log(data);
  //       setComment("");
  //       data.commented_by = {
  //         personal_info: { username, profile_img, fullname },
  //       };

  //       let newCommentArr;

  //       data.childrenLevel = 0;

  //       newCommentArray = [data, ...commentsArr];

  //       let parentCommentIncrementVal = 1;

  //       setBlog({
  //         ...blog,
  //         comments: { ...comments, results: newCommentArr },
  //         activity: {
  //           ...activity,
  //           total_comments: total_comments + 1,
  //           total_parent_comments:
  //             total_parent_comments + parentCommentIncrementVal,
  //         },
  //       });

  //       setTotalParentCommentsLoaded(
  //         (preVal) => preVal + parentCommentIncrementVal
  //       );
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // .then(({ data }) => {
  //       console.log(data);
  //       setComment("");

  //       data.commented_by = {
  //         personal_info: { username, profile_img, fullname },
  //       };

  //       data.childrenLevel = 0;

  //       let newCommentArr = [data, ...comments.results];

  //       let parentCommentIncrementVal = 1;

  //       setBlog({
  //         ...blog,
  //         comments: { ...comments, results: newCommentArr },
  //         activity: {
  //           ...activity,
  //           total_comments: total_comments + 1,
  //           total_parent_comments:
  //             total_parent_comments + parentCommentIncrementVal,
  //         },
  //       });

  //       setTotalParentCommentsLoaded(
  //         (preVal) => preVal + parentCommentIncrementVal
  //       );
  //     });

  return (
    <>
      <textarea
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
        id=""
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        {action}
      </button>
    </>
  );
};

export default CommentField;
