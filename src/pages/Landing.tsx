import { ArrowRight } from "lucide-react";

import { Link } from "react-router";
import { Fragment } from "react/jsx-runtime";

import EditorScr from "@/assets/editor-src.avif";
import Logo from "@/components/Logo.tsx";

export default function Landing() {
  return (
    <>
      <header className="flex justify-between px-6 py-3 md:mx-30">
        <Logo includeName />
        <div className="flex gap-2">
          <a href="/login" className="btn">
            Login
          </a>
        </div>
      </header>

      <main className="mx-4 my-16">
        <section className="flex flex-col">
          <h1 className="text-center text-4xl font-bold md:text-5xl">
            <p>Share your web</p>
            <p>
              <span className="text-secondary italic">IDEAS</span> fast
            </p>
          </h1>
          <p className="text-base-content/80 mx-auto mt-3 max-w-md px-5 text-center">
            PenWeave lets you write{" "}
            <span className="decoration-primary underline decoration-wavy underline-offset-4">
              HTML, CSS, JS{" "}
            </span>
            in a web editor and ⚡ generates the preview all in a browser tab.
          </p>
          <div className="mt-6 flex justify-center space-x-3">
            <a
              href="/projects/955f3653-d771-4ab3-9ef5-b6299c6606e9"
              className="btn"
              target="_blank"
            >
              See Demo
            </a>
            <a href="/signup" className="btn-primary btn">
              Sign Up Now <ArrowRight size="1rem" />
            </a>
          </div>
          <img
            src={EditorScr}
            alt="Editor screenshot"
            className="mx-auto mt-8 aspect-[16/9] rounded-lg border-3 lg:w-3xl"
          />
        </section>
        <div className="divider my-12"></div>
        <section>
          <h2 className="mb-6 flex justify-center text-2xl font-bold">
            The Workflow
          </h2>
          <div className="mx-auto flex flex-col gap-1 md:w-lg">
            {[
              { emoji: "🧑🏻‍💻", desc: "Write code in web languages" },
              { emoji: "⚡", desc: "See live instant previews" },
              { emoji: "🔗", desc: "Share your project with others" },
            ].map((item, i, arr) => (
              <Fragment key={i}>
                <div className="bg-base-200/50 flex items-center gap-2 rounded-lg p-5">
                  <span className="text-3xl">{item.emoji}</span>
                  <p className="text-base-content/80 italic">{item.desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-base-content/50 flex justify-center text-xl font-medium">
                    ↓
                  </span>
                )}
              </Fragment>
            ))}
          </div>
        </section>
        <div className="divider my-12"></div>
        <section>
          <h2 className="mb-6 flex justify-center text-2xl font-bold">
            Some Answers
          </h2>
          <div className="mx-auto md:w-xl">
            {[
              { qn: "Is this platform free?", ans: "Yes, its all yours!" },
              {
                qn: "Can I make my project private?",
                ans: "Yes, you can and it won't show up anywhere but your dashboard!",
              },
              {
                qn: "Can I explore other's projects?",
                ans: "Yes, there is an Explore page where you can find other projects and give them a like",
              },
              {
                qn: "Can I fork other's projects?",
                ans: "Yes, you can fork and modify other public projects.",
              },
              { qn: "Can I bookmark other's projects?", ans: "Yesss" },
              { qn: "Can I follow other creators?", ans: "Yesss" },
              {
                qn: "Is this a copy of Codepen?",
                ans: "Not copy, but INSPIRED 🫠",
              },
            ].map((item, i) => (
              <div
                className="collapse-arrow border-base-300 collapse mt-2.5 rounded-lg border"
                key={i}
              >
                <input type="radio" name="accordion" defaultChecked={i === 0} />
                <div className="collapse-title font-medium">{item.qn}</div>
                <div className="collapse-content text-sm">{item.ans}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="text-base-content/80 mb-6 flex justify-center text-sm">
        Made with ❤️ by Shone Binu • &#x200b;
        <Link
          target="_blank"
          to="https://github.com/shonebinu/penweave"
          className="link text-base-content"
        >
          Source Code
        </Link>
      </footer>
    </>
  );
}
