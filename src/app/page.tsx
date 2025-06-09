"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 text-lg">
        Checking login...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 flex flex-col items-center justify-center px-6 sm:px-12">
      <div className="text-center max-w-3xl">
        <div className="inline-flex items-center justify-center gap-3 mb-6 text-blue-600">
          <Sparkles className="h-7 w-7 animate-pulse" />
          <span className="text-lg font-semibold tracking-wide drop-shadow-sm">
            Welcome to MyNotes AI
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 leading-tight drop-shadow-md">
          Smarter Notes, <br />
          <span className="text-blue-600">Instantly Summarized</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-xl mx-auto leading-relaxed">
          Powered by Groq + Supabase + Next.js, MyNotes lets you focus on ideas, not paragraphs. Capture brilliance without the hassle.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link href="/login" passHref>
            <Button className="px-8 py-3 text-md shadow-md hover:shadow-lg transition-shadow duration-300">
              Login
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button
              variant="outline"
              className="px-8 py-3 text-md border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      <footer className="mt-20 text-sm text-gray-400 select-none">
        Built with ❤️ by someone who *actually* reads release notes.
      </footer>
    </main>
  );
}
