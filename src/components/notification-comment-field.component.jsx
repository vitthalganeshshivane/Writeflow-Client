import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { userContext } from "../App";

const NotificationCommentField = ({
  _id,
  blog_author,
  index = undefined,
  replyingTo = undefined,
  setReplying,
  notification_id,
  notificationData,
}) => {
  let [comment, setComment] = useState("");

  // let { _id: user_id } = blog_author;

  if (!blog_author || !blog_author._id) {
    return null;
  }

  let user_id = blog_author._id;

  let {
    userAuth: { access_token },
  } = useContext(userContext);

  let {
    notifications,
    notifications: { results },
    setNotifications,
  } = notificationData;

  const handleComment = () => {
    if (!comment.length) {
      return toast.error("Write something to leave the comment...");
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/blog/add-comment",
        {
          _id,
          blog_author: user_id,
          comment,
          replying_to: replyingTo,
          notification_id,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )
      .then(({ data }) => {
        setReplying(false);
        results[index].reply = { comment, _id: data._id };
        setNotifications({ ...notifications, results });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <textarea
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
        placeholder="Leave a reply..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
        id=""
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        Reply
      </button>
    </>
  );
};

export default NotificationCommentField;
