import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export const metadata = {
  title: "Admin Login | Acowale CRM",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f1623] items-center justify-center p-12">
        <div className="max-w-md text-white space-y-6">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Access your feedback dashboard to monitor customer sentiment,
            track trends, and make data-driven product decisions.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="text-2xl font-bold">2,847</p>
              <p className="text-xs text-gray-400 mt-1">Total Feedback</p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="text-2xl font-bold">87.3%</p>
              <p className="text-xs text-gray-400 mt-1">Resolution Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-500">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <LoginForm />
          </div>

          <p className="text-center text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-700 transition-colors">&larr; Back to home</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
