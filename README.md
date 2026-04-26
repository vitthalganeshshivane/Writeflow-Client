<div align="center">

<img src="src/imgs/logo-dark.png" alt="Writeflow" width="64" />

# Writeflow

**Where ideas flow.**

A modern, full-featured blogging platform built for writers who care about craft.

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-4.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Editor.js](https://img.shields.io/badge/Editor.js-2.27-000000?style=flat-square)](https://editorjs.io)
[![Firebase](https://img.shields.io/badge/Firebase-10.1-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.13-FF0055?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

</div>

<br />

> Writeflow is a sleek, Medium-inspired publishing platform with a block-based editor, real-time interactions, and full dark mode — designed and engineered as a production-grade SPA.

---

## ✦ Highlights

<table>
<tr>
<td width="50%">

### 🖊️ Block Editor
Powered by **Editor.js** — headers, quotes, images, embeds, lists, inline code, and markers. Drag-and-drop image uploads via **AWS S3** presigned URLs.

</td>
<td width="50%">

### 🌗 Adaptive Theming
Dual-theme system (light/dark) with system-preference detection, session persistence, and semantic color tokens via `tw-colors`.

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Auth System
Email/password + **Google OAuth** (Firebase). JWT session management with protected routes and role-based admin gating.

</td>
<td width="50%">

### 💬 Nested Comments
Threaded comment system with infinite nesting, reply chains, lazy-loaded pagination, and real-time count updates.

</td>
</tr>
<tr>
<td width="50%">

### 📊 Author Dashboard
Manage published blogs and drafts with search, pagination, and inline stats. Edit, delete, or republish from a single view.

</td>
<td width="50%">

### 🔔 Notification Center
Filterable notifications for likes, comments, and replies — with unread indicators and paginated history.

</td>
</tr>
</table>

---

## ◈ Architecture

```
src/
├── App.jsx                  # Root – routing, context providers, theme init
├── main.jsx                 # Entry point
│
├── pages/                   # Route-level views
│   ├── home.page            # Feed – latest + trending + category filters
│   ├── blog.page            # Full article reader with similar posts
│   ├── editor.pages         # Editor context + state machine (editor ↔ publish)
│   ├── search.page          # Search results – blogs + users
│   ├── profile.page         # Public author profile with posts
│   ├── edit-profile.page    # Profile editor – avatar, bio, social links
│   ├── change-password.page # Password update form
│   ├── manage-blogs.page    # Dashboard – published vs drafts
│   ├── notifications.page   # Notification feed with filters
│   ├── userAuthForm.page    # Sign in / Sign up with Google OAuth
│   └── 404.page             # Custom not-found with themed illustrations
│
├── components/              # Reusable UI
│   ├── navbar               # Responsive nav – search, theme toggle, auth state
│   ├── sidenavbar           # Dashboard sidebar with active route tracking
│   ├── blog-editor          # Editor.js integration + banner upload
│   ├── publish-form         # Pre-publish – title, description, tags, preview
│   ├── blog-post            # Blog card – banner, meta, author
│   ├── blog-content         # Block renderer (header, image, list, quote, code)
│   ├── blog-interaction     # Like / comment / share / edit controls
│   ├── comments             # Comment container + lazy pagination
│   ├── comment-card         # Recursive threaded comment with actions
│   ├── comment-field        # Comment input with auth guard
│   ├── notification-card    # Notification row – type-aware rendering
│   ├── manage-blogcard      # Published + draft blog management cards
│   ├── inpage-navigation    # Tabbed in-page nav with underline indicator
│   ├── tags                 # Removable tag chips
│   ├── input                # Styled input with icon slot
│   ├── loader               # Animated loading spinner
│   ├── load-more            # Pagination trigger button
│   ├── nodata               # Empty state message
│   ├── usercard             # Compact user card for search results
│   └── user-navigation      # Dropdown menu – profile, dashboard, settings
│
├── common/                  # Shared utilities
│   ├── firebase             # Firebase init + Google auth provider
│   ├── aws                  # S3 presigned URL image upload
│   ├── session              # Session storage helpers
│   ├── page-animation       # Framer Motion page transition wrapper
│   ├── filter-pagination-data  # Pagination state accumulator
│   └── date                 # Date formatting
│
└── imgs/                    # Static assets – logos, banners, placeholders
```

---

## ◈ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Framework** | React 18 | Component architecture, hooks, context API |
| **Build** | Vite 4 | Dev server, HMR, optimized production builds |
| **Styling** | Tailwind CSS 3 + `tw-colors` | Utility-first CSS with semantic theme tokens |
| **Typography** | Inter + Gelasio | UI type (Inter) and editorial content (Gelasio) |
| **Editor** | Editor.js | Block-based content authoring |
| **Animations** | Framer Motion | Page transitions, staggered list reveals |
| **Auth** | Firebase Auth | Google OAuth sign-in |
| **HTTP** | Axios | API communication |
| **Storage** | AWS S3 | Image hosting via presigned URLs |
| **Routing** | React Router v6 | Nested routes, layout outlets, URL params |
| **Notifications** | React Hot Toast | Non-blocking success/error feedback |
| **Icons** | Flaticon UIcons | Consistent iconography |
| **Deployment** | Vercel | SPA hosting with client-side routing rewrites |

---

## ◈ Core Flows

### Publishing Pipeline

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Blog Editor │────▶│  Publish Form    │────▶│  POST /create-blog│
│  (Editor.js) │     │  title, desc,    │     │  with JWT auth    │
│  + S3 upload │     │  tags, preview   │     │                   │
└─────────────┘     └──────────────────┘     └──────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Save Draft  │
                    └──────────────┘
```

### Theme Resolution

```
Session Storage → System Preference → Default (light)
         ↓               ↓                  ↓
    data-theme     matchMedia query     fallback
```

---

## ◈ Getting Started

```bash
# Clone
git clone https://github.com/your-username/writeflow-client.git
cd writeflow-client

# Install
npm install

# Configure environment
cp .env.example .env
# Fill in: VITE_SERVER_DOMAIN, Firebase keys, AWS config

# Run
npm run dev
```

### Environment Variables

```env
VITE_SERVER_DOMAIN=           # Backend API base URL
VITE_FIREBASE_API_KEY=        # Firebase project credentials
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

---

## ◈ Key Design Decisions

- **Context over Redux** — `userContext` and `ThemeContext` keep auth and theme state lightweight without external state libraries
- **Editor.js over rich-text** — Block-based editing produces structured JSON, enabling clean server-side rendering and content portability
- **Framer Motion page transitions** — Every route change fades in with `AnimationWrapper`, eliminating jarring page loads
- **`tw-colors` semantic theming** — Color tokens (`white`, `black`, `grey`) remap per theme via `data-theme` attribute, avoiding conditional class logic
- **Presigned S3 uploads** — Images upload directly from browser to S3 — zero backend file handling, instant URLs

---

<div align="center">
<br />

**Writeflow** — Crafted with intent.

<sub>Built with React · Styled with Tailwind · Powered by Editor.js</sub>

</div>
