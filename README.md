# Kelvin Olasupo — Personal Portfolio 💼

My personal site, built with **React**, **TypeScript**, and **Vite**. It is a single-page
application, and it is meant to feel like a place rather than a CV in a browser.

## 🚀 Live Site

👉 [kelvinolasupo.com](https://kelvinolasupo.com)

## ✨ What makes it mine

The site leans into what I actually do all day, which is fraud operations and building tools.

| Feature | What it does |
|---|---|
| **Interactive terminal** | Press <kbd>`</kbd> or <kbd>Ctrl/Cmd</kbd>+<kbd>K</kbd> for a working shell. `help`, `projects`, `neofetch`, `cat kelvin.json`, `theme`, `music`, `goto <section>`, with tab-completion and command history. Try `sudo`. |
| **Live risk-graph background** | A canvas of drifting nodes that link up, react to the cursor, and periodically flag a node red, investigate it, then clear it green. A nod to the day job. |
| **Generative ambient music** | No audio file is streamed. A Web Audio synth builds the chords, arpeggio, and tape noise live in the browser, with a level meter on the toggle. |
| **Boot sequence** | A short typed startup log on first visit each session. Any key skips it. |
| **Custom cursor** | A dot and a trailing ring that swells over anything interactive. Fine pointers only. |
| **Konami code** | ↑ ↑ ↓ ↓ ← → ← → B A. You will know when it works. |
| **Tilting code card** | The hero card leans towards the cursor with a spotlight that tracks it. |
| **Spotlight project cards** | A gradient border and glow follow the cursor across each card. |
| **Plus** | Scroll progress bar, scroll-spy nav, animated counters, a typewriter role line, a live London clock, a dual-speed marquee, film grain, and a console note for anyone who opens dev tools. |

Everything above respects `prefers-reduced-motion`: the boot screen is skipped, the custom
cursor is not mounted, the canvas stops animating, and the marquee holds still.

## 💡 Featured Projects

- **AgileFlow** – Agile sprint manager with TensorFlow-driven predictions. Bronze Award for Innovation.
- **Thrive Finance** – My own personal finance startup, live with real users.
- **Mylestone** – A care-tracking PWA for medically complex infants.
- **AlertIQ** – A fraud analyst training simulator.

## 🛠️ Tech Stack

| Area           | Technology                                   |
|----------------|----------------------------------------------|
| Frontend       | React (v18), TypeScript, Vite                |
| Styling        | Vanilla CSS with custom properties           |
| Animations     | Framer Motion, plus hand-rolled canvas & rAF |
| Audio          | Web Audio API (synthesised, no assets)       |
| State Mgmt     | Context API (`ThemeContext`, `UIContext`)    |
| Hosting        | Netlify                                      |

## Deployment

| Environment  | Command(s)                            | Purpose |
|--------------|---------------------------------------|---------|
| **Local Dev** | `npm install` → `npm run dev`          | Installs dependencies, then starts Vite dev server for local testing. |
| **Production Build** | `npm install` → `npm run build` | Installs dependencies, then builds the production-ready site into the `dist` folder. |
| **Netlify Deploy** | *(automatic)* `npm install` → `npm run build` | Netlify runs this when you push to GitHub; outputs to `dist` and serves it live. |
| **Local Production Preview** | `npm run build` → `npm run preview` | Builds production site and previews it locally. |

**CI/CD Flow:**  
- **Continuous Integration (CI):** Every push to GitHub triggers a Netlify build.  
- **Continuous Delivery/Deployment (CD):** Merges to `main` auto-deploy to production; pull requests create preview deploys.

## 📫 Contact

Feel free to reach out or explore more of my work:

- 🌐 [LinkedIn](https://www.linkedin.com/in/kelvin-o-72a874226/)
- 🐙 [GitHub](https://github.com/1Kelv)
- ✍🏾 [Medium](https://medium.com/@1kelv)
- 📧 Email: [hidden via contact form for privacy]

---

Thanks for visiting my portfolio. I’d love your feedback!

