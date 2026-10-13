/**
 * YouTube Embed Block Tool for Editor.js
 * Allows writers to embed YouTube videos via Toolbox or direct link paste,
 * and preview the video player inside the editor with optional captions.
 */

export const parseYouTubeUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  const clean = url.trim();

  // Match all standard YouTube patterns (watch, youtu.be, embed, shorts, v)
  const idMatch = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/i,
  );

  if (!idMatch || !idMatch[1]) return null;

  const videoId = idMatch[1];

  // Check for start time parameters like t=120, t=1m30s
  let startTime = "";
  const timeMatch = clean.match(/[?&]t=([0-9]+m)?([0-9]+s?|[0-9]+)/i);
  if (timeMatch) {
    let seconds = 0;
    if (timeMatch[1]) {
      seconds += parseInt(timeMatch[1], 10) * 60;
    }
    if (timeMatch[2]) {
      seconds += parseInt(timeMatch[2], 10);
    }
    if (seconds > 0) {
      startTime = `?start=${seconds}`;
    }
  }

  return {
    videoId,
    embedUrl: `https://www.youtube.com/embed/${videoId}${startTime}`,
    sourceUrl: clean,
  };
};

export default class YouTubeTool {
  static get toolbox() {
    return {
      title: "YouTube",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get pasteConfig() {
    return {
      patterns: {
        youtube:
          /(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/i,
      },
    };
  }

  constructor({ data, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      service: "youtube",
      source: data?.source || "",
      embed: data?.embed || "",
      caption: data?.caption || "",
      width: data?.width || 580,
      height: data?.height || 320,
    };

    // If initial data has source but no embed url, attempt parse
    if (!this.data.embed && this.data.source) {
      const parsed = parseYouTubeUrl(this.data.source);
      if (parsed) {
        this.data.embed = parsed.embedUrl;
      }
    }

    this.container = null;
  }

  render() {
    this.container = document.createElement("div");
    this.container.classList.add("youtube-embed-block");
    this.container.style.width = "100%";
    this.container.style.margin = "1rem 0";

    if (this.data.embed) {
      this.renderPlayer();
    } else {
      this.renderInput();
    }

    return this.container;
  }

  renderInput() {
    this.container.innerHTML = "";

    const card = document.createElement("div");
    card.style.cssText =
      "border: 1px dashed #cbd5e1; border-radius: 12px; padding: 1.25rem; background: rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 0.75rem;";

    const header = document.createElement("div");
    header.style.cssText = "display: flex; align-items: center; gap: 0.5rem;";
    header.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
      <span style="font-weight: 600; font-size: 0.95rem;">Embed YouTube Video</span>
    `;

    const inputRow = document.createElement("div");
    inputRow.style.cssText = "display: flex; gap: 0.5rem; width: 100%;";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)";
    input.style.cssText =
      "flex: 1; padding: 0.6rem 0.9rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #ffffff; color: #1e293b;";

    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.innerText = "Embed";
    submitBtn.style.cssText =
      "padding: 0.6rem 1.2rem; background: #0f172a; color: #ffffff; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: opacity 0.2s;";

    const errorMsg = document.createElement("div");
    errorMsg.style.cssText =
      "color: #ef4444; font-size: 0.8rem; display: none; margin-top: 0.25rem;";
    errorMsg.innerText = "Please enter a valid YouTube video URL";

    const handleSubmit = () => {
      const url = input.value.trim();
      const parsed = parseYouTubeUrl(url);

      if (parsed) {
        errorMsg.style.display = "none";
        this.data.source = parsed.sourceUrl;
        this.data.embed = parsed.embedUrl;
        this.data.service = "youtube";
        this.renderPlayer();
      } else {
        errorMsg.style.display = "block";
      }
    };

    submitBtn.addEventListener("click", handleSubmit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    });

    inputRow.appendChild(input);
    inputRow.appendChild(submitBtn);

    card.appendChild(header);
    card.appendChild(inputRow);
    card.appendChild(errorMsg);

    this.container.appendChild(card);

    // Auto focus the input after mount
    setTimeout(() => {
      if (input && typeof input.focus === "function") {
        input.focus();
      }
    }, 50);
  }

  renderPlayer() {
    this.container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.style.cssText = "width: 100%; display: flex; flex-direction: column; gap: 0.5rem;";

    // Responsive 16:9 iframe container
    const videoBox = document.createElement("div");
    videoBox.style.cssText =
      "position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; background: #000; box-shadow: 0 4px 12px rgba(0,0,0,0.08);";

    const iframe = document.createElement("iframe");
    iframe.src = this.data.embed;
    iframe.style.cssText =
      "position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;";
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    );
    iframe.title = this.data.caption || "YouTube video player";

    videoBox.appendChild(iframe);
    wrapper.appendChild(videoBox);

    // Caption row
    const captionInput = document.createElement("input");
    captionInput.type = "text";
    captionInput.value = this.data.caption || "";
    captionInput.placeholder = "Write a caption for this video (optional)...";
    captionInput.disabled = Boolean(this.readOnly);
    captionInput.style.cssText =
      "width: 100%; text-align: center; font-size: 0.875rem; color: #64748b; font-style: italic; background: transparent; border: none; border-bottom: 1px dashed transparent; outline: none; padding: 0.35rem 0.5rem;";

    captionInput.addEventListener("input", (e) => {
      this.data.caption = e.target.value;
    });

    captionInput.addEventListener("focus", () => {
      captionInput.style.borderBottomColor = "#cbd5e1";
    });

    captionInput.addEventListener("blur", () => {
      captionInput.style.borderBottomColor = "transparent";
    });

    wrapper.appendChild(captionInput);

    // Options bar (Change URL)
    if (!this.readOnly) {
      const footer = document.createElement("div");
      footer.style.cssText = "display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: -0.25rem;";

      const changeBtn = document.createElement("button");
      changeBtn.type = "button";
      changeBtn.innerText = "Change video URL";
      changeBtn.style.cssText =
        "background: none; border: none; color: #64748b; font-size: 0.75rem; text-decoration: underline; cursor: pointer; padding: 0;";

      changeBtn.addEventListener("click", () => {
        this.renderInput();
      });

      footer.appendChild(changeBtn);
      wrapper.appendChild(footer);
    }

    this.container.appendChild(wrapper);
  }

  onPaste(event) {
    const { data: url } = event.detail;
    const parsed = parseYouTubeUrl(url);

    if (parsed) {
      this.data.source = parsed.sourceUrl;
      this.data.embed = parsed.embedUrl;
      this.data.service = "youtube";
      this.renderPlayer();
    }
  }

  save() {
    return {
      service: "youtube",
      source: this.data.source,
      embed: this.data.embed,
      caption: this.data.caption,
      width: this.data.width,
      height: this.data.height,
    };
  }

  validate(savedData) {
    return Boolean(savedData && (savedData.embed || savedData.source));
  }
}
