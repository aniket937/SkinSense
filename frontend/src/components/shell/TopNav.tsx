"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { AskIcon, HomeIcon, IngredientIcon, MicIcon, ProductIcon, RoutineIcon, SkinIcon } from "./icons";

const navItems = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/skin", label: "My Skin", icon: SkinIcon },
  { href: "/routine", label: "Routine", icon: RoutineIcon },
  { href: "/check-product", label: "Check Product", icon: ProductIcon },
  { href: "/ingredients", label: "Ingredients", icon: IngredientIcon },
  { href: "/ask", label: "Ask", icon: AskIcon },
];

const bottomItems = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/routine", label: "Routine", icon: RoutineIcon },
  { href: "/check-product", label: "Product", icon: ProductIcon },
  { href: "/ingredients", label: "Ingredients", icon: IngredientIcon },
  { href: "/ask", label: "Ask", icon: AskIcon },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Wordmark() {
  return (
    <Link
      href="/dashboard"
      className="display border-2 border-line bg-surface px-3 py-1.5 text-lg tracking-tight text-ink brutal-shadow-sm"
      aria-label="SkinSense home"
    >
      SKIN<span className="text-clay-deep">SENSE</span>
    </Link>
  );
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 hidden border-b-2 border-line bg-paper/95 lg:block">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <Wordmark />
        <nav aria-label="Primary" className="flex flex-1 items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "px-3 py-2 text-sm font-semibold",
                  active
                    ? "border-2 border-line bg-blush"
                    : "border-2 border-transparent hover:border-line"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/ask?voice=1"
            className="btn btn-sm"
            aria-label="Ask by voice"
            title="Ask by voice"
          >
            <MicIcon className="h-4 w-4" />
            Voice
          </Link>
          <Link href="/settings" className="btn btn-sm" aria-label="Settings">
            Settings
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MobileHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b-2 border-line bg-paper/95 px-4 py-3 lg:hidden">
      <Link
        href="/dashboard"
        className="display border-2 border-line bg-surface px-2.5 py-1 text-base tracking-tight brutal-shadow-sm"
        aria-label="SkinSense home"
      >
        SKIN<span className="text-clay-deep">SENSE</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/ask?voice=1"
          className="flex h-10 w-10 items-center justify-center border-2 border-line bg-surface"
          aria-label="Ask by voice"
        >
          <MicIcon />
        </Link>
        <Link
          href="/settings"
          className="flex h-10 w-10 items-center justify-center border-2 border-line bg-surface text-sm font-bold"
          aria-label="Settings"
        >
          ⚙
        </Link>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t-2 border-line bg-surface lg:hidden"
    >
      {bottomItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex min-h-16 flex-col items-center justify-center gap-1 border-t-2 px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]",
              active ? "border-clay bg-blush text-clay-deep" : "border-transparent text-ink-soft"
            )}
          >
            <Icon />
            <span className="text-[11px] font-bold uppercase tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
