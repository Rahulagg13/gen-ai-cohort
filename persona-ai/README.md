# Persona AI Bot – Hitesh Sir & Piyush Sir

A Next.js 15 + Tailwind app where users chat with AI personas modeled after **Hitesh Choudhary** and **Piyush Garg**. Messages are rendered via **MDX** (including code blocks), so answers look clean and developer‑friendly.

---

## Features

* Persona-based replies (Hitesh Sir / Piyush Sir)
* MDX rendering with fenced code blocks
* Tailwind Typography for readable content
* No DB required for basics (state-only), can be extended later

## Tech Stack

* **Next.js 15** (App Router)
* **TypeScript**
* **Tailwind CSS** + `@tailwindcss/typography`
* **next-mdx-remote** for MDX rendering
* **Google Gemini** (or compatible LLM) for responses

---

## Quick Start (Step‑by‑Step)

### 0) Prerequisites

* **Node.js 20+** (LTS recommended)
* **pnpm** (recommended) or npm/yarn
* A **Gemini API key** (or your chosen LLM provider key)

```bash
# install pnpm if you don't have it
npm i -g pnpm

# verify versions
node -v
pnpm -v
```

### 1) Clone the repo

Replace the placeholder URL with your repository.

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

> If your default branch is not checked out automatically, do:
>
> ```bash
> git checkout main   # or: git checkout master
> ```

### 2) Install dependencies

```bash
pnpm install
# or
# npm install
# yarn install
```

### 3) Configure environment

Create a `.env.local` file at the project root:

```env
# LLM keys
GEMINI_API_KEY=your_api_key_here

# (Optional) Public app URL used for absolute URLs, etc.
NEXT_PUBLIC_APP_URL=http://localhost:3000

```

> **Note:** Do not commit `.env.local`. It is git-ignored by default in Next.js apps.

### 4) Start the dev server

```bash
pnpm dev
# or: npm run dev
```

Open the app: [http://localhost:3000](http://localhost:3000)

### 5) Build & run in production

```bash
pnpm build
pnpm start
# or with npm
# npm run build && npm run start
```

The server will boot on port **3000** by default.

---

## License

MIT (replace with your license if different)
