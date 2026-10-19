"use client";

import { usePathname } from "next/navigation";
import { BottomNav, MobileHeader, TopNav } from "./TopNav";

const minimalPaths = ["/", "/onboarding"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal = minimalPaths.includes(pathname);

  if (minimal) {
    return (
      <div className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border-2 focus:border-line focus:bg-surface focus:px-4 focus:py-2 focus:font-semibold"
        >
          Skip to content
        </a>
        <div id="main-content" className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border-2 focus:border-line focus:bg-surface focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>
      <TopNav />
      <MobileHeader />
      <main id="main-content" className="flex-1 pb-24 lg:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
