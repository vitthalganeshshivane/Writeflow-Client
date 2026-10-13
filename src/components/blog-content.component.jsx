// const Img = ({ url, caption }) => {
//   return (
//     <div>
//       <img src={url} alt="" />

//       {caption.length ? (
//         <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">
//           {caption}
//         </p>
//       ) : (
//         " "
//       )}
//     </div>
//   );
// };

// const Quote = ({ quote, caption }) => {
//   return (
//     <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
//       <p>{quote}</p>
//       {caption.length ? (
//         <p className="w-full text-purple text-base">{caption}</p>
//       ) : (
//         ""
//       )}
//     </div>
//   );
// };

// const List = ({ style, items }) => {
//   return (
//     <ol
//       className={`pl-5 ${style == "ordered" ? " list-decimal" : "list-disc"}`}
//     >
//       {items.map((listItem, i) => {
//         return (
//           <li
//             key={i}
//             className="my-4"
//             dangerouslySetInnerHTML={{ __html: listItem }}
//           ></li>
//         );
//       })}
//     </ol>
//   );
// };

// const BlogContent = ({ block }) => {
//   let { type, data } = block;

//   if (type == "paragraph") {
//     return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
//   }

//   //   if (type == "header") {
//   //     if (data.level == 3) {
//   //       return (
//   //         <h3
//   //           className="text-3xl font-bold"
//   //           dangerouslySetInnerHTML={{ __html: data.text }}
//   //         ></h3>
//   //       );
//   //     }
//   //   }

//   if (type === "header") {
//     switch (data.level) {
//       case 1:
//         return (
//           <h1
//             className="text-5xl font-extrabold leading-tight"
//             dangerouslySetInnerHTML={{ __html: data.text }}
//           ></h1>
//         );

//       case 2:
//         return (
//           <h2
//             className="text-4xl font-bold leading-snug"
//             dangerouslySetInnerHTML={{ __html: data.text }}
//           ></h2>
//         );

//       case 3:
//         return (
//           <h3
//             className="text-3xl font-bold"
//             dangerouslySetInnerHTML={{ __html: data.text }}
//           ></h3>
//         );

//       case 4:
//         return (
//           <h4
//             className="text-2xl font-semibold"
//             dangerouslySetInnerHTML={{ __html: data.text }}
//           ></h4>
//         );

//       case 5:
//         return (
//           <h5
//             className="text-xl font-medium"
//             dangerouslySetInnerHTML={{ __html: data.text }}
//           ></h5>
//         );

//       case 6:
//         return (
//           <h6
//             className="text-lg font-normal"
//             dangerouslySetInnerHTML={{ __html: data.text }}
//           ></h6>
//         );

//       default:
//         return (
//           <h3
//             className="text-2xl font-bold"
//             dangerouslySetInnerHTML={{ __html: data.text }}
//           ></h3>
//         );
//     }
//   }

//   if (type == "image") {
//     return <Img url={data.file.url} caption={data.caption} />;
//   }

//   if (type == "quote") {
//     return <Quote quote={data.text} caption={data.caption} />;
//   }

//   if (type == "list") {
//     return (
//       <List style={data.style} items={data.items} caption={data.caption} />
//     );
//   }
// };

// export default BlogContent;

// blog-content.component.jsx
// Run: npm install highlight.js
// highlight.js is used for code syntax highlighting

import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // swap to any hljs theme you prefer

