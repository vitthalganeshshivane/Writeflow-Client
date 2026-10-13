// import Embed from "@editorjs/embed";
// import List from "@editorjs/list";
// import Image from "@editorjs/image";
// import Header from "@editorjs/header";
// import Quote from "@editorjs/quote";
// import Marker from "@editorjs/marker";
// import InlineCode from "@editorjs/inline-code";
// import { uploadImage } from "../common/aws";

// const uploadImagebyURL = (e) => {
//   let link = new Promise((resolve, reject) => {
//     try {
//       resolve(e);
//     } catch (error) {
//       reject(error);
//     }
//   });

//   return link.then((url) => {
//     return {
//       success: 1,
//       file: { url },
//     };
//   });
// };

// const uploadImageByFile = (e) => {
//   return uploadImage(e)
//     .then((url) => {
//       if (url) {
//         return {
//           success: 1,
//           file: { url },
//         };
//       }
//     })
//     .catch((err) => {});
// };

// export const tools = {
//   embed: Embed,
//   list: {
//     class: List,
//     inlineToolbar: true,
//   },
//   image: {
//     class: Image,
//     config: {
//       uploader: {
//         uploadByUrl: uploadImagebyURL,
//         uploadByFile: uploadImageByFile,
//       },
//     },
//   },
//   header: {
//     class: Header,
//     inlineToolbar: true,
//     config: {
//       placeholder: "Type heading.....",
//       levels: [1, 2, 3, 4, 5, 6],
//       defaultLevel: 2,
//     },
//   },
//   quote: {
//     class: Quote,
//     inlineToolbar: true,
//   },
//   marker: Marker,
//   inlineCode: InlineCode,
// };

import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Code from "@editorjs/code"; // npm install @editorjs/code
import Table from "@editorjs/table"; // npm install @editorjs/table
import Delimiter from "@editorjs/delimiter"; // npm install @editorjs/delimiter
import Warning from "@editorjs/warning"; // npm install @editorjs/warning
import { uploadImage } from "../common/aws";
import { lookInSession } from "../common/session";

import YouTubeTool from "./youtube-embed.tool.js";

const uploadImagebyURL = (e) => {
  return new Promise((resolve) => resolve(e)).then((url) => ({
    success: 1,
    file: { url },
  }));
};

const uploadImageByFile = (e) => {
  const user = JSON.parse(lookInSession("user") || "{}");
  return uploadImage(e, user.access_token)
    .then((url) => {
      if (url) return { success: 1, file: { url } };
      return { success: 0 };
    })
    .catch((err) => {
      console.error("[ImageUpload] Failed:", err);
      return { success: 0 };
    });
};

export const tools = {
  // ── Video & Embed tools ─────────────────────
  youtube: YouTubeTool,
  embed: YouTubeTool,

  list: {
    class: List,
    inlineToolbar: true,
  },

  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImagebyURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },

  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: "Type heading.....",
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 2,
    },
  },

  quote: {
    class: Quote,
    inlineToolbar: true,
  },

  marker: Marker,

  inlineCode: InlineCode,

  // ── New tools ───────────────────────────────
  code: {
    class: Code,
    config: {
      placeholder: "Enter your code here...",
    },
  },

  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
      withHeadings: true,
    },
  },

  delimiter: Delimiter,

  warning: {
    class: Warning,
    inlineToolbar: true,
    config: {
      titlePlaceholder: "Warning title",
      messagePlaceholder: "Warning message...",
    },
  },
};
