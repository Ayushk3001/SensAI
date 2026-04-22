// app/components/Header.jsx  — NO "use client" — Server Component
import React from "react";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import GrowthDropdown from "@/components/GrowthDropdown";

export default async function Header() {
  await checkUser();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .sensai-hdr {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 9000;
          height: 60px;
          background: rgba(6, 6, 6, 0.94);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid #1a1a1a;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .sensai-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        /* Logo */
        .sensai-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }

        /* Right group */
        .sensai-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        /* Industry Insights link */
        .insights-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          border: 1px solid #262626;
          border-radius: 8px;
          padding: 7px 14px;
          color: #9ca3af;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          white-space: nowrap;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          line-height: 1;
        }
        .insights-btn:hover {
          background: #13082a;
          border-color: #3b1f6e;
          color: #a78bfa;
        }
        @media (max-width: 600px) {
          .insights-text { display: none; }
          .insights-btn  { padding: 7px 10px; }
        }

        /* Sign-in button */
        .signin-btn {
          background: transparent;
          border: 1px solid #262626;
          border-radius: 8px;
          padding: 7px 16px;
          color: #9ca3af;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: background 0.15s, color 0.15s;
          line-height: 1;
        }
        .signin-btn:hover { background: #1a1a1a; color: #e5e5e5; }
      `}</style>

      <header className="sensai-hdr">
        <nav className="sensai-nav">

          {/* ── Logo ── */}
          <Link href="/" className="sensai-logo">
            <Image
              src="/logo.png"
              alt="Sensai"
              width={160}
              height={48}
              style={{ height: 42, width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>

          {/* ── Right side ── */}
          <div className="sensai-right">

            <SignedIn>
              {/* Industry Insights */}
              <Link href="/dashboard" className="insights-btn">
                <LayoutDashboard size={15} color="#9ca3af" />
                <span className="insights-text">Industry Insights</span>
              </Link>

              {/* Growth Tools dropdown — client component */}
              <GrowthDropdown />
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <button className="signin-btn">Sign In</button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                    userButtonPopoverCard: "shadow-xl",
                    userPreviewMainIdentifier: "font-semibold",
                  },
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>

          </div>
        </nav>
      </header>
    </>
  );
}