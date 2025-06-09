# 🧠 MyNotes — AI-Powered Note-Summarizing App

MyNotes is a smart, minimalist note-taking web app that uses AI to summarize your notes. MyNotes is a smart digital notebook that helps you easily write down and organize your thoughts, ideas, or important information. Think of it like a super-powered diary or journal that’s always with you on your computer. MyNotes is your personal, smart helper for capturing and organizing your thoughts quickly and clearly.

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




## 👨‍💻 Author

Built by [Garv Jhajharia](https://github.com/garvj65).

---

## 📃 License

MIT — feel free to fork, improve, and build upon it!