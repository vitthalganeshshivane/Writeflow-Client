import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { userContext } from "../App";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { getDay } from "../common/date";
import { toast } from "react-hot-toast";

const ManageSeries = () => {
  const {
    userAuth: { access_token, username },
  } = useContext(userContext);

  const [mySeries, setMySeries] = useState(null);
  const [favoriteSeries, setFavoriteSeries] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState("");
  const [selectedBlogIds, setSelectedBlogIds] = useState([]);

  const defaultBanner =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";

  // Fetch my series
  const fetchMySeries = () => {
    if (!username) return;
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/series/user-series", {
        username,
      })
      .then(({ data }) => {
        setMySeries(data.series || []);
      })
      .catch((err) => {
        console.error("Fetch My Series Error:", err);
        setMySeries([]);
      });
  };

  // Fetch favorite series
  const fetchFavoriteSeries = () => {
    if (!access_token) return;
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/series/favorites",
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setFavoriteSeries(data.series || []);
      })
      .catch((err) => {
        console.error("Fetch Favorite Series Error:", err);
        setFavoriteSeries([]);
      });
  };

  // Fetch user blogs for selection in series
  const fetchUserBlogs = () => {
    if (!access_token) return;
    setLoadingBlogs(true);
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/blog/user-written-blogs",
        { draft: false, page: 1 },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setUserBlogs(data.blogs || []);
      })
      .catch((err) => {
        console.error("Fetch user blogs error:", err);
      })
      .finally(() => {
        setLoadingBlogs(false);
      });
  };

  useEffect(() => {
    fetchMySeries();
    fetchFavoriteSeries();
    fetchUserBlogs();
  }, [access_token, username]);

  const openCreateModal = () => {
    setEditingSeries(null);
    setTitle("");
    setDescription("");
    setBanner("");
    setSelectedBlogIds([]);
    setIsModalOpen(true);
  };

  const openEditModal = (series) => {
    setEditingSeries(series);
    setTitle(series.title || "");
    setDescription(series.description || "");
    setBanner(series.banner || "");
    const existingIds = (series.blogs || []).map(
      (b) => b._id || b.blog_id || b
    );
    setSelectedBlogIds(existingIds);
    setIsModalOpen(true);
  };

  const handleToggleBlogSelection = (blogId) => {
    setSelectedBlogIds((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleSaveSeries = (e) => {
    e.preventDefault();

    if (!title.trim().length) {
      toast.error("Please enter a title for the series");
      return;
    }

    setSubmitting(true);

    const payload = {
      title,
      description,
      banner,
      blogs: selectedBlogIds,
    };

    if (editingSeries) {
      payload.series_id = editingSeries.series_id;
    }

    const endpoint = editingSeries ? "/series/update" : "/series/create";

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + endpoint, payload, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        toast.success(
          editingSeries
            ? "Series updated successfully 👍"
            : "Series created successfully 🎉"
        );
        setIsModalOpen(false);
        fetchMySeries();
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Failed to save series");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleDeleteSeries = (series) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the series "${series.title}"?`
      )
    ) {
      return;
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/series/delete",
        { series_id: series.series_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        toast.success("Series deleted");
        setMySeries((prev) =>
          prev.filter((s) => s.series_id !== series.series_id)
        );
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Failed to delete series");
      });
  };

  return (
    <AnimationWrapper>
      <div className="pb-12">
        {/* Header - Identical to ManageBlogs style */}
        <div className="flex justify-between items-center max-md:mt-5 md:mt-8 mb-8">
          <h1 className="max-md:hidden">Manage Series</h1>
          <button
            onClick={openCreateModal}
            className="btn-dark py-2.5 px-6 text-sm"
          >
            + Create Series
          </button>
        </div>

        {/* InPage Tabs */}
        <InPageNavigation routes={["My Series", "Favorite Series"]}>
          {/* Tab 1: My Series */}
          <div>
            {mySeries === null ? (
              <Loader />
            ) : mySeries.length === 0 ? (
              <NoDataMessage message="No Series Created Yet" />
            ) : (
              mySeries.map((s) => (
                <div
                  key={s.series_id}
                  className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center"
                >
                  <img
                    src={s.banner || defaultBanner}
                    className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover rounded-md"
                    alt=""
                  />

                  <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div>
                      <Link
                        className="blog-title mb-2 hover:underline block"
                        to={`/series/${s.series_id}`}
                      >
                        {s.title}
                      </Link>
                      {s.description && (
                        <p className="line-clamp-2 text-dark-grey text-sm mb-2 font-gelasio leading-relaxed">
                          {s.description}
                        </p>
                      )}
                      <p className="line-clamp-1 text-sm text-dark-grey">
                        {s.blogs?.length || 0} Chapters • Created on{" "}
                        {getDay(s.createdAt)}
                      </p>
                    </div>

                    <div className="flex gap-6 mt-3 items-center">
                      <Link
                        to={`/series/${s.series_id}`}
                        className="pr-4 py-2 underline text-purple"
                      >
                        View Series
                      </Link>
                      <button
                        onClick={() => openEditModal(s)}
                        className="pr-4 py-2 underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSeries(s)}
                        className="pr-4 py-2 underline text-red"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Tab 2: Favorite Playlists */}
          <div>
            {favoriteSeries === null ? (
              <Loader />
            ) : favoriteSeries.length === 0 ? (
              <NoDataMessage message="No Favorite Series Yet" />
            ) : (
              favoriteSeries.map((s) => (
                <div
                  key={s.series_id}
                  className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center"
                >
                  <img
                    src={s.banner || defaultBanner}
                    className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover rounded-md"
                    alt=""
                  />

                  <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div>
                      <Link
                        className="blog-title mb-2 hover:underline block"
                        to={`/series/${s.series_id}`}
                      >
                        {s.title}
                      </Link>
                      {s.author?.personal_info && (
                        <p className="text-xs text-dark-grey mb-1">
                          By {s.author.personal_info.fullname} (@
                          {s.author.personal_info.username})
                        </p>
                      )}
                      <p className="line-clamp-1 text-sm text-dark-grey">
                        {s.blogs?.length || 0} Chapters
                      </p>
                    </div>

                    <div className="flex gap-6 mt-3 items-center">
                      <Link
                        to={`/series/${s.series_id}`}
                        className="pr-4 py-2 underline text-purple"
                      >
                        View Series
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </InPageNavigation>
      </div>

      {/* Modal for Creating / Editing Series - 100% Writeflow Themed */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 md:p-8 shadow-xl border border-grey max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-grey mb-6">
              <h2 className="text-2xl font-medium">
                {editingSeries ? "Edit Series" : "Create New Series"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-grey flex items-center justify-center text-dark-grey hover:text-black transition-colors"
              >
                <i className="fi fi-rr-cross text-xs"></i>
              </button>
            </div>

            <form onSubmit={handleSaveSeries} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-grey mb-2">
                  Series Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Formula 1: The Modern Era"
                  className="input-box pl-4"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-grey mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this series about?"
                  rows={3}
                  className="input-box pl-4 resize-none h-auto"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-grey mb-2">
                  Cover Banner URL
                </label>
                <input
                  type="url"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="input-box pl-4"
                />
              </div>

              {/* Select Blogs */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-grey mb-2">
                  Select Articles ({selectedBlogIds.length} selected)
                </label>

                {loadingBlogs ? (
                  <p className="text-xs text-dark-grey">Loading blogs...</p>
                ) : userBlogs.length === 0 ? (
                  <p className="text-xs text-dark-grey italic">
                    No published blogs found. Publish blogs first to add them here.
                  </p>
                ) : (
                  <div className="max-h-52 overflow-y-auto space-y-2 border border-grey rounded-xl p-3 pr-2 bg-grey/30">
                    {userBlogs.map((b) => {
                      const id = b.blog_id;
                      const isSelected = selectedBlogIds.includes(id);

                      return (
                        <div
                          key={id}
                          onClick={() => handleToggleBlogSelection(id)}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-purple/10 border-purple text-purple font-medium"
                              : "bg-white border-grey hover:border-dark-grey/40"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="pointer-events-none rounded"
                          />
                          <span className="text-sm truncate flex-1">
                            {b.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-grey">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-light py-2 px-5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-dark py-2 px-6 text-sm"
                >
                  {submitting
                    ? "Saving..."
                    : editingSeries
                    ? "Update Series"
                    : "Create Series"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AnimationWrapper>
  );
};

export default ManageSeries;
