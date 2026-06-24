import { FeedbackForm } from "@/components/feedback-form";
import Link from "next/link";

export const metadata = {
  title: "Submit Feedback | Acowale CRM",
  description: "Help us improve by sharing your feedback",
};

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-[45%] bg-[#0f1623] items-center justify-center p-12">
          <div className="max-w-lg text-white space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                We value your feedback
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Help us improve by sharing your experience. Every piece of feedback helps us
                understand what matters most to you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <p className="text-3xl font-bold text-emerald-400">2,847</p>
                <p className="text-sm text-gray-400 mt-1">Submissions this month</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <p className="text-3xl font-bold text-blue-400">98%</p>
                <p className="text-sm text-gray-400 mt-1">Feedback reviewed</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                  <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">We read every submission</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                  <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">AI-powered sentiment analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
                  <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">Prioritized in our roadmap</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#0f1623]" />
                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-[#0f1623]" />
                <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-[#0f1623]" />
              </div>
              <span className="text-sm text-gray-400">Join thousands of users sharing feedback</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-lg">
            <div className="mb-6">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                &larr; Back to home
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="mb-6 space-y-3">
                <span className="inline-flex items-center rounded-md bg-[#0f1623] px-2.5 py-1 text-xs font-medium text-white">
                  NEW FEEDBACK
                </span>
                <h1 className="text-2xl font-semibold text-gray-900">Submit Feedback</h1>
                <p className="text-sm text-gray-500">Help us improve by sharing your experience.</p>
              </div>

              <FeedbackForm />
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              Your feedback is secure and anonymous.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
