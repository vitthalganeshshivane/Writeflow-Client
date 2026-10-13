import { useState, useEffect } from "react";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "./loader.component";
import NoDataMessage from "./nodata.component";
import ThreadComposer from "./thread-composer.component";
import ThreadCard from "./thread-card.component";

const ThreadsFeed = () => {
  const [threads, setThreads] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchThreads = async (targetPage = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/thread/get-threads`,
        { page: targetPage, limit: 10 },
      );

      if (append) {
        setThreads((prev) => [...(prev || []), ...(data.threads || [])]);
      } else {
        setThreads(data.threads || []);
      }

      setHasMore(data.hasMore);
      setPage(targetPage);
    } catch (err) {
      console.error("Failed to fetch threads:", err);
      if (!append) setThreads([]);
    } finally {
      if (append) setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchThreads(1, false);
  }, []);

  const handleThreadPosted = () => {
    fetchThreads(1, false);
  };

  const handleThreadDeleted = (deletedId) => {
    setThreads((prev) =>
      (prev || []).filter((t) => t.thread_id !== deletedId),
    );
  };

  return (
    <div className="w-full max-w-[700px]">
      {/* Thread Composer */}
      <ThreadComposer onThreadPosted={handleThreadPosted} />

      {/* Threads List */}
      {threads === null ? (
        <Loader />
      ) : threads.length === 0 ? (
        <NoDataMessage message="No threads posted yet. Be the first to share a thought or quote!" />
      ) : (
        <div className="space-y-1">
          {threads.map((thread, index) => (
            <AnimationWrapper
              key={thread.thread_id || index}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ThreadCard
                thread={thread}
                onThreadDeleted={handleThreadDeleted}
              />
            </AnimationWrapper>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center my-8">
          <button
            type="button"
            disabled={loadingMore}
            onClick={() => fetchThreads(page + 1, true)}
            className="btn-light py-2 px-6 text-sm hover:bg-grey/50"
          >
            {loadingMore ? "Loading..." : "Load More Threads"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreadsFeed;
