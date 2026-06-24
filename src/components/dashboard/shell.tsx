"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/dashboard/feedback", label: "Feedback", icon: "feedback" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "analytics" },
];

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? "text-white" : "text-gray-400";
  if (type === "dashboard") {
    return (
      <svg className={`h-5 w-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    );
  }
  if (type === "feedback") {
    return (
      <svg className={`h-5 w-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    );
  }
  return (
    <svg className={`h-5 w-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-[#0f1623] text-white">
      <div className="px-5 py-6 flex items-center gap-2.5">
        <svg className="h-7 w-7 flex-shrink-0" viewBox="0 0 512 512" fill="none">
          <path d="M512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512C397.385 512 512 397.385 512 256Z" fill="#0795FF"/>
          <path d="M290.417 340.78C290.417 312.97 312.961 290.426 340.771 290.426C368.57 290.426 391.108 312.953 391.125 340.748V340.78V340.81C391.109 368.606 368.571 391.134 340.771 391.134C328.903 391.134 317.994 387.029 309.387 380.16C297.825 370.934 290.417 356.722 290.417 340.78Z" fill="white"/>
          <path d="M290.417 255.98L391.124 255.991L391.125 340.746V340.808V341.391H290.417V310.392V255.98Z" fill="white"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M255.999 391.116C272.453 391.116 288.22 388.175 302.803 382.79C289.352 373.881 280.425 358.685 280.218 341.392V340.779V280.081C273.869 286.464 265.078 290.414 255.364 290.414C236.003 290.414 220.308 274.719 220.308 255.358C220.308 235.996 236.003 220.301 255.364 220.301C274.726 220.301 290.421 235.996 290.421 255.358C290.421 257.24 290.273 259.088 289.987 260.89C290.242 259.288 290.387 257.648 290.417 255.981V310.393V340.779V341.392C290.604 357.085 297.974 371.051 309.387 380.159C317.994 387.028 328.903 391.133 340.771 391.133C368.376 391.133 390.797 368.919 391.125 341.392V340.809V340.779V340.747L391.124 255.992C391.124 181.364 330.626 120.867 255.999 120.867C181.372 120.867 120.875 181.364 120.875 255.992C120.875 330.619 181.372 391.116 255.999 391.116Z" fill="white"/>
        </svg>
        <span className="text-lg font-bold text-white tracking-tight">Acowale CRM</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              <NavIcon type={item.icon} active={active} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 mt-auto">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all"
        >
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null };
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "AU";

  const breadcrumb = pathname === "/dashboard"
    ? "Dashboard"
    : pathname.includes("/feedback")
    ? "Feedback / Manage"
    : "Analytics";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="hidden w-60 md:block">
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger className="inline-flex items-center justify-center rounded-md h-9 w-9 md:hidden hover:bg-gray-100">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 p-0">
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="text-sm text-gray-500">{breadcrumb}</span>
          </div>

          <div className="flex items-center gap-3">
            <form
              className="hidden sm:block relative"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/dashboard/feedback?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            >
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search feedback..."
                className="h-9 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 focus:bg-white"
              />
            </form>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full h-9 w-9 hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-[#0f1623] text-white">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-sm text-gray-600">
                  {user.name || user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
