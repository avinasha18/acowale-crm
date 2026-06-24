import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f1623] flex flex-col">
      <header className="flex items-center justify-between px-6 sm:px-10 py-5">
        <div className="flex items-center gap-2.5">
          <svg className="h-7 w-7" viewBox="0 0 512 512" fill="none">
            <path d="M512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512C397.385 512 512 397.385 512 256Z" fill="#0795FF"/>
            <path d="M290.417 340.78C290.417 312.97 312.961 290.426 340.771 290.426C368.57 290.426 391.108 312.953 391.125 340.748V340.78V340.81C391.109 368.606 368.571 391.134 340.771 391.134C328.903 391.134 317.994 387.029 309.387 380.16C297.825 370.934 290.417 356.722 290.417 340.78Z" fill="white"/>
            <path d="M290.417 255.98L391.124 255.991L391.125 340.746V340.808V341.391H290.417V310.392V255.98Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M255.999 391.116C272.453 391.116 288.22 388.175 302.803 382.79C289.352 373.881 280.425 358.685 280.218 341.392V340.779V280.081C273.869 286.464 265.078 290.414 255.364 290.414C236.003 290.414 220.308 274.719 220.308 255.358C220.308 235.996 236.003 220.301 255.364 220.301C274.726 220.301 290.421 235.996 290.421 255.358C290.421 257.24 290.273 259.088 289.987 260.89C290.242 259.288 290.387 257.648 290.417 255.981V310.393V340.779V341.392C290.604 357.085 297.974 371.051 309.387 380.159C317.994 387.028 328.903 391.133 340.771 391.133C368.376 391.133 390.797 368.919 391.125 341.392V340.809V340.779V340.747L391.124 255.992C391.124 181.364 330.626 120.867 255.999 120.867C181.372 120.867 120.875 181.364 120.875 255.992C120.875 330.619 181.372 391.116 255.999 391.116Z" fill="white"/>
          </svg>
          <span className="text-lg font-bold text-white tracking-tight">Acowale CRM</span>
        </div>
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
        <p className="text-xs text-gray-600">Built by Tejassri Avinasha for Acowale Technologies</p>
        <p className="text-xs text-gray-600">Machine Test 2026</p>
      </footer>
    </main>
  );
}
