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
        <div className="hidden lg:flex lg:w-1/2 bg-[#0f1623] items-center justify-center p-12">
          <div className="max-w-md text-white space-y-6">
            <h2 className="text-3xl font-bold">Your feedback shapes our product</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Every piece of feedback helps us understand what matters most to you.
              We read every submission and use it to prioritize what we build next.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#0f1623]" />
                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-[#0f1623]" />
                <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-[#0f1623]" />
              </div>
              <span className="text-sm text-gray-400">2,847 feedback submissions this month</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
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
                <h1 className="text-xl font-semibold text-gray-900">Submit Feedback</h1>
                <p className="text-sm text-gray-500">Help us improve by sharing your experience.</p>
              </div>

              <FeedbackForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