/* ─────────────────────────────────────────────
   IMAGE — lazy-load + lightbox on click
───────────────────────────────────────────── */
const Img = ({ url, caption }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Lightbox overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white text-3xl leading-none hover:text-grey transition"
              aria-label="Close lightbox"
            >
              &times;
            </button>
            <img
              src={url}
              alt={caption || ""}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            {caption && (
              <p className="text-center text-grey text-sm mt-3">{caption}</p>
            )}
          </div>
        </div>
      )}

      {/* Image itself */}
      <div className="group relative">
        <img
          src={url}
          alt={caption || ""}
          loading="lazy"
          onClick={() => setOpen(true)}
          className="w-full rounded-lg cursor-zoom-in transition-opacity duration-300 hover:opacity-90"
        />
        {/* Zoom hint */}
        <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
          🔍 Click to enlarge
        </span>
        {caption?.length > 0 && (
          <p className="w-full text-center my-3 md:mb-8 text-base text-dark-grey italic">
            {caption}
          </p>
        )}
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   QUOTE
───────────────────────────────────────────── */
const Quote = ({ quote, caption }) => (
  <div className="bg-purple/10 p-4 pl-5 border-l-4 border-purple rounded-r-lg my-6">
    <p
      className="text-xl font-medium leading-relaxed"
      dangerouslySetInnerHTML={{ __html: quote }}
    />
    {caption?.length > 0 && (
      <p className="w-full text-purple text-sm mt-2 font-medium">— {caption}</p>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   LIST
───────────────────────────────────────────── */
const List = ({ style, items }) => (
  <ol
    className={`pl-5 space-y-2 ${style === "ordered" ? "list-decimal" : "list-disc"}`}
  >
    {items.map((listItem, i) => (
      <li
        key={i}
        className="my-2 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: listItem }}
      />
    ))}
  </ol>
);

/* ─────────────────────────────────────────────
   CODE BLOCK — syntax highlight + copy button
───────────────────────────────────────────── */
const CodeBlock = ({ code, language }) => {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      // Prevent double-highlighting on re-renders
      delete codeRef.current.dataset.highlighted;
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lang = language || "plaintext";

  return (
    <div className="relative group rounded-lg overflow-hidden border border-grey/20 my-6">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#161b22] px-4 py-2">
        <span className="text-xs text-grey font-mono uppercase tracking-widest opacity-60">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-grey hover:text-white transition-colors flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1 rounded"
        >
          {copied ? (
            <>✓ Copied</>
          ) : (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre className="overflow-x-auto text-sm leading-relaxed !rounded-none !rounded-b-lg !m-0">
        <code ref={codeRef} className={`language-${lang}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DIVIDER / HR
───────────────────────────────────────────── */
const Divider = () => (
  <div className="flex items-center gap-4 my-10 text-dark-grey/30">
    <div className="flex-1 h-px bg-grey/30" />
    <span className="text-lg tracking-widest">• • •</span>
    <div className="flex-1 h-px bg-grey/30" />
  </div>
);

/* ─────────────────────────────────────────────
   TABLE
───────────────────────────────────────────── */
const Table = ({ content, withHeadings }) => {
  if (!content || content.length === 0) return null;

  const rows = withHeadings ? content.slice(1) : content;
  const headers = withHeadings ? content[0] : null;

  return (
    <div className="overflow-x-auto my-6 rounded-lg border border-grey/20">
      <table className="w-full text-sm">
        {headers && (
          <thead>
            <tr className="bg-grey/10 border-b border-grey/20">
              {headers.map((cell, i) => (
                <th
                  key={i}
                  className="text-left px-4 py-3 font-semibold text-dark-grey"
                  dangerouslySetInnerHTML={{ __html: cell }}
                />
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-grey/10 hover:bg-grey/5 transition-colors last:border-0"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-3 text-dark-grey"
                  dangerouslySetInnerHTML={{ __html: cell }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ─────────────────────────────────────────────
   WARNING / CALLOUT BLOCK
───────────────────────────────────────────── */
const WARNING_STYLES = {
  warning: {
    wrapper: "bg-yellow-50 border-yellow-400 text-yellow-900",
    icon: "⚠️",
    label: "Warning",
  },
  danger: {
    wrapper: "bg-red-50 border-red-400 text-red-900",
    icon: "🚨",
    label: "Danger",
  },
  info: {
    wrapper: "bg-blue-50 border-blue-400 text-blue-900",
    icon: "ℹ️",
    label: "Info",
  },
  success: {
    wrapper: "bg-green-50 border-green-400 text-green-900",
    icon: "✅",
    label: "Success",
  },
  note: {
    wrapper: "bg-grey/10 border-dark-grey/30 text-dark-grey",
    icon: "📝",
    label: "Note",
  },
};

const Callout = ({ title, message, type = "warning" }) => {
  const style = WARNING_STYLES[type] || WARNING_STYLES.warning;
  return (
    <div
      className={`flex gap-3 border-l-4 rounded-r-lg p-4 my-6 ${style.wrapper}`}
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{style.icon}</span>
      <div>
        {title && (
          <p className="font-semibold text-sm uppercase tracking-wide mb-1">
            {title || style.label}
          </p>
        )}
        <p
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   EMBED — YouTube, Twitter / X, CodePen
───────────────────────────────────────────── */
const Embed = ({ service, source, embed, caption, width, height }) => {
  // Normalise embed URL
  const getEmbedUrl = () => {
    // Use the already-resolved embed URL if editor provided one
    if (embed) return embed;

    if (!source) return null;

    // YouTube
    const ytMatch = source.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/i,
    );
    if (ytMatch) {
      let startTime = "";
      const timeMatch = source.match(/[?&]t=([0-9]+m)?([0-9]+s?|[0-9]+)/i);
      if (timeMatch) {
        let seconds = 0;
        if (timeMatch[1]) seconds += parseInt(timeMatch[1], 10) * 60;
        if (timeMatch[2]) seconds += parseInt(timeMatch[2], 10);
        if (seconds > 0) startTime = `?start=${seconds}`;
      }
      return `https://www.youtube.com/embed/${ytMatch[1]}${startTime}`;
    }

    // CodePen  — convert /pen/ → /embed/
    if (source.includes("codepen.io")) {
      return source.replace("/pen/", "/embed/") + "?default-tab=result";
    }

    return source;
  };

  const url = getEmbedUrl();
  if (!url) return null;

  // Twitter embed is a blockquote-based script embed, not an iframe
  if (
    service === "twitter" ||
    source?.includes("twitter.com") ||
    source?.includes("x.com")
  ) {
    return (
      <div className="flex justify-center my-6">
        <blockquote className="twitter-tweet" data-theme="light">
          <a href={source}>{source}</a>
        </blockquote>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        />
      </div>
    );
  }

  const aspectStyle =
    height && width
      ? { aspectRatio: `${width} / ${height}` }
      : { aspectRatio: "16 / 9" };

  return (
    <div className="my-6">
      <div
        className="rounded-lg overflow-hidden border border-grey/20"
        style={aspectStyle}
      >
        <iframe
          src={url}
          className="w-full h-full"
          loading="lazy"
          allowFullScreen
          title={caption || "Embedded content"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      {caption?.length > 0 && (
        <p className="text-center text-dark-grey text-sm mt-2 italic">
          {caption}
        </p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   RAW HTML — escape hatch for power users
   ⚠️  Only render if you trust the content source.
───────────────────────────────────────────── */
const RawHTML = ({ html }) => (
  <div
    className="my-6 overflow-x-auto"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

/* ─────────────────────────────────────────────
   HEADING — all levels
───────────────────────────────────────────── */
const Heading = ({ level, text }) => {
  const Tag = `h${level}`;
  const classes = {
    1: "text-5xl font-extrabold leading-tight mt-12 mb-4",
    2: "text-4xl font-bold leading-snug mt-10 mb-4",
    3: "text-3xl font-bold mt-8 mb-3",
    4: "text-2xl font-semibold mt-6 mb-2",
    5: "text-xl font-medium mt-4 mb-2",
    6: "text-lg font-normal mt-4 mb-1",
  };

  // Derive an anchor id from plain text (strip HTML tags)
  const plainText = text.replace(/<[^>]+>/g, "");
  const id = plainText
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <Tag
      id={id}
      className={classes[level] || classes[3]}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

/* ─────────────────────────────────────────────
   MAIN BlogContent dispatcher
───────────────────────────────────────────── */
const BlogContent = ({ block }) => {
  if (!block || !block.type) return null;

  const { type, data } = block;

  switch (type) {
    case "paragraph":
      return (
        <p
          className="leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      );

    case "header":
      return <Heading level={data.level} text={data.text} />;

    case "image":
      return <Img url={data.file?.url || data.url} caption={data.caption} />;

    case "quote":
      return <Quote quote={data.text} caption={data.caption} />;

    case "list":
      return <List style={data.style} items={data.items} />;

    case "code":
      return <CodeBlock code={data.code} language={data.language} />;

    case "delimiter":
      return <Divider />;

    case "table":
      return <Table content={data.content} withHeadings={data.withHeadings} />;

    case "warning":
      // EditorJS warning tool: { title, message }
      return (
        <Callout title={data.title} message={data.message} type="warning" />
      );

    case "callout":
      // Custom callout tool: { title, message, type }
      return (
        <Callout title={data.title} message={data.message} type={data.type} />
      );

    case "embed":
    case "youtube":
      return (
        <Embed
          service={data?.service || "youtube"}
          source={data?.source}
          embed={data?.embed}
          caption={data?.caption}
          width={data?.width}
          height={data?.height}
        />
      );

    case "raw":
    case "rawTool":
      return <RawHTML html={data.html} />;

    default:
      // Graceful fallback — don't crash on unknown block types
      if (import.meta.env.DEV) {
        console.warn(`[BlogContent] Unknown block type: "${type}"`, data);
      }
      return null;
  }
};

export default BlogContent;
