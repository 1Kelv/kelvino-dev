# KelvinO.dev – Personal Portfolio 💼

Welcome to my personal portfolio website, built with **React**, **TypeScript**, and **Vite**. This single-page application showcases my background, development experience, and key projects.

## 🔥 Purpose

While on holiday, I wanted to do something productive,  so I decided to build this portfolio from scratch. I initially implemented Tailwind CSS but faced challenges integrating dark mode across components, which led me to switch to **vanilla CSS** after days of debugging. This version now includes:

- Responsive design (mobile-first)
- Smooth scrolling with `scrollIntoView`
- Subtle animations using **Framer Motion**
- Working contact form (via Netlify Forms)
- Live links to my projects and social platforms

## 🚀 Live Site

👉 [kelvino-dev.netlify.app](https://kelvino-dev.netlify.app)

## 💡 Featured Projects

- **NextGen AI Résumé Analyser** – An AI-powered résumé reviewer using SHAP, LIME, and fairness auditing.
- **AgileFlow** – A task/sprint manager with predictive AI and Supabase backend.
- **Banana Game 🍌** – A JavaScript puzzle game with real-time login and API challenges.

## 🛠️ Tech Stack

| Area           | Technology                      |
|----------------|----------------------------------|
| Frontend       | React (v18), TypeScript, Vite    |
| Styling        | Vanilla CSS                     |
| Animations     | Framer Motion                   |
| State Mgmt     | Context API                     |
| Hosting        | Netlify                         |

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

- 🌐 [LinkedIn](https://www.linkedin.com/in/kelvinosupo/)
- 🐙 [GitHub](https://github.com/1Kelv)
- ✍🏾 [Medium](https://medium.com/@kelvinosupo)
- 📧 Email: [hidden via contact form for privacy]

---

Thanks for visiting my portfolio. I’d love your feedback!

