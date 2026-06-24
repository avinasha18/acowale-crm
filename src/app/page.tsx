import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f1623]">
      <div className="text-center space-y-8 px-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Acowale <span className="text-emerald-400">CRM</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-md mx-auto">
            Customer feedback intelligence platform powered by AI sentiment analysis
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/feedback"
            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Submit Feedback
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-6 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:border-gray-500 transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
        <p className="text-xs text-gray-600">Built by Abhi for Acowale Technologies</p>
      </div>
    </main>
  );
}
