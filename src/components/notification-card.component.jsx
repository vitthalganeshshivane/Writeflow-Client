import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentField from "./notification-comment-field.component";
import { userContext } from "../App";
import axios from "axios";

const NotificationCard = ({ data, index, notificationState }) => {
  let [isReplying, setReplying] = useState(false);

  let {
    seen,
    type,
    reply,
    createdAt,
    comment,
    replied_on_comment,
    user,

    blog: { _id, blog_id, title },
    _id: notification_id,
  } = data;

  const fullname = user?.personal_info?.fullname || "Deleted User";
  const username = user?.personal_info?.username || "unknown";
  const profile_img = user?.personal_info?.profile_img;

  let {
    userAuth: {
      username: author_username,
      profile_img: author_profile_img,
      access_token,
    },
  } = useContext(userContext);

  let {
    notifications,
    notifications: { results, totalDocs },
    setNotifications,
  } = notificationState;

  const handleReplyClick = () => {
    setReplying((preVal) => !preVal);
  };

  const handleDelete = (comment_id, type, target) => {
    target.setAttribute("disabled", true);
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/blog/delete-comment",
        { _id: comment_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )
      .then(() => {
        if (type == "comment") {
          results.splice(index, 1);
        } else {
          delete results[index].reply;
        }

        target.removeAttribute("disabled");
        setNotifications({
          ...notifications,
          results,
          totalDocs: totalDocs - 1,
          deletedDocCount: notifications.deletedDocCount - 1,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className={
        "p-6 border-b border-grey border-l-black " + (!seen ? "border-l-2" : "")
      }
    >
      <div className="flex gap-5 mb-3">
        <img
          src={profile_img}
          className="w-14 h-14 flex-none rounded-full"
          alt=""
        />
        <div className="w-full">
          <h1 className="font-medium text-xl text-dark-grey">
            <span className="lg:inline-block hidden capitalize">
              {fullname}
            </span>
            <Link
              to={`/user/${username}`}
              className="mx-1 text-black underline"
            >
              @{username}
            </Link>
            <span className="font-normal">
              {type == "like"
                ? "liked your blog"
                : type == "comment"
                  ? "commented on"
                  : "replied on"}
            </span>
          </h1>
          {type == "reply" ? (
            <div className="p-4 mt-4 rounded-md bg-grey">
              <p>{replied_on_comment.comment}</p>
            </div>
          ) : (
            <Link
              className="font-medium text-dark-grey hover:underline line-clamp-1"
              to={`/blog/${blog_id}`}
            >{`"${title}"`}</Link>
          )}
        </div>
      </div>
      {type !== "like" ? (
        <p className="ml-14 pl-5 font-gelasio text-xl my-5">
          {comment.comment}
        </p>
      ) : (
        ""
      )}

      <div className="ml-14 pl-5 text-dark-grey flex gap-8">
        <p>{getDay(createdAt)}</p>
        {type !== "like" ? (
          <>
            {!reply ? (
              <button
                onClick={handleReplyClick}
                className="underline hover:text-black"
              >
                Reply
              </button>
            ) : (
              ""
            )}
            <button
              onClick={(e) => handleDelete(comment._id, "comment", e.target)}
              className="underline hover:text-black"
            >
              Delete
            </button>
          </>
        ) : (
          ""
        )}
      </div>

      {isReplying ? (
        <div className="mt-8">
          <NotificationCommentField
            _id={_id}
            blog_author={user}
            index={index}
            replyingTo={comment._id}
            setReplying={setReplying}
            notification_id={notification_id}
            notificationData={notificationState}
          />
        </div>
      ) : (
        ""
      )}

      {reply ? (
        <div className="ml-20 p-5 bg-grey mt-5 rounded-md ">
          <div className="flxe gap-3 mb-3">
            <img
              src={author_profile_img}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div className="">
              <h1 className="font-medium text-xl text-dark-grey">
                <Link
                  className="mx-1 text-black underline"
                  to={`/user/${author_username}`}
                >
                  @{author_username}
                </Link>
                <span className="font-normal">replied to</span>
                <Link
                  className="mx-1 text-black underline"
                  to={`/user/${username}`}
                >
                  @{username}
                </Link>
              </h1>
            </div>
          </div>
          <p className="ml-14 font-gelasio text-xl my-2">{reply.comment}</p>
          <button
            onClick={(e) => handleDelete(comment._id, "reply", e.target)}
            className="underline hover:text-black ml-14 mt-2"
          >
            Delete
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotificationCard;
