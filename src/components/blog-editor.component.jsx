import { Link, useNavigate, useParams } from "react-router-dom";
import lightLogo from "../imgs/logo-light.png";
import darkLogo from "../imgs/logo-dark.png";
import AnimationWrapper from "../common/page-animation";
import { uploadImage } from "../common/aws";
import lightBanner from "../imgs/blog banner light.png";
import darkBanner from "../imgs/blog banner dark.png";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { ThemeContext, userContext, AIModelContext } from "../App";
import { requestTitleAgent } from "../common/ai-title.api";

function BlogEditor() {
  const MIN_TITLE_HEIGHT = 80;
  const {
    blog = {},
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  const { title = "", banner = "", content = [], tags = [], des = "" } = blog;

  const {
    userAuth: { access_token },
  } = useContext(userContext);

  const { theme } = useContext(ThemeContext);
  const { aiModel, setAiModel } = useContext(AIModelContext);

  const { blog_id } = useParams();
  const navigate = useNavigate();

  const [copilotOn, setCopilotOn] = useState(true);
  const [ghostTitle, setGhostTitle] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const titleInputRef = useRef(null);
  const [modelOpen, setModelOpen] = useState(false);

  // ── Autosave state & refs ──────────────────
  const [autosaveStatus, setAutosaveStatus] = useState(""); // "", "saving", "saved", "offline"
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const activeBlogIdRef = useRef(blog_id || blog?.blog_id || null);
  const editorInstanceRef = useRef(null);
  const isSavingRef = useRef(false);
  const blogStateRef = useRef(blog);

  useEffect(() => {
    blogStateRef.current = blog;
  }, [blog]);

  useEffect(() => {
    if (blog_id) {
      activeBlogIdRef.current = blog_id;
    }
  }, [blog_id]);

  const trimmedTitle = title.trim();
  const slashPrompt = trimmedTitle.startsWith("/write ")
    ? trimmedTitle.slice(7).trim()
    : "";

  const canRunSlash =
    trimmedTitle.startsWith("/write ") && slashPrompt.length > 0;

  const AI_MODELS = [
    // ✅ NVIDIA WORKING
    // healthy
    {
      provider: "nvidia",
      model: "openai/gpt-oss-120b",
      name: "GPT OSS 120B",
      desc: "Massive open model (OpenAI Family) 🚀",
    },
    // healthy
    {
      provider: "nvidia",
      model: "openai/gpt-oss-20b",
      name: "GPT OSS 20B",
      desc: "Massive open model (OpenAI Family) 🚀",
    },
    // healthy
    {
      provider: "nvidia",
      model: "meta/llama-3.1-70b-instruct",
      name: "LLaMA 70B",
      desc: "Best reasoning 🔥",
    },
    // healthy
    {
      provider: "nvidia",
      model: "meta/llama-3.1-8b-instruct",
      name: "LLaMA 8B",
      desc: "Best for ghost ⚡",
    },

    // ✅ GROQ
    // healthy but jerk 😭🤣😂💀
    {
      provider: "groq",
      model: "llama-3.1-8b-instant",
      name: "Groq Fast",
      desc: "Ultra fast ⚡",
    },

    // ✅ GEMINI
    {
      provider: "gemini",
      model: "gemini-1.5-flash-latest",
      name: "Gemini Flash",
      desc: "Creative ✨",
    },
    // healthy and quick but cold start
    {
      provider: "nvidia",
      model: "google/gemma-3n-e4b-it",
      name: "Gemma 3N E4B",
      desc: "Lightweight multimodal model ⚡",
    },
    //healthy faster but so dumb
    {
      provider: "nvidia",
      model: "google/gemma-3n-e2b-it",
      name: "Gemma 3N E2B",
      desc: "Ultra lightweight fast model ⚡",
    },

    // 🧪 NVIDIA (ADVANCED – NOW CORRECT NAMING)
    //most of the times does not respond because of heavy load on nvidia nim platform
    {
      provider: "nvidia",
      model: "deepseek-ai/deepseek-v4-pro",
      name: "DeepSeek V4 Pro",
      desc: "Extreme reasoning 🧠",
    },
    //healthy
    {
      provider: "nvidia",
      model: "deepseek-ai/deepseek-v4-flash",
      name: "DeepSeek Flash",
      desc: "Faster DeepSeek ⚡",
    },
    //healthy
    {
      provider: "nvidia",
      model: "minimaxai/minimax-m2.7",
      name: "MiniMax M2.7",
      desc: "Large reasoning model",
    },

    //healthy but sometimes requests goes to queue because of high demand

    {
      provider: "nvidia",
      model: "mistralai/mistral-large-3-675b-instruct-2512",
      name: "Mistral Large 675B",
      desc: "Massive enterprise reasoning model 🌪️",
    },

    //healthy fast but so dumb
    {
      provider: "nvidia",
      model: "nvidia/nemotron-mini-4b-instruct",
      name: "Nemotron Mini 4B",
      desc: "Compact instruction model 🤖",
    },

    //response is not coming just stuck
    {
      provider: "nvidia",
      model: "moonshotai/kimi-k2.6",
      name: "Kimi K2.6",
      desc: "Advanced reasoning",
    },
  ];

  const applyTitle = (nextTitle) => {
    const cleaned = String(nextTitle)
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/["'`]/g, "")
      .trim();

    setBlog((current) => ({
      ...current,
      title: cleaned,
    }));

    setGhostTitle("");
    setSuggestions([]);
    setSuggestOpen(false);
  };

  const callAgent = async (mode, input) => {
    const cleanInput = String(input || "").trim();

    if (!cleanInput) {
      toast.error("Type a prompt first");
      return;
    }

    setBusy(true);

    try {
      const { data } = await requestTitleAgent(
        {
          mode,
          provider: aiModel?.provider || "nvidia",
          model: aiModel?.model || "meta/llama-3.1-70b-instruct",
          input: cleanInput,
          description: des,
          tags,
        },
        access_token,
      );

      if (mode === "suggest") {
        setSuggestions(data.titles || []);
        setSuggestOpen(true);
      } else if (data.title) {
        applyTitle(data.title);
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "AI title request failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSlashClick = () => callAgent("slash", slashPrompt);
  const handleSuggestClick = () =>
    callAgent("suggest", slashPrompt || title.trim());

  const ghostSuffix = (() => {
    const suggestion = String(ghostTitle || "");
    if (!suggestion.trim()) return "";
    if (!title) return suggestion.trimStart();

    const needsSpace =
      !/\s$/.test(title) && /^[A-Za-z0-9]/.test(suggestion.trimStart());

    return needsSpace ? ` ${suggestion.trimStart()}` : suggestion;
  })();

  const hasGhostSuffix = copilotOn && ghostSuffix.trim().length > 0;

  useLayoutEffect(() => {
    if (!titleInputRef.current) return;
    const input = titleInputRef.current;
    input.style.height = "auto";
    input.style.height = `${Math.max(input.scrollHeight, MIN_TITLE_HEIGHT)}px`;
    input.style.overflowY = "hidden";
  }, [title]);

  useEffect(() => {
    if (!copilotOn) {
      setGhostTitle("");
      return;
    }

    const raw = title.trim();

    if (!raw || raw.startsWith("/write")) {
      setGhostTitle("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await requestTitleAgent(
          {
            mode: "ghost",
            provider: aiModel?.provider || "nvidia",
            model: aiModel?.model || "meta/llama-3.1-70b-instruct",
            input: raw,
            description: des,
            tags,
          },
          access_token,
        );

        const completion = String(data.completion || "")
          .replace(/["'`]/g, "")
          .replace(/\s+/g, " ")
          .trimStart();
        setGhostTitle(completion);
      } catch {
        setGhostTitle("");
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [title, copilotOn, aiModel, access_token, des, tags]);

  console.log({
    provider: aiModel?.provider,
    model: aiModel?.model,
  });

  // ── EditorJS Lifecycle ─────────────────────
  useEffect(() => {
    const editor = new EditorJS({
      holder: "textEditor",
      data: Array.isArray(content) ? content[0] : content,
      tools: tools,
      placeholder: "Let's write an awesome story",
    });

    editorInstanceRef.current = editor;
    setTextEditor(editor);

    return () => {
      if (editor && typeof editor.destroy === "function") {
        try {
          editor.destroy();
        } catch (err) {
          console.error("EditorJS cleanup error:", err);
        }
      }
      editorInstanceRef.current = null;
      setTextEditor({ isReady: false });
    };
  }, []);

  // ── Background Autosave ─────────────────────
  const performAutosave = async () => {
    if (isSavingRef.current) return;
    const editor = editorInstanceRef.current || textEditor;
    if (!editor || typeof editor.save !== "function") return;

    try {
      const contentData = await editor.save();
      const currentBlog = blogStateRef.current || {};
      const currentTitle = (currentBlog.title || "").trim();
      const hasBlocks = contentData?.blocks && contentData.blocks.length > 0;
      const hasMeaningfulBlocks =
        hasBlocks &&
        contentData.blocks.some(
          (b) =>
            b.data &&
            (b.data.text ||
              b.data.file ||
              b.data.embed ||
              b.data.source ||
              b.data.code),
        );

      // Skip autosave if title and editor content are both completely empty
      if (!currentTitle && !hasMeaningfulBlocks) {
        return;
      }

      isSavingRef.current = true;
      setAutosaveStatus("saving");

      const draftTitle = currentTitle || "Untitled Draft";

      const blogObj = {
        title: draftTitle,
        banner: currentBlog.banner || "",
        des: currentBlog.des || "",
        content: contentData,
        tags: currentBlog.tags || [],
        draft: true,
      };

      // Always save a local backup to localStorage as safety net
      try {
        const localKey = `writeflow_draft_${activeBlogIdRef.current || "current"}`;
        localStorage.setItem(
          localKey,
          JSON.stringify({ ...blogObj, savedAt: Date.now() }),
        );
      } catch (localErr) {
        console.warn("Local storage draft backup failed:", localErr);
      }

      const { data } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/blog/create-blog",
        { ...blogObj, id: activeBlogIdRef.current },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (data && data.id) {
        const savedId = data.id;
        activeBlogIdRef.current = savedId;
        setBlog((current) => ({
          ...current,
          blog_id: savedId,
          content: contentData,
        }));

        // Seamlessly update URL without reloading or navigating away
        if (!blog_id && window.history && window.history.replaceState) {
          window.history.replaceState(null, "", `/editor/${savedId}`);
        }
      }

      const now = new Date();
      setLastSavedTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
      setAutosaveStatus("saved");
    } catch (err) {
      console.error("Autosave background error:", err);
      setAutosaveStatus("offline");
    } finally {
      isSavingRef.current = false;
    }
  };

  // ── Autosave Interval (every 2 minutes) ─────
  useEffect(() => {
    // 2 minutes = 120,000 milliseconds
    const AUTOSAVE_INTERVAL_MS = 120000;
    const timer = setInterval(() => {
      performAutosave();
    }, AUTOSAVE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [access_token]);

  // ── Prevent accidental tab/browser close ───
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const currentBlog = blogStateRef.current || {};
      if (currentBlog.title || currentBlog.banner) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleBannerUpload = (e) => {
    const img = e.target.files[0];

    if (img) {
      const loadingToast = toast.loading("Uploading...");

      uploadImage(img, access_token)
        .then((url) => {
          toast.dismiss(loadingToast);
          if (url) {
            toast.success("Uploaded 🎉");
            setBlog((current) => ({ ...current, banner: url }));
          } else {
            toast.error("Image upload failed");
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err?.message || "Failed to upload image");
        });
    }
  };

  const acceptGhostTitle = () => {
    if (!hasGhostSuffix) return;

    setBlog((current) => ({
      ...current,
      title: `${title}${ghostSuffix}`,
    }));
    setGhostTitle("");
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Tab") {
      if (hasGhostSuffix) {
        e.preventDefault();
        acceptGhostTitle();
      }
      return;
    }

    if (e.key === "Enter") {
      if (canRunSlash) {
        e.preventDefault();
        handleSlashClick();
        return;
      }

      if (hasGhostSuffix) {
        e.preventDefault();
        acceptGhostTitle();
        return;
      }
    }

    if (e.key === "ArrowRight") {
      if (hasGhostSuffix) {
        e.preventDefault();
        acceptGhostTitle();
      }
    }
  };

  const handleTitleChange = (e) => {
    const input = e.target;
    setBlog((current) => ({ ...current, title: input.value }));
  };

  const handleError = (e) => {
    const img = e.target;
    img.src = theme == "light" ? lightBanner : darkBanner;
  };

  const handlePublishEvent = () => {
    if (!banner.length) {
      return toast.error("Upload a blog banner to publish it.");
    }

    if (!title.trim().length) {
      return toast.error("Write blog title to publish it.");
    }

    const editor = editorInstanceRef.current || textEditor;

    if (editor && typeof editor.save === "function") {
      editor
        .save()
        .then((data) => {
          if (data && data.blocks && data.blocks.length) {
            setBlog((current) => ({ ...current, content: data }));
            setEditorState("publish");
          } else {
            return toast.error("Write something in your blog to publish it");
          }
        })
        .catch((err) => {
          console.error("Editor save error on publish:", err);
          toast.error("Failed to save editor content");
        });
    } else {
      toast.error("Editor is not ready yet");
    }
  };

  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!title.trim().length) {
      return toast.error("Write blog title before saving it as draft");
    }

    const loadingToast = toast.loading("Saving draft ......");
    e.target.classList.add("disable");

    const editor = editorInstanceRef.current || textEditor;

    if (editor && typeof editor.save === "function") {
      editor
        .save()
        .then((content) => {
          const blogObj = {
            title,
            banner,
            des,
            content,
            tags,
            draft: true,
          };

          axios
            .post(
              import.meta.env.VITE_SERVER_DOMAIN + "/blog/create-blog",
              { ...blogObj, id: activeBlogIdRef.current || blog_id },
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              },
            )
            .then(({ data }) => {
              if (data && data.id) {
                activeBlogIdRef.current = data.id;
                setBlog((current) => ({
                  ...current,
                  blog_id: data.id,
                  content,
                }));
                if (!blog_id && window.history && window.history.replaceState) {
                  window.history.replaceState(null, "", `/editor/${data.id}`);
                }
              }
              e.target.classList.remove("disable");
              toast.dismiss(loadingToast);
              toast.success("Saved 👍");
              setTimeout(() => {
                navigate("/dashboard/blogs?tab=draft");
              }, 500);
            })
            .catch(({ response }) => {
              e.target.classList.remove("disable");
              toast.dismiss(loadingToast);
              toast.error(response?.data?.error || "Failed to save draft");
            });
        })
        .catch((err) => {
          e.target.classList.remove("disable");
          toast.dismiss(loadingToast);
          toast.error("Failed to capture editor content");
        });
    } else {
      e.target.classList.remove("disable");
      toast.dismiss(loadingToast);
      toast.error("Editor is not ready");
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img
            src={theme == "light" ? darkLogo : lightLogo}
            alt=""
            className="w-full"
          />
        </Link>

        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex items-center gap-4 ml-auto">
          {/* Subtle Autosave Indicator */}
          {autosaveStatus === "saving" && (
            <span className="text-xs text-dark-grey flex items-center gap-1.5 animate-pulse whitespace-nowrap max-sm:hidden">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Autosaving...
            </span>
          )}
          {autosaveStatus === "saved" && lastSavedTime && (
            <span className="text-xs text-dark-grey/80 flex items-center gap-1 whitespace-nowrap max-sm:hidden">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Autosaved at {lastSavedTime}
            </span>
          )}
          {autosaveStatus === "offline" && (
            <span className="text-xs text-amber-600 flex items-center gap-1 whitespace-nowrap max-sm:hidden">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Saved locally
            </span>
          )}

          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  src={banner}
                  onError={handleError}
                  alt=""
                  className="z-20"
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <div className="relative mt-10">
              <div className="pointer-events-none absolute inset-0 z-20 whitespace-pre-wrap break-words text-4xl font-medium leading-tight">
                <span className="text-4xl font-medium leading-tight text-black">
                  {title}
                </span>
                {hasGhostSuffix ? (
                  <span className="text-4xl font-medium leading-tight text-dark-grey/80">
                    {ghostSuffix}
                  </span>
                ) : null}
              </div>

              <textarea
                ref={titleInputRef}
                value={title}
                placeholder="Blog Text"
                className="relative z-10 text-4xl font-medium w-full min-h-[80px] outline-none resize-none leading-tight placeholder:opacity-40 bg-white text-transparent caret-black overflow-hidden"
                onKeyDown={handleTitleKeyDown}
                onChange={handleTitleChange}
                rows={1}
                spellCheck={false}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  copilotOn ? "bg-black text-white" : "bg-grey text-black"
                }`}
                onClick={() => setCopilotOn((current) => !current)}
              >
                Copilot {copilotOn ? "ON" : "OFF"}
              </button>

              {trimmedTitle.startsWith("/write ") ? (
                <p className="text-xs text-dark-grey/70">
                  Press <span className="font-medium">Enter</span> to generate
                </p>
              ) : null}

              <button
                type="button"
                className="rounded-full bg-grey px-4 py-2 text-sm font-medium"
                onClick={handleSuggestClick}
                disabled={busy}
              >
                ✨ suggestions
              </button>

              <div className="relative">
                <button
                  onClick={() => setModelOpen((prev) => !prev)}
                  className="rounded-full bg-grey px-4 py-2 text-sm font-medium flex items-center gap-2"
                >
                  🧠 {aiModel?.name || "Select Model"}
                  <i className="fi fi-rr-angle-small-down"></i>
                </button>

                {modelOpen && (
                  <div className="absolute mt-2 w-64 bg-white rounded-xl shadow-lg border border-grey max-h-80 overflow-y-auto slick-scrollbar z-50">
                    {AI_MODELS.map((m, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setAiModel(m);
                          setModelOpen(false);
                        }}
                        className="px-4 py-3 hover:bg-grey cursor-pointer"
                      >
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-dark-grey">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {suggestOpen && suggestions.length ? (
              <div className="mt-3 w-full max-w-[700px] rounded-2xl border border-grey bg-white p-3 shadow-sm">
                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className="block w-full rounded-xl px-4 py-3 text-left hover:bg-grey"
                    onClick={() => applyTitle(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}

export default BlogEditor;
