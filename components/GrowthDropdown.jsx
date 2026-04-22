"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  PenBox,
  FileText,
  GraduationCap,
  Mic,
  Map,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  {
    href: "/resume",
    icon: FileText,
    label: "Build Resume",
    desc: "ATS-optimized in seconds",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.35)",
    bg: "rgba(15,26,46,0.7)",
    border: "rgba(30,58,95,0.8)",
    hoverBg: "rgba(96,165,250,0.08)",
  },
  {
    href: "/ai-cover-letter",
    icon: PenBox,
    label: "Cover Letter",
    desc: "Tailored to every job",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
    bg: "rgba(19,8,42,0.7)",
    border: "rgba(59,31,110,0.8)",
    hoverBg: "rgba(167,139,250,0.08)",
  },
  {
    href: "/interview",
    icon: GraduationCap,
    label: "Interview Prep",
    desc: "Question bank & tips",
    color: "#34d399",
    glow: "rgba(52,211,153,0.35)",
    bg: "rgba(10,31,20,0.7)",
    border: "rgba(22,101,52,0.8)",
    hoverBg: "rgba(52,211,153,0.08)",
  },
  {
    href: "/interview/voice",
    icon: Mic,
    label: "Voice Interview",
    desc: "Practice speaking live",
    color: "#f87171",
    glow: "rgba(248,113,113,0.35)",
    bg: "rgba(31,10,10,0.7)",
    border: "rgba(127,29,29,0.8)",
    hoverBg: "rgba(248,113,113,0.08)",
  },
  {
    href: "/roadmap",
    icon: Map,
    label: "Career Roadmap",
    desc: "Your learning path",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.35)",
    bg: "rgba(28,18,8,0.7)",
    border: "rgba(120,53,15,0.8)",
    hoverBg: "rgba(251,191,36,0.08)",
  },
];

function NavItem({ item, onClose }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        textDecoration: "none",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: hovered ? item.hoverBg : "transparent",
        transition: "background 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle shimmer line on hover */}
      {hovered && (
        <div style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: 2,
          background: item.color,
          borderRadius: "0 2px 2px 0",
          boxShadow: `0 0 8px ${item.glow}`,
        }} />
      )}

      {/* Icon tile */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          flexShrink: 0,
          background: hovered
            ? `rgba(255,255,255,0.06)`
            : item.bg,
          border: `1px solid ${hovered ? item.color + "60" : item.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: hovered ? `0 0 16px ${item.glow}, inset 0 0 8px rgba(255,255,255,0.04)` : "none",
          transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          transform: hovered ? "scale(1.13) rotate(-4deg)" : "scale(1) rotate(0deg)",
        }}
      >
        <div style={{
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), filter 0.2s",
          transform: hovered ? "scale(1.1)" : "scale(1)",
          filter: hovered ? `drop-shadow(0 0 6px ${item.color})` : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Icon size={17} color={item.color} />
        </div>
      </div>

      {/* Text */}
      <div>
        <p style={{
          fontSize: 13,
          fontWeight: 600,
          color: hovered ? "#fff" : "#e5e5e5",
          margin: 0,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          transition: "color 0.15s",
        }}>
          {item.label}
        </p>
        <p style={{
          fontSize: 11,
          color: hovered ? "#9ca3af" : "#4b5563",
          margin: "2px 0 0",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          transition: "color 0.15s",
        }}>
          {item.desc}
        </p>
      </div>

      {/* Arrow on hover */}
      <div style={{
        marginLeft: "auto",
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateX(0)" : "translateX(-6px)",
        transition: "all 0.2s ease",
        color: item.color,
        fontSize: 14,
        flexShrink: 0,
      }}>
        →
      </div>
    </Link>
  );
}

export default function GrowthDropdown() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes ddIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .gt-btn {
          display: flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border: 1px solid rgba(167,139,250,0.3);
          border-radius: 9px;
          padding: 8px 15px;
          color: #fff; font-size: 13px; font-weight: 600;
          cursor: pointer; white-space: nowrap;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: all 0.2s;
          line-height: 1;
          backdrop-filter: blur(8px);
          box-shadow: 0 0 0 0 rgba(124,58,237,0);
          position: relative;
          overflow: hidden;
        }
        .gt-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .gt-btn:hover {
          background: linear-gradient(135deg, #6d28d9, #5b21b6);
          box-shadow: 0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(124,58,237,0.2);
          border-color: rgba(167,139,250,0.5);
          transform: translateY(-1px);
        }
        .gt-btn:hover::before { opacity: 1; animation: shimmer 1.5s infinite; }
        .gt-btn:active { transform: translateY(0) scale(0.98); }

        .gt-btn-icon {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .gt-btn:hover .gt-btn-icon {
          transform: rotate(20deg) scale(1.2);
        }

        .gt-x {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer; color: #4b5563;
          display: flex; align-items: center;
          padding: 4px; border-radius: 6px;
          transition: all 0.15s;
        }
        .gt-x:hover {
          color: #e5e5e5;
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
          transform: rotate(90deg);
        }

        .gt-item:last-of-type { border-bottom: none !important; }
      `}</style>

      <div ref={wrapRef} style={{ position: "relative", display: "inline-block" }}>

        {/* Trigger button */}
        <button ref={btnRef} className="gt-btn" onClick={() => setOpen((o) => !o)}>
          <Sparkles size={14} className="gt-btn-icon" />
          <span>Growth Tools</span>
          <ChevronDown
            size={13}
            style={{
              transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {/* Dropdown panel */}
        {open && (
          <div
            style={{
              position: "fixed",
              top: 66,
              right: 16,
              width: 292,
              background: "rgba(10,10,12,0.85)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              overflow: "hidden",
              zIndex: 99999,
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
              animation: "ddIn 0.22s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* Glass top edge highlight */}
            <div style={{
              position: "absolute",
              top: 0, left: "10%", right: "10%",
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              pointerEvents: "none",
              zIndex: 1,
            }} />

            {/* Panel header */}
            <div style={{
              padding: "13px 16px 11px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.02)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <p style={{
                  fontSize: 10, fontWeight: 700, color: "#a78bfa",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  margin: 0, fontFamily: "'DM Sans', system-ui, sans-serif",
                }}>
                  Growth Tools
                </p>
                <p style={{
                  fontSize: 11, color: "#4b5563", margin: "2px 0 0",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}>
                  AI-powered career accelerators
                </p>
              </div>
              <button className="gt-x" onClick={() => setOpen(false)}>
                <X size={13} />
              </button>
            </div>

            {/* Nav items */}
            <div>
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.href} item={item} onClose={() => setOpen(false)} />
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: "9px 16px",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(255,255,255,0.01)",
              display: "flex", alignItems: "center", gap: 7,
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#7c3aed", flexShrink: 0,
                animation: "pulse-dot 2s ease-in-out infinite",
                boxShadow: "0 0 6px rgba(124,58,237,0.8)",
              }} />
              <span style={{
                fontSize: 11, color: "#4b5563",
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}>
                Powered by AI — results in seconds
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}