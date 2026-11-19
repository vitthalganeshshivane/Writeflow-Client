import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { userContext } from "../App";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import SeriesCard from "../components/series-card.component";
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
    const existingIds = (series.blogs || []).map((b) => b._id || b.blog_id || b);
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
        toast.error(
          err.response?.data?.error || "Failed to save series"
        );
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
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Series & Playlists</h1>
            <p className="text-sm text-dark-grey mt-1">
              Organize your articles into structured reading paths
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn-dark py-2.5 px-5 text-sm rounded-full flex items-center gap-2"
          >
            <i className="fi fi-rr-plus text-xs"></i>
            <span>Create New Series</span>
          </button>
        </div>

        {/* InPage Tabs */}
        <InPageNavigation routes={["My Series", "Favorite Playlists"]}>
          {/* Tab 1: My Series */}
          <div>
            {mySeries === null ? (
              <Loader />
            ) : mySeries.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-grey rounded-2xl p-6">
                <i className="fi fi-rr-collection text-4xl text-dark-grey/40 mb-3 block"></i>
                <h3 className="font-semibold text-lg mb-1">No series created yet</h3>
                <p className="text-sm text-dark-grey mb-6">
                  Bundle your related blogs into ordered playlists for your readers.
                </p>
                <button
                  onClick={openCreateModal}
                  className="btn-dark py-2 px-5 text-sm rounded-full"
                >
                  Create First Series
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {mySeries.map((s) => (
                  <SeriesCard
                    key={s.series_id}
                    series={s}
                    isOwner={true}
                    onDelete={handleDeleteSeries}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tab 2: Favorite Playlists */}
          <div>
            {favoriteSeries === null ? (
              <Loader />
            ) : favoriteSeries.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-grey rounded-2xl p-6">
                <i className="fi fi-rr-heart text-4xl text-dark-grey/40 mb-3 block"></i>
                <h3 className="font-semibold text-lg mb-1">
                  No favorite series yet
                </h3>
                <p className="text-sm text-dark-grey">
                  When you bookmark series from publishers, they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {favoriteSeries.map((s) => (
                  <SeriesCard key={s.series_id} series={s} />
                ))}
              </div>
            )}
          </div>
        </InPageNavigation>
      </div>

      {/* Modal for Creating / Editing Series */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-grey max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-grey mb-6">
              <h2 className="text-xl font-bold">
                {editingSeries ? "Edit Series" : "Create New Series"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-grey flex items-center justify-center text-dark-grey hover:text-black"
              >
                <i className="fi fi-rr-cross text-xs"></i>
              </button>
            </div>

            <form onSubmit={handleSaveSeries} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-grey mb-2">
                  Series Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete React & Node.js Masterclass"
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
                  placeholder="Briefly describe what readers will learn in this series..."
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
                  placeholder="https://..."
                  className="input-box pl-4"
                />
              </div>

              {/* Select Blogs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-grey">
                    Select Articles for this Series ({selectedBlogIds.length} selected)
                  </label>
                </div>

                {loadingBlogs ? (
                  <p className="text-xs text-dark-grey">Loading your blogs...</p>
                ) : userBlogs.length === 0 ? (
                  <p className="text-xs text-dark-grey italic">
                    You have no published blogs to add yet.
                  </p>
                ) : (
                  <div className="max-h-52 overflow-y-auto space-y-2 border border-grey rounded-2xl p-3 bg-grey/30">
                    {userBlogs.map((b) => {
                      const id = b.blog_id;
                      const isSelected = selectedBlogIds.includes(id);

                      return (
                        <div
                          key={id}
                          onClick={() => handleToggleBlogSelection(id)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-purple/10 border-purple text-purple font-medium"
                              : "bg-white dark:bg-black/30 border-grey text-black dark:text-white hover:border-grey/80"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="pointer-events-none rounded text-purple"
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
                  className="btn-light py-2.5 px-5 text-sm rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-dark py-2.5 px-6 text-sm rounded-full"
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
