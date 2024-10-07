"use client";

import Link from "next/link";
import SiteLogo from "@/components/Site/Logo";
import { useUserStore } from "@/store/useUserStore";

const SiteHeader = () => {
  const { user } = useUserStore();
  return (
    <header className="site-header sticky top-0 w-full border-b border-gray-200 bg-white p-4 py-2">
      <div className="wrapper mx-auto flex max-w-5xl justify-between gap-4">
        <Link href="/">
          <SiteLogo />
        </Link>

        <nav className="site-nav">
          <div className="wrapper h-full">
            <ul className="flex h-full flex-wrap items-center gap-4">
              {user ? (
                <>
                  <li>
                    <Link href="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/auth/logout">Logout</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/auth/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/auth/register">Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
