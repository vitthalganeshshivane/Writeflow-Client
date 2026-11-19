import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { ThemeContext, userContext } from "../App";
import fullDarkLogo from "../imgs/full-logo-dark.png";
import fullLightLogo from "../imgs/full-logo-light.png";

const LandingPage = () => {
  const { theme } = useContext(ThemeContext);
  const { userAuth } = useContext(userContext) || {};
  const isLoggedIn = Boolean(userAuth?.access_token);

  const pillars = [
    {
      index: "01",
      title: "The Distraction-Free Studio",
      subtitle: "A block-based canvas tuned for pure thought",
      desc: "Writeflow's editor strips away the clutter of modern word processors. Every heading, quote, list, and code block snaps naturally into place. With native YouTube video embeds, cloud media uploads, and silent background autosave, your flow remains sacred and protected.",
      icon: "fi-rr-pencil",
      tag: "Block Canvas & Autosave",
    },
    {
      index: "02",
      title: "The Chronicle & Series Engine",
      subtitle: "Turn standalone essays into serialized journeys",
      desc: "Deep knowledge rarely fits in a single post. Writeflow lets you organize related writings into structured playlists and episodic chapters. Readers follow chronological tracks with dedicated next-and-previous navigation and can bookmark entire series into their personal libraries.",
      icon: "fi-rr-collection",
      tag: "Episodic Reading",
    },
    {
      index: "03",
      title: "The AI Muse",
      subtitle: "Context-aware title crafting powered by modern LLMs",
      desc: "When the prose is complete but the title remains out of reach, Writeflow AI analyzes your manuscript. Seamlessly switching between Groq and Gemini intelligence, it illuminates compelling headline angles without compromising your authorial voice.",
      icon: "fi-rr-sparkles",
      tag: "Groq & Gemini AI",
    },
    {
      index: "04",
      title: "Fleeting Reflections on Threads",
      subtitle: "Micro-blogging for the moments between deep dives",
      desc: "Not every spark warrants a 3,000-word treatise. Writeflow Threads gives you an immediate stage for spontaneous observations, community questions, media snippets, and dialogue—fostering connection before your next major publication.",
      icon: "fi-rr-comment-alt",
      tag: "Micro-Blogging",
    },
    {
      index: "05",
      title: "Editorial Distinction: The Featured Star",
      subtitle: "Celebrating depth in an era of digital noise",
      desc: "Our platform honors craft over sensationalism. Standout analytical essays and heartfelt stories receive the golden Featured badge, welcoming readers into curated writing that leaves an enduring mark.",
      icon: "fi-sr-star",
      tag: "Editorial Curation",
    },
    {
      index: "06",
      title: "The Sanctuary of Pure Reading",
      subtitle: "Dynamic reading pacing, outlines, and dual themes",
      desc: "Every article automatically computes real reading times and weaves an interactive Table of Contents from your subheadings. Coupled with a tailor-crafted Dark Mode and smooth typography, readers read longer with zero eye strain.",
      icon: "fi-rr-book-open-cover",
      tag: "Reader Comfort",
    },
  ];

  const highlights = [
    {
      title: "2-Minute Background Autosave",
      desc: "Drafts save continuously in the background with automatic fallback titles and tag preservation so your work is never lost.",
      icon: "fi-rr-shield-check",
    },
    {
      title: "Threaded Multi-Level Discussions",
      desc: "Move beyond flat comments with nested replies that encourage civil, nuanced debate and community discourse.",
      icon: "fi-rr-comments",
    },
    {
      title: "14-Day Session Persistence",
      desc: "JWT-backed persistent authentication keeps you seamlessly logged in across browser sessions without surprise timeouts.",
      icon: "fi-rr-lock",
    },
    {
      title: "Cloud Media Pipeline",
      desc: "Direct-to-S3 high-resolution image uploads with responsive aspect ratios for banners and inline illustrations.",
      icon: "fi-rr-picture",
    },
    {
      title: "Transparent Readership Metrics",
      desc: "Track genuine reader engagement: exact read counts, likes, and parent discussions across all your stories.",
      icon: "fi-rr-stats",
    },
    {
      title: "Author Profiles & Social Ecosystem",
      desc: "A personalized creative home displaying your bio, published catalog, created series, and verified social channels.",
      icon: "fi-rr-user",
    },
  ];

  return (
    <AnimationWrapper>
      <div className="w-full pb-20">
        {/* ========================================================
            HERO SECTION: The Literary Manifesto
            ======================================================== */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center py-20 px-[5vw] border-b border-grey relative overflow-hidden">
          {/* Subtle Ambient Background Accents */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/5 dark:bg-purple/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

          <div className="max-w-[850px] mx-auto">
            {/* Top Minimal Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-grey border border-grey text-xs uppercase tracking-widest text-dark-grey font-semibold mb-8 select-none">
              <span className="w-2 h-2 rounded-full bg-purple animate-pulse"></span>
              <span>Where Ideas Find Their Flow</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-gelasio text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] font-normal mb-8 text-black">
              Words crafted for depth,
              <br />
              <span className="italic font-serif text-dark-grey">
                built for those who linger.
              </span>
            </h1>

            {/* Poetic Subtitle */}
            <p className="font-gelasio text-xl md:text-2xl text-dark-grey leading-relaxed max-w-[700px] mx-auto mb-10 font-light">
              Writeflow is a quiet sanctuary for long-form essays, serialized
              playbooks, and candid micro-thoughts. Free from clickbait,
              engineered for thoughtful discourse.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/stories"
                    className="btn-dark py-3.5 px-8 text-base rounded-full flex items-center gap-2 shadow-sm"
                  >
                    <span>Read Stories</span>
                    <i className="fi fi-rr-arrow-right text-xs"></i>
                  </Link>
                  <Link
                    to="/editor"
                    className="btn-light py-3.5 px-8 text-base rounded-full flex items-center gap-2"
                  >
                    <i className="fi fi-rr-file-edit text-sm"></i>
                    <span>Open Editor</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="btn-dark py-3.5 px-8 text-base rounded-full flex items-center gap-2 shadow-sm"
                  >
                    <span>Start Free</span>
                    <i className="fi fi-rr-arrow-right text-xs"></i>
                  </Link>
                  <Link
                    to="/signin"
                    className="btn-light py-3.5 px-8 text-base rounded-full flex items-center gap-2"
                  >
                    <i className="fi fi-rr-user text-xs"></i>
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/stories"
                    className="py-3.5 px-6 text-sm text-dark-grey hover:text-black transition-colors flex items-center gap-1.5"
                  >
                    <span>Explore Stories</span>
                    <i className="fi fi-rr-arrow-right text-xs"></i>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-14 pt-8 border-t border-grey text-xs text-dark-grey uppercase tracking-wider font-medium">
              <span className="flex items-center gap-1.5">
                <i className="fi fi-rr-check text-purple"></i> Block-Based Canvas
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fi fi-rr-check text-purple"></i> Series & Playlists
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fi fi-rr-check text-purple"></i> AI Title Studio
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fi fi-rr-check text-purple"></i> Zero Distractions
              </span>
            </div>

            {/* The Odyssey Poetic Invitation Button */}
            <div className="mt-8 flex justify-center">
              <Link
                to="/odyssey"
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-grey hover:bg-grey/80 border border-grey text-xs md:text-sm text-dark-grey hover:text-black transition-all shadow-sm"
              >
                <i className="fi fi-rr-compass text-purple group-hover:rotate-45 transition-transform duration-300"></i>
                <span className="font-gelasio italic text-base">The Odyssey</span>
                <span className="text-dark-grey/50">•</span>
                <span className="text-xs uppercase tracking-wider font-semibold">The Story Behind the Code</span>
                <i className="fi fi-rr-arrow-right text-[10px] text-purple"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            PHILOSOPHY: The Antidote to the Fast Web
            ======================================================== */}
        <section className="py-24 px-[5vw] md:px-[10vw] border-b border-grey">
          <div className="max-w-[800px] mx-auto text-center">
            <span className="text-xs uppercase font-semibold tracking-widest text-dark-grey block mb-3">
              The Philosophy
            </span>
            <h2 className="font-gelasio text-3xl md:text-5xl font-normal leading-snug mb-8 text-black">
              "We write not to fill empty feeds, but to clarify what it means to be human."
            </h2>
            <p className="font-gelasio text-lg md:text-xl text-dark-grey leading-relaxed font-light">
              The modern web is inundated with fleeting algorithms and vanishing
              attention spans. Writeflow was engineered as an intentional counterweight:
              a home where an argument can unfold across chapters, where a
              paragraph is given room to breathe, and where readers arrive
              hungry to understand rather than simply scroll.
            </p>

            <div className="mt-10">
              <Link
                to="/odyssey"
                className="inline-flex items-center gap-2 text-sm text-dark-grey hover:text-black border-b border-dark-grey/40 hover:border-black pb-0.5 transition-all font-light"
              >
                <span className="font-gelasio italic">Read the story behind the code</span>
                <i className="fi fi-rr-arrow-right text-xs"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            CORE PILLARS: Features Explained Poetically
            ======================================================== */}
        <section className="py-24 px-[5vw] md:px-[10vw] border-b border-grey">
          <div className="max-w-[1000px] mx-auto">
            <div className="mb-16">
              <span className="text-xs uppercase font-semibold tracking-widest text-dark-grey block mb-2">
                Engineered for Authors & Seekers
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-inter leading-tight">
                Everything you need to craft lasting work.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between border-t border-grey pt-8 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-2xl md:text-3xl text-dark-grey/40 group-hover:text-purple transition-colors">
                        {pillar.index}
                      </span>
                      <span className="btn-light py-1 px-3 text-xs rounded-full font-medium">
                        {pillar.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold font-inter text-black mb-2 group-hover:text-purple transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-sm font-semibold text-dark-grey uppercase tracking-wide mb-4">
                      {pillar.subtitle}
                    </p>
                    <p className="font-gelasio text-base md:text-lg text-dark-grey leading-relaxed font-light">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            TECHNICAL EXCELLENCE & DELIGHT
            ======================================================== */}
        <section className="py-24 px-[5vw] md:px-[10vw] bg-grey/30 border-b border-grey">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center max-w-[700px] mx-auto mb-16">
              <span className="text-xs uppercase font-semibold tracking-widest text-dark-grey block mb-2">
                Under the Hood
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-inter leading-tight mb-4">
                Refined mechanics, uncompromised craft.
              </h2>
              <p className="font-gelasio text-lg text-dark-grey font-light">
                Every detail in Writeflow serves the connection between writer
                and reader.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-grey hover:border-dark-grey/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-grey flex items-center justify-center text-black mb-4">
                      <i className={`fi ${item.icon} text-lg`}></i>
                    </div>
                    <h4 className="font-semibold text-lg text-black mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-dark-grey font-gelasio leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            THE WRITER'S INVITATION: Final Call to Action
            ======================================================== */}
        <section className="py-24 px-[5vw] md:px-[10vw] text-center">
          <div className="max-w-[750px] mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-purple text-white flex items-center justify-center mx-auto mb-6 shadow-sm">
              <i className="fi fi-rr-feather text-xl"></i>
            </div>

            <h2 className="font-gelasio text-4xl sm:text-5xl font-normal text-black mb-6 leading-tight">
              Your voice has a place here.
            </h2>
            <p className="font-gelasio text-xl text-dark-grey leading-relaxed font-light mb-10 max-w-[600px] mx-auto">
              Join thinkers, storytellers, engineers, and curious minds. Publish
              essays that outlive the news cycle.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/editor"
                    className="btn-dark py-3.5 px-8 text-base rounded-full"
                  >
                    Create New Story
                  </Link>
                  <Link
                    to="/stories"
                    className="btn-light py-3.5 px-8 text-base rounded-full"
                  >
                    Browse Stories
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="btn-dark py-3.5 px-8 text-base rounded-full flex items-center gap-2"
                  >
                    <span>Start Free</span>
                    <i className="fi fi-rr-arrow-right text-xs"></i>
                  </Link>
                  <Link
                    to="/signin"
                    className="btn-light py-3.5 px-8 text-base rounded-full flex items-center gap-2"
                  >
                    <i className="fi fi-rr-user text-xs"></i>
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/stories"
                    className="btn-light py-3.5 px-8 text-base rounded-full"
                  >
                    Browse Stories
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================
            MINIMAL CLEAN FOOTER
            ======================================================== */}
        <footer className="border-t border-grey py-12 px-[5vw] md:px-[10vw]">
          <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src={theme === "light" ? fullDarkLogo : fullLightLogo}
                alt="Writeflow"
                className="h-6 w-auto object-contain"
              />
              <span className="text-xs text-dark-grey">
                • Where ideas flow.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-dark-grey">
              <Link to="/stories" className="hover:text-black transition-colors">
                Stories
              </Link>
              <Link
                to="/odyssey"
                className="hover:text-black transition-colors text-purple font-medium flex items-center gap-1.5"
              >
                <i className="fi fi-rr-compass text-xs"></i>
                <span>The Odyssey</span>
              </Link>
              <Link to="/about" className="hover:text-black transition-colors">
                About
              </Link>
              <Link
                to={isLoggedIn ? "/dashboard/series" : "/signin"}
                className="hover:text-black transition-colors"
              >
                Series
              </Link>
              <Link
                to={isLoggedIn ? "/editor" : "/signin"}
                className="hover:text-black transition-colors"
              >
                Write
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </AnimationWrapper>
  );
};

export default LandingPage;
