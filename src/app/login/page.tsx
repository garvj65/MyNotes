"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push("/dashboard");
    else alert(error.message);
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // redirect back to this path after Google login
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 shadow-xl rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Login</h1>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="w-full" onClick={handleLogin}>
          Login
        </Button>

        <div className="flex items-center my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>
      </div>
    </main>
  );
}
