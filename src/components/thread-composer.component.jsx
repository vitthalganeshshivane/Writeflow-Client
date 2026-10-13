import { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { userContext } from "../App";
import { uploadImage } from "../common/aws";
import { parseYouTubeUrl } from "./youtube-embed.tool";
import defaultProfileImg from "../imgs/user profile.png";

const ThreadComposer = ({ onThreadPosted }) => {
  const {
    userAuth: { access_token, profile_img, username },
  } = useContext(userContext);

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [youtube, setYoutube] = useState(null); // { url, embedUrl, caption }
  const [youtubeInput, setYoutubeInput] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState(null);

  // Mentions auto-suggest
  const [mentionQuery, setMentionQuery] = useState(null);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [mentionIndex, setMentionIndex] = useState(-1);

  // Drafts drawer / popup
  const [drafts, setDrafts] = useState([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [loadingDrafts, setLoadingDrafts] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        80,
      )}px`;
    }
  }, [content]);

  // Fetch user's drafts count / list on mount or when token is present
  const fetchDrafts = async () => {
    if (!access_token) return;
    try {
      setLoadingDrafts(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_DOMAIN}/thread/my-drafts`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      setDrafts(data.drafts || []);
    } catch (err) {
      console.error("Failed to load thread drafts:", err);
    } finally {
      setLoadingDrafts(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [access_token]);

  // Search mentions when typing @
  useEffect(() => {
    if (mentionQuery === null || !mentionQuery.length) {
      setMentionSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_DOMAIN}/thread/search-users?q=${encodeURIComponent(
            mentionQuery,
          )}`,
        );
        setMentionSuggestions(data.users || []);
      } catch (err) {
        setMentionSuggestions([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [mentionQuery]);

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);

    // Detect if cursor is directly after an '@' mention
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursorPos);
    const lastAtMatch = textBeforeCursor.match(/@([a-zA-Z0-9_]*)$/);

    if (lastAtMatch) {
      setMentionQuery(lastAtMatch[1]);
      setMentionIndex(cursorPos - lastAtMatch[0].length);
    } else {
      setMentionQuery(null);
      setMentionSuggestions([]);
    }
  };

  const handleSelectMention = (suggestedUsername) => {
    if (mentionIndex === -1) return;

    const before = content.slice(0, mentionIndex);
    const after = content.slice(mentionIndex + (mentionQuery?.length || 0) + 1);
    const newText = `${before}@${suggestedUsername} ${after}`;

    setContent(newText);
    setMentionQuery(null);
    setMentionSuggestions([]);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading("Uploading image...");
    try {
      const url = await uploadImage(file, access_token);
      toast.dismiss(loadingToast);
      if (url) {
        setImage(url);
        toast.success("Image attached 🖼️");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err?.message || "Image upload failed");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAttachYoutube = () => {
    const parsed = parseYouTubeUrl(youtubeInput);
    if (!parsed) {
      return toast.error("Please enter a valid YouTube video link");
    }

    setYoutube({
      url: parsed.sourceUrl,
      embedUrl: parsed.embedUrl,
      caption: "",
    });
    setYoutubeInput("");
    setShowYoutubeInput(false);
    toast.success("YouTube video attached 🎥");
  };

  const handleSubmit = async (isDraft = false) => {
    if (!access_token) {
      return toast.error("Please sign in to post a thread");
    }

    const trimmedContent = content.trim();
    if (!isDraft && !trimmedContent && !image && !youtube) {
      return toast.error("Write something or attach an image/video to post");
    }

    setLoading(true);
    const loadingToast = toast.loading(
      isDraft ? "Saving thread draft..." : "Publishing thread...",
    );

    try {
      const payload = {
        id: activeDraftId,
        content: trimmedContent,
        image,
        youtube: youtube || null,
        draft: isDraft,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/thread/create-thread`,
        payload,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      toast.dismiss(loadingToast);

      if (isDraft) {
        toast.success("Thread draft saved 📝");
        setActiveDraftId(data.thread_id);
        fetchDrafts();
      } else {
        toast.success("Thread published 🎉");
        // Reset composer
        setContent("");
        setImage("");
        setYoutube(null);
        setActiveDraftId(null);
        fetchDrafts();
        if (onThreadPosted) onThreadPosted();
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err?.response?.data?.error || "Failed to save thread");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDraft = (draft) => {
    setContent(draft.content || "");
    setImage(draft.image || "");
    setYoutube(
      draft.youtube?.embedUrl ? draft.youtube : null,
    );
    setActiveDraftId(draft.thread_id);
    setShowDrafts(false);
    toast.success("Draft loaded into composer");
  };

  const handleDeleteDraft = async (draftId, e) => {
    e.stopPropagation();
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/thread/delete-thread`,
        { thread_id: draftId },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      toast.success("Draft deleted");
      if (activeDraftId === draftId) {
        setActiveDraftId(null);
      }
      fetchDrafts();
    } catch (err) {
      toast.error("Failed to delete draft");
    }
  };

  if (!access_token) {
    return (
      <div className="border border-grey rounded-2xl p-6 mb-8 text-center bg-grey/10">
        <p className="text-dark-grey text-base mb-3">
          Join the conversation, share short opinions, quotes, and thoughts.
        </p>
        <a href="/signin" className="btn-dark py-2 px-6 inline-block">
          Sign In to Post Threads
        </a>
      </div>
    );
  }

  return (
    <div className="relative border border-grey rounded-2xl p-4 md:p-6 mb-8 bg-white shadow-sm transition-all">
      {/* Drafts badge header */}
      <div className="flex items-center justify-between mb-3 text-xs text-dark-grey">
        <span className="font-medium flex items-center gap-1.5">
          <i className="fi fi-rr-comment-alt"></i> Share a Thought or Quote
        </span>

        {drafts.length > 0 && (
          <button
            type="button"
            onClick={() => setShowDrafts((prev) => !prev)}
            className="hover:underline flex items-center gap-1 font-medium text-black bg-grey px-2.5 py-1 rounded-full"
          >
            <i className="fi fi-rr-document"></i>
            Drafts ({drafts.length})
          </button>
        )}
      </div>

      {/* Drafts drawer dropdown */}
      {showDrafts && (
        <div className="mb-4 p-3 bg-grey/20 border border-grey rounded-xl max-h-60 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-dark-grey mb-2">
            Saved Thread Drafts
          </p>
          {loadingDrafts ? (
            <p className="text-xs text-dark-grey">Loading drafts...</p>
          ) : drafts.length === 0 ? (
            <p className="text-xs text-dark-grey">No drafts found.</p>
          ) : (
            <div className="space-y-2">
              {drafts.map((d) => (
                <div
                  key={d.thread_id}
                  onClick={() => handleLoadDraft(d)}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-grey hover:bg-grey/30 cursor-pointer transition text-left"
                >
                  <p className="text-sm font-medium line-clamp-1 flex-1 pr-2">
                    {d.content || "(Media only thread)"}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteDraft(d.thread_id, e)}
                    className="text-dark-grey hover:text-red p-1"
                    title="Delete draft"
                  >
                    <i className="fi fi-rr-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Composer Row */}
      <div className="flex gap-3 md:gap-4 items-start">
        <img
          src={profile_img || defaultProfileImg}
          alt={username || "User"}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            placeholder="What's happening? Type your thoughts, quotes, or @mention someone..."
            className="w-full resize-none border-none outline-none font-gelasio text-lg placeholder:text-dark-grey/50 bg-transparent text-black leading-relaxed"
            rows={2}
          />

          {/* Mentions Suggestion Dropdown */}
          {mentionSuggestions.length > 0 && (
            <div className="absolute z-30 mt-1 w-64 bg-white border border-grey rounded-xl shadow-xl overflow-hidden">
              <p className="text-xs uppercase px-3 py-1.5 font-bold text-dark-grey bg-grey/20">
                Mention Users
              </p>
              {mentionSuggestions.map((u) => (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => handleSelectMention(u.username)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-grey text-left transition"
                >
                  <img
                    src={u.profile_img || defaultProfileImg}
                    alt={u.username}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold leading-tight">{u.fullname}</p>
                    <p className="text-xs text-dark-grey">@{u.username}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Attached Image Preview */}
          {image && (
            <div className="relative mt-3 rounded-xl overflow-hidden border border-grey bg-grey/10 max-h-80 w-fit">
              <img
                src={image}
                alt="Attached"
                className="max-h-80 w-auto object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => setImage("")}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition shadow"
                title="Remove image"
              >
                &times;
              </button>
            </div>
          )}

          {/* YouTube Video Input Field */}
          {showYoutubeInput && !youtube && (
            <div className="mt-3 p-3 border border-dashed border-grey rounded-xl bg-grey/10 flex gap-2 items-center">
              <i className="fi fi-brands-youtube text-red text-xl"></i>
              <input
                type="text"
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAttachYoutube()}
                placeholder="Paste YouTube video link..."
                className="flex-1 bg-white border border-grey rounded-lg px-3 py-1.5 text-sm outline-none"
              />
              <button
                type="button"
                onClick={handleAttachYoutube}
                className="btn-dark py-1.5 px-3 text-xs"
              >
                Attach
              </button>
              <button
                type="button"
                onClick={() => setShowYoutubeInput(false)}
                className="text-dark-grey text-sm px-1 hover:text-black"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Attached YouTube Player Preview */}
          {youtube && youtube.embedUrl && (
            <div className="relative mt-3 rounded-xl overflow-hidden border border-grey aspect-video w-full max-w-[500px]">
              <iframe
                src={youtube.embedUrl}
                title="YouTube Preview"
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
              <button
                type="button"
                onClick={() => setYoutube(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition shadow z-10"
                title="Remove video"
              >
                &times;
              </button>
            </div>
          )}

          {/* Composer Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-grey/40">
            {/* Attachment buttons */}
            <div className="flex items-center gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-grey text-dark-grey hover:text-black transition"
                title="Attach image"
              >
                <i className="fi fi-rr-picture text-lg"></i>
              </button>

              <button
                type="button"
                onClick={() => setShowYoutubeInput((prev) => !prev)}
                className="p-2 rounded-full hover:bg-grey text-dark-grey hover:text-red transition"
                title="Embed YouTube video"
              >
                <i className="fi fi-brands-youtube text-lg"></i>
              </button>

              <span className="text-xs text-dark-grey/60 ml-2">
                Type <span className="font-mono font-medium">@</span> to mention
              </span>
            </div>

            {/* Submit buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit(true)}
                className="btn-light py-1.5 px-4 text-sm font-medium"
              >
                Save Draft
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit(false)}
                className="btn-dark py-1.5 px-5 text-sm font-medium"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadComposer;
