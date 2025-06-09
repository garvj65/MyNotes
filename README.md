# 🧠 MyNotes — AI-Powered Note-Taking App

MyNotes is a smart, minimalist note-taking web app that leverages AI to summarize your notes. Built with **Next.js 14 (App Router)**, **Supabase** for authentication & database, **Groq** for summarization, and deployed on **Vercel**.

---
The application is deployed on https://mynotes-alpha.vercel.app


## 🚀 Features

- 🔐 Google OAuth Sign-in & Sign-up via Supabase
- 📝 Create, update, and delete notes
- ✨ One-click AI summarization powered by Groq
- 📋 Summaries appear neatly beside notes
- ⚡ Responsive UI with loading skeletons
- 🌐 Deployed live on Vercel with environment support

---

## 📸 Screenshots

> _(Add screenshots or a Loom video walkthrough here for visual flair!)_

---

## 🧱 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, React Query
- **Backend**: Supabase (Auth + Postgres DB)
- **AI**: Groq API for summarization
- **Deployment**: Vercel

---

## ⚙️ Environment Variables

Create a `.env.local` file in your root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

---

## 🛠️ Getting Started Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/mynotes.git
   cd mynotes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   - Add `.env.local` file as shown above

4. **Run locally**
   ```bash
   npm run dev
   ```

5. **Visit**
   ```
   http://localhost:3000
   ```

---



## 🧾 Deployment (Vercel)

1. Push your code to GitHub.
2. Create a new project on [Vercel](https://vercel.com).
3. Connect GitHub → Import Repo
4. Add environment variables from `.env.local`
5. Click **Deploy**

⚠️ After deployment, add your Vercel domain to:
- **Supabase → Auth → URL Redirects**
- **Google Cloud Console → OAuth credentials**

---


## 👨‍💻 Author

Built by [Garv Jhajharia](https://github.com/garvj65).

---

## 📃 License

MIT — feel free to fork, improve, and build upon it!