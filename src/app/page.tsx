import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f1623] flex flex-col">
      <header className="flex items-center justify-between px-6 sm:px-10 py-5">
        <h2 className="text-lg font-bold text-white tracking-tight">Acowale CRM</h2>
        <Link
          href="/login"
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          Admin Login
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-4xl text-center space-y-10">
          <div className="space-y-5">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white">
              We value your <span className="text-emerald-400">feedback</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Help us improve by sharing your experience. Every piece of feedback is analyzed
              and prioritized to build a better product for you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/feedback"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
            >
              Submit Feedback
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-gray-600 px-8 py-3.5 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:border-gray-500 transition-colors"
            >
              View Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">2,847</p>
              <p className="text-xs text-gray-500 mt-1">Submissions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">98%</p>
              <p className="text-xs text-gray-500 mt-1">Reviewed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">4.8/5</p>
              <p className="text-xs text-gray-500 mt-1">Avg. Rating</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="px-6 sm:px-10 py-5 flex items-center justify-between">
        <p className="text-xs text-gray-600">Built by Abhi for Acowale Technologies</p>
        <p className="text-xs text-gray-600">Machine Test 2024</p>
      </footer>
    </main>
  );
}
