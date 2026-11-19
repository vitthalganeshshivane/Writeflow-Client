import React, { useState } from "react";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import toast from "react-hot-toast";

const OdysseyPage = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("vitthalganeshshivane@gmail.com");
    setCopiedEmail(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <AnimationWrapper>
      <main className="w-full min-h-screen py-10 md:py-16 px-5 sm:px-8">
        <article className="max-w-[760px] mx-auto text-black">
          {/* Top Breadcrumb */}
          <div className="mb-10 flex items-center justify-between text-sm text-dark-grey border-b border-grey/60 pb-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 hover:text-black transition-colors"
            >
              <i className="fi fi-rr-arrow-left text-xs"></i>
              <span>Back to Home</span>
            </Link>
            <span className="text-xs uppercase tracking-widest text-dark-grey/70 font-medium">
              The Genesis & Lore
            </span>
          </div>

          {/* Header */}
          <header className="mb-12">
            <h1 className="font-gelasio text-4xl sm:text-5xl md:text-[54px] font-normal leading-[1.18] text-black tracking-tight mb-5">
              Writeflow — The Story Behind the Code
            </h1>
            <p className="font-gelasio text-xl sm:text-2xl text-dark-grey font-light italic leading-relaxed mb-8">
              The journey of an idea that was never meant to be temporary.
            </p>

            {/* Author Row - Minimal, Clean, Elegant */}
            <div className="flex items-center justify-between py-4 border-y border-grey/60 text-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-grey border border-grey flex items-center justify-center font-gelasio font-medium text-black text-sm shrink-0">
                  VS
                </div>
                <div>
                  <p className="font-medium text-black leading-snug">
                    Vitthal Ganesh Shivane
                  </p>
                  <p className="text-xs text-dark-grey">
                    Creator & Architect • Latur → Nagpur → Pune*
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-dark-grey space-y-0.5">
                <p>Published • 2026</p>
                <p>⏱ 8 min read</p>
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div className="font-gelasio text-[18px] sm:text-[19px] md:text-[20px] leading-[1.85] text-black/90 font-light space-y-7">
            <p>
              Some projects begin with a problem to solve. Some begin with an
              idea waiting to be built. And some begin almost accidentally,
              disguised as an ordinary learning exercise, only to become
              something far more personal than you could have imagined.
            </p>

            <p className="font-normal text-black">
              Writeflow was one of those projects.
            </p>

            <p>
              To understand how it came to exist, I have to go back to a time
              when I was looking for something to build.
            </p>

            <p>
              It was around July 2025. I had left Amika Softwares, and I was at
              a point where I wanted to build something substantial—something
              that could demonstrate my abilities, strengthen my résumé, and give
              me an opportunity to explore the world of full-stack development
              more deeply.
            </p>

            <p>
              I was searching YouTube for a project worth investing my time in. I
              spent almost a week looking through different ideas, tutorials, and
              possibilities. I was rather ambiguous about what I actually wanted
              to create.
            </p>

            <p>
              But there was something I wasn't consciously looking for, something
              that had been a part of me for much longer.
            </p>

            <p>
              I had always been fond of reading. I used to read a lot, and the
              passion for writing had been with me since childhood. It was one of
              those things I carried quietly—something I loved deeply, but had
              never confessed or disclosed to anyone throughout my entire
              childhood and teenage years. It remained my private sanctuary,
              folded quietly away.
            </p>

            <p>
              I didn't know that this little, undisclosed part of my personality
              was about to influence one of the biggest personal projects of my
              life.
            </p>

            <p>Then, I found a playlist.</p>

            <p>
              It was a guided MERN-stack blogging website project, consisting of
              roughly 20–25 hours of tutorial videos. Nothing particularly
              extraordinary about it at first glance. Just another full-stack
              project tutorial on YouTube.
            </p>

            <p>But I remember the feeling I had when I found it.</p>

            <p>
              Somewhere in that very day, that very hour, perhaps even that very
              second, I had a thought:
            </p>

            <blockquote className="border-l-2 border-black dark:border-white pl-6 my-8 italic font-gelasio text-xl md:text-2xl text-black font-light leading-relaxed">
              "This is going to be something I keep. Something that will have
              longevity among my personal assets."
            </blockquote>

            <p>
              I didn't see it as just another project to complete, upload to
              GitHub, and mention on my résumé. I genuinely felt that this was
              something worth building, something I could continue developing
              long after the tutorial ended.
            </p>

            <p className="font-normal text-black">And so, I started.</p>

            {/* Section Divider */}
            <div className="text-center my-14 text-dark-grey text-lg tracking-[0.4em] select-none">
              * * *
            </div>

            {/* Headings styled classically */}
            <h2 className="font-gelasio text-2xl sm:text-3xl font-normal text-black pt-4 mb-4 leading-snug">
              The First Version — Learning to Build Something Real
            </h2>

            <p>
              The beginning was filled with curiosity, enthusiasm, and the usual
              uncertainty that comes with learning something new.
            </p>

            <p>
              I followed the playlist, understood the concepts, implemented the
              features, made mistakes, fixed them, and gradually started
              connecting all the pieces.
            </p>

            <p>
              It took me approximately three to four months to build the first
              basic, complete, and reasonably decent version of the application.
            </p>

            <p>
              It was a proper full-stack blogging platform. React on the
              frontend, Node.js and Express on the backend, MongoDB for the
              database, authentication, blog creation and editing, image uploads,
              user profiles, search, likes, notifications, comments, and several
              other features.
            </p>

            <p>
              There was a lot to learn, and there was even more to figure out.
            </p>

            <p className="font-normal text-black">
              But one feature, in particular, would teach me something that no
              ordinary tutorial could have taught me.
            </p>

            <p className="font-medium text-black">
              The comment and reply hierarchy.
            </p>

            <p>
              On the surface, comments and replies sound like a relatively
              straightforward feature. A user writes a comment, someone replies,
              and the application displays the conversation.
            </p>

            <p>
              But the moment you start implementing nested relationships, things
              become considerably more complicated.
            </p>

            <p>
              There were parent comments, child replies, references between
              documents, nested relationships, asynchronous loading, pagination,
              indexing, and frontend state updates. The React side had its own
              challenges involving state management, component rendering, and
              keeping the interface consistent with the underlying data.
            </p>

            <p>
              I found myself dealing with the entire interaction between these
              moving pieces—state mutation, recursive rendering, comment
              indexing, asynchronous pagination, and the relationship between
              frontend state and backend structures.
            </p>

            <p>
              I won't pretend that there was one magical line of code
              responsible for everything. It was the complexity of the feature as
              a whole that made it such a difficult chapter.
            </p>

            <p className="font-normal text-black">
              And that chapter lasted for more than three weeks.
            </p>

            <p>
              Three weeks of debugging. Three weeks of trying different
              approaches, questioning implementations, tracing unexpected
              behaviour, and repeatedly going back to the code.
            </p>

            <p>
              There were moments when I genuinely lost my patience. I snapped
              more than once. It was frustrating in a way that is difficult to
              explain unless you've spent hours debugging something that seems
              determined not to work.
            </p>

            <p>
              But looking back, this was probably one of the most valuable
              learning experiences of the entire project.
            </p>

            <p>
              Until then, I had been learning React largely from the perspective
              of using it—components, hooks, state, props, and all the things
              required to build an application.
            </p>

            <p className="font-normal text-black">
              This particular challenge pushed me to look beyond that.
            </p>

            <p>
              I started thinking more deeply about how React works, why certain
              things happen, why the framework behaves the way it does, and why
              its internal engineering decisions matter.
            </p>

            <p>
              It was almost an introduction to the sheer scale of modern software
              engineering.
            </p>

            <p>
              You begin with a simple requirement—display comments and
              replies—and suddenly find yourself appreciating the incredible
              amount of engineering hidden beneath the frameworks you use every
              day.
            </p>

            <p>
              React, Node.js, and the entire ecosystem started looking different
              to me. Fascinating, yes, but also slightly terrifying when you
              realise how much complexity exists behind the abstractions that
              make development feel simple.
            </p>

            <p>And then, finally, the problem was solved.</p>

            <p>I still remember how happy I was that day.</p>

            <blockquote className="border-l-2 border-black dark:border-white pl-6 my-8 italic font-gelasio text-xl md:text-2xl text-black font-light leading-relaxed">
              "I was happy as hell. After all those frustrating days, I could
              finally take a satisfactory breath."
            </blockquote>

            <p>
              It wasn't merely the satisfaction of fixing a bug. It was the
              feeling of having survived a problem that had tested my patience,
              challenged my understanding, and forced me to become a better
              developer.
            </p>

            <p>
              Sometimes, a single solved problem teaches you more than dozens of
              completed tutorials.
            </p>

            <p className="font-normal text-black">That was one of those times.</p>

            {/* Section Divider */}
            <div className="text-center my-14 text-dark-grey text-lg tracking-[0.4em] select-none">
              * * *
            </div>

            <h2 className="font-gelasio text-2xl sm:text-3xl font-normal text-black pt-4 mb-4 leading-snug">
              The First Deployment — It Was No Longer Just on My Machine
            </h2>

            <p>
              After completing the initial version and getting the application
              into a state I was satisfied with, it was time to deploy it.
            </p>

            <p>
              Around the last week of November or the first week of December
              2025, I deployed the backend on <strong>Render</strong> and the
              frontend on <strong>Vercel</strong>.
            </p>

            <p>
              And just like that, something that had started as a YouTube tutorial
              was accessible on the internet.
            </p>

            <p>
              It was no longer confined to my development environment. It had a
              frontend, a backend, a database, authentication, and an actual
              deployment architecture.
            </p>

            <p>
              There is something special about the first time you see your own
              application running as a live product.
            </p>

            <p>
              You know every component that went into it. You remember the
              errors, the broken implementations, the debugging sessions, the
              configurations, and all the little things that took much longer
              than expected.
            </p>

            <p>
              And now, all those pieces are working together somewhere beyond
              your local machine.
            </p>

            <p>That was an important milestone.</p>

            <p className="italic text-dark-grey">
              But it was not the end of the journey. In retrospect, it was
              barely the beginning.
            </p>

            {/* Section Divider */}
            <div className="text-center my-14 text-dark-grey text-lg tracking-[0.4em] select-none">
              * * *
            </div>

            <h2 className="font-gelasio text-2xl sm:text-3xl font-normal text-black pt-4 mb-4 leading-snug">
              The TypeScript Migration — From Making It Work to Making It Better
            </h2>

            <p>
              As I continued exploring the application, I began thinking more
              seriously about its backend architecture.
            </p>

            <p>
              The original backend was written in JavaScript. It had served its
              purpose well, and it was the foundation on which the initial
              application was built.
            </p>

            <p>But I wanted to take things further.</p>

            <p className="font-normal text-black">
              I decided to migrate the entire backend to TypeScript.
            </p>

            <p>
              Rather than simply modifying the existing repository and risking
              the loss of the original implementation, I created a separate
              repository for the TypeScript backend. The original JavaScript
              repository remained preserved as a reference and legacy
              implementation.
            </p>

            <p>
              This became one of the best decisions I made during the development
              of Writeflow.
            </p>

            <p>
              It was an opportunity to understand why TypeScript matters beyond
              its syntax and type annotations. I began appreciating the value of
              stronger contracts, predictable data structures, better
              maintainability, and the confidence that comes from having a more
              structured codebase.
            </p>

            <blockquote className="border-l-2 border-black dark:border-white pl-6 my-8 italic font-gelasio text-xl md:text-2xl text-black font-light leading-relaxed">
              "There is a difference between writing code that works today and
              building a codebase that you can confidently continue developing
              tomorrow."
            </blockquote>

            <p>That migration helped me understand the difference.</p>

            <p>
              The backend gradually grew into something much more structured.
              Authentication, OAuth, blog management, comments, notifications,
              user profiles, search, uploads, and other core services were
              brought into the TypeScript architecture.
            </p>

            <p>And then the scope started expanding.</p>

            {/* Section Divider */}
            <div className="text-center my-14 text-dark-grey text-lg tracking-[0.4em] select-none">
              * * *
            </div>

            <h2 className="font-gelasio text-2xl sm:text-3xl font-normal text-black pt-4 mb-4 leading-snug">
              Beyond Blogging — The Engineering Behind the Product
            </h2>

            <p>
              As the application matured, I became increasingly interested in the
              infrastructure supporting it.
            </p>

            <p>
              I started experimenting with Oracle Cloud and different deployment
              approaches. I wanted to explore DevOps, understand how production
              systems are operated, and learn how to manage the infrastructure
              behind an application.
            </p>

            <p>
              I realised that I could accomplish two things through the same
              effort.
            </p>

            <p>
              First, I could work on Writeflow's infrastructure and make its
              deployment architecture more independent and portable.
            </p>

            <p>
              Second, I could explore an entirely different area of engineering
              and develop my own practical skills.
            </p>

            <p>
              I wasn't trying to become a DevOps expert overnight. I simply
              wanted to understand the things I was working with rather than
              blindly depending on services and configurations I didn't fully
              understand.
            </p>

            <p>
              That exploration led me into Docker, separate API and worker
              processes, PM2, Nginx, multi-stage builds, environment
              configuration, and production deployment challenges.
            </p>

            <p>
              I even had to work around the limitations of a low-memory virtual
              machine, figuring out how to handle compilation and deployment
              without exhausting available resources.
            </p>

            <p>
              The objective was not just to make Writeflow run on one particular
              platform. I wanted to understand how to make its infrastructure
              adaptable enough that it could run on different cloud platforms or
              virtual machines.
            </p>

            <p>
              Around this period, I also explored Redis, rate limiting, connection
              handling, background jobs, and ways to make the application more
              resilient.
            </p>

            <p>
              Eventually, the backend developed a more mature architecture with
              separate API and email-worker processes, scheduled tasks, and
              queue-based operations.
            </p>

            <p>
              What had once been a straightforward Node.js server was becoming a
              considerably more sophisticated backend system.
            </p>

            <p className="font-normal text-black">
              And somewhere along the way, I realised that I was no longer merely
              learning how to build a full-stack application.
            </p>

            <p className="font-medium text-black">
              I was learning how to engineer and maintain a product.
            </p>

            {/* Section Divider */}
            <div className="text-center my-14 text-dark-grey text-lg tracking-[0.4em] select-none">
              * * *
            </div>

            <h2 className="font-gelasio text-2xl sm:text-3xl font-normal text-black pt-4 mb-4 leading-snug">
              Giving the Writing Experience More Intelligence
            </h2>

            <p>
              Another important chapter began when I started exploring AI
              integration.
            </p>

            <p>
              I wanted Writeflow to become more than a place where someone could
              simply publish an article. Writing itself could be a much richer
              experience.
            </p>

            <p>
              So I started working on an AI-powered writing assistant,
              introducing different ways to interact with AI inside the editor,
              including ghost writing, slash commands, and suggestion-based
              assistance.
            </p>

            <p>
              The backend evolved to support AI-powered title generation, with
              integrations exploring multiple providers such as Groq, Gemini, and
              NVIDIA.
            </p>

            <p>
              The idea was to make AI a useful companion to the writing process
              rather than an unnecessary addition to the interface.
            </p>

            <blockquote className="border-l-2 border-black dark:border-white pl-6 my-8 italic font-gelasio text-xl md:text-2xl text-black font-light leading-relaxed">
              "I wanted the technology to assist the writer without taking away
              the writer's ownership of the work."
            </blockquote>

            <p>
              The editor and reading experience continued to receive attention,
              too. I worked on improving the writing interface, adding editor
              capabilities, and making the overall reading experience more
              polished.
            </p>

            <p>
              Gradually, Writeflow was becoming more intentional about what it
              wanted to offer.
            </p>

            {/* Section Divider */}
            <div className="text-center my-14 text-dark-grey text-lg tracking-[0.4em] select-none">
              * * *
            </div>

            <h2 className="font-gelasio text-2xl sm:text-3xl font-normal text-black pt-4 mb-4 leading-snug">
              October 2026 — A Broader Vision
            </h2>

            <p>
              As the product continued evolving, the original idea of a blogging
              platform started expanding.
            </p>

            <p>
              I introduced a microblogging experience inspired by the idea of
              short-form conversations and posts, which eventually became{" "}
              <strong>Threads</strong>.
            </p>

            <p>
              This brought an entirely new set of backend and frontend
              requirements: posts, drafts, mentions, media, likes, and related
              interactions.
            </p>

            <p>
              I also worked on local session persistence and background
              autosaving, including a two-minute autosave mechanism designed to
              help protect a writer's work from accidental loss or unexpected
              interruptions.
            </p>

            <p>
              YouTube embeds became part of the editor and reading experience.
            </p>

            <p>
              The platform was no longer limited to long-form blogging. It was
              beginning to accommodate different forms of expression.
            </p>

            <p>
              There was also more attention given to the less visible parts of a
              product: reliability, authentication, error handling, server
              startup, background processing, and all the details that users
              might never consciously notice but would certainly feel if they
              were missing.
            </p>

            <p>
              That is one thing I have come to appreciate about software
              engineering.
            </p>

            <blockquote className="border-l-2 border-black dark:border-white pl-6 my-8 italic font-gelasio text-xl md:text-2xl text-black font-light leading-relaxed">
              "A product is not defined only by what users can see. A great deal
              of its quality comes from the decisions and engineering that
              remain invisible."
            </blockquote>

            {/* Section Divider */}
            <div className="text-center my-14 text-dark-grey text-lg tracking-[0.4em] select-none">
              * * *
            </div>

            <h2 className="font-gelasio text-2xl sm:text-3xl font-normal text-black pt-4 mb-4 leading-snug">
              November 2026 — The Product Keeps Growing
            </h2>

            <p>The latest phase has brought another set of additions.</p>

            <p>
              I started working on featured blog functionality, series and
              playlist management, and further refinements to the writing and
              reading experience.
            </p>

            <p>
              The idea of series and playlists is particularly interesting
              because it gives writers another way to organise their work and
              allows readers to experience related content as a connected
              journey.
            </p>

            <p>
              The interface also continued receiving attention: visual polish,
              animated featured badges, refined scrollbars, and a more complete
              landing page.
            </p>

            <p>
              I wanted the first impression of Writeflow to reflect the ambition
              behind the product.
            </p>

            <p>
              The landing page became the default entry point, with clearer calls
              to action such as Start Free and Login, alongside a more expressive
              presentation of what the platform was becoming.
            </p>

            <p className="font-normal text-black">And here we are.</p>

            <p>
              From a playlist of approximately twenty to twenty-five hours of
              tutorial videos to a full-stack application with a TypeScript
              backend, AI-assisted writing, background workers, infrastructure
              experimentation, microblogging, and a growing set of publishing
              features.
            </p>

            <p className="italic text-dark-grey">
              It is quite a journey when you stop and look at it.
            </p>

            {/* Section Divider */}
            <div className="text-center my-14 text-dark-grey text-lg tracking-[0.4em] select-none">
              * * *
            </div>

            <h2 className="font-gelasio text-3xl sm:text-4xl font-normal text-black pt-4 mb-4 leading-snug">
              What Writeflow Means to Me
            </h2>

            <p>
              If someone asks me what Writeflow is, I can explain it technically.
            </p>

            <p>
              I can talk about React, Node.js, TypeScript, MongoDB,
              authentication, APIs, AI integrations, Redis, background workers,
              Docker, deployment architecture, and all the features that have
              been built along the way.
            </p>

            <p className="font-normal text-black">
              But those things don't fully explain what this project means to me.
            </p>

            <p>
              Because Writeflow is also a record of my growth as a developer.
            </p>

            <p>
              It reminds me of the days when I was searching YouTube, uncertain
              about what to build. It reminds me of the excitement I felt when I
              found that playlist and somehow knew that I wanted to keep working
              on this project for a long time.
            </p>

            <p>
              It reminds me of those three frustrating weeks spent fighting with
              the comment hierarchy, the relief of finally solving it, and the
              satisfaction of seeing the first deployment go live.
            </p>

            <p>
              It reminds me of the decision to migrate the backend to TypeScript,
              the curiosity that pushed me into infrastructure and DevOps, and
              the countless small decisions that gradually shaped the product.
            </p>

            <p>
              But perhaps most importantly, it reminds me of something I had
              carried since childhood.
            </p>

            <p className="font-normal text-black">
              My love for reading and writing.
            </p>

            <p>
              I started this journey while looking for a project that would
              strengthen my résumé. I never imagined that it would eventually
              become a place where one of my oldest personal interests and one of
              my most important technical pursuits would meet.
            </p>

            <p>And that is probably why I feel so attached to it.</p>

            <p>
              I have watched it grow from a tutorial-based blogging application
              into something with its own direction, architecture, identity, and
              future.
            </p>

            <p>
              I know it is not perfect. There is still a tremendous amount to
              build, improve, rethink, and explore. I have plenty of plans for
              it, and I don't intend to stop here.
            </p>

            <p>
              In fact, I feel that the most interesting chapters are still ahead.
            </p>

            <p>I don't look at Writeflow as a project I completed.</p>

            <blockquote className="border-l-2 border-black dark:border-white pl-6 my-8 italic font-gelasio text-xl md:text-2xl text-black font-light leading-relaxed">
              "I look at it as something I started, something I continue to
              build, and something I want to keep with me for a very long
              time."
            </blockquote>

            <p>Perhaps that is what makes it special.</p>

            <p>
              It wasn't born from a grand business plan or some extraordinary
              technical invention. It began with a person searching for something
              meaningful to build, a YouTube playlist, a quiet passion for
              writing, and a thought that this might be worth keeping.
            </p>

            <p className="font-normal text-black">And that thought stayed.</p>

            <p>
              It survived the bugs, the frustration, the rewrites, the
              migrations, the deployments, and the endless cycle of discovering
              something new that could make the product better.
            </p>

            <p>
              The code has changed. The architecture has evolved. The features
              have multiplied. The vision has become larger.
            </p>

            <p className="font-normal text-black">
              But the original feeling remains.
            </p>

            <blockquote className="border-l-2 border-black dark:border-white pl-6 my-8 italic font-gelasio text-xl md:text-2xl text-black font-light leading-relaxed">
              "Writeflow started as a project I wanted to build for my résumé.
              Somewhere along the way, it became a project I wanted to build for
              myself."
            </blockquote>

            <p>And I think that is the most beautiful part of its story.</p>

            <p className="italic text-dark-grey pt-2">
              The journey is far from over. This is simply the lore of how it all
              began.
            </p>
          </div>

          {/* ========================================================
              CLEAN EDITORIAL AUTHOR FOOTER
              ======================================================== */}
          <footer className="mt-16 pt-10 border-t border-grey">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-dark-grey font-semibold mb-1">
                  Written by
                </p>
                <h3 className="font-gelasio text-2xl font-normal text-black">
                  Vitthal Ganesh Shivane
                </h3>
                <p className="text-sm text-dark-grey mt-1">
                  Full-Stack Developer • Rooted in Latur, engineered in Nagpur, bound for Pune*
                </p>
              </div>

              {/* Verified Links Pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="https://github.com/vitthalganeshshivane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dark py-2 px-4 text-xs rounded-full flex items-center gap-1.5"
                >
                  <i className="fi fi-brands-github text-sm"></i>
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/vitthalganeshshivane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-light py-2 px-4 text-xs rounded-full flex items-center gap-1.5"
                >
                  <i className="fi fi-brands-linkedin text-sm"></i>
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://vitthalganeshshivane.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-light py-2 px-4 text-xs rounded-full flex items-center gap-1.5"
                >
                  <i className="fi fi-rr-globe text-sm"></i>
                  <span>Portfolio</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="btn-light py-2 px-4 text-xs rounded-full flex items-center gap-1.5"
                >
                  <i className="fi fi-rr-envelope text-sm"></i>
                  <span>{copiedEmail ? "Copied!" : "Email"}</span>
                </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/"
                className="text-xs text-dark-grey hover:text-black uppercase tracking-widest underline underline-offset-4 transition-colors"
              >
                Return to Writeflow
              </Link>
            </div>
          </footer>
        </article>
      </main>
    </AnimationWrapper>
  );
};

export default OdysseyPage;
