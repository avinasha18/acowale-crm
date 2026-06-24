"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Invalid email or password");
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleCredentials} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@acowale.com"
          required
          className="h-10"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          required
          className="h-10"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-11 bg-[#0f1623] hover:bg-[#1a2436] text-white font-medium"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-xs text-gray-400 text-center pt-2">
        Demo credentials: admin@acowale.com / admin123
      </p>
    </form>
  );
}
