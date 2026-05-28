// 4Rvin Studio — React Single Page Application
// Architecture: component-based, section-data-driven, future-page-ready
// Each section is a standalone component that can be extracted to its own route

import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const tokens = {
  dark: {
    bg: "#07090d", bg2: "#0b0e14", bg3: "#0f1319",
    surface: "rgba(255,255,255,0.03)", surface2: "rgba(255,255,255,0.055)",
    border: "rgba(255,255,255,0.065)", border2: "rgba(255,255,255,0.11)",
    text: "#edf0f5", text2: "#7a8599", text3: "#2e3545",
    accent: "#b8f040", accentFg: "#07090d",
    accentText: "#b8f040", accentBorder: "rgba(184,240,64,0.3)",
    shadow: "0 28px 70px rgba(0,0,0,0.55)",
  },
  light: {
    bg: "#f4f5f8", bg2: "#eceef3", bg3: "#e3e6ed",
    surface: "rgba(0,0,0,0.028)", surface2: "rgba(0,0,0,0.055)",
    border: "rgba(0,0,0,0.08)", border2: "rgba(0,0,0,0.14)",
    text: "#0c0f17", text2: "#525b72", text3: "#b0b8cc",
    accent: "#111520", accentFg: "#f4f5f8",
    accentText: "#111520", accentBorder: "rgba(17,21,32,0.25)",
    shadow: "0 12px 40px rgba(0,0,0,0.1)",
  },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Services", href: "#services" },
  { label: "Industries", href: "#industries" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

const CAPABILITIES = [
  { icon: "⚡", name: "Performance-first", desc: "Fast load times, Core Web Vitals, and optimised rendering by default." },
  { icon: "◎", name: "SEO-ready builds", desc: "Semantic HTML, metadata, structured data, and mobile-first from day one." },
  { icon: "⬡", name: "Modern web systems", desc: "React, Next.js, Angular, C#, Python and scalable back-end infrastructure." },
  { icon: "◈", name: "AI-assisted workflows", desc: "Smarter prototypes, faster iterations, better outcomes." },
];

const SERVICES = [
  { n: "01", name: "Website Development", desc: "Custom-built sites in React or Next.js — fast, clean, and maintainable." },
  { n: "02", name: "Landing Pages", desc: "Conversion-focused single pages for launches, ads, and campaigns." },
  { n: "03", name: "Business Websites", desc: "Professional presence for service businesses and local companies." },
  { n: "04", name: "Branding", desc: "Logo, colour system, typography, and brand guidelines that hold up everywhere." },
  { n: "05", name: "Dashboard Interfaces", desc: "Admin panels, client portals, and internal tools with clean, usable UIs." },
  { n: "06", name: "Invoice & Proposal Systems", desc: "Custom web apps for proposals, invoices, and client management." },
  { n: "07", name: "SEO-ready Development", desc: "Technical SEO built in: structured data, meta tags, fast rendering, clean URLs." },
  { n: "08", name: "Professional Email Setup", desc: "Domain email with proper DNS, deliverability, and routing." },
  { n: "09", name: "UI / UX Design", desc: "Figma-first design with real components, flows, and responsive layouts." },
  { n: "10", name: "Client Platforms", desc: "Onboarding portals, document delivery, and project-tracking systems." },
  { n: "11", name: "AI Product Concepts", desc: "Interfaces and MVPs for AI-driven tools and generation workflows." },
  { n: "12", name: "React / Next.js Builds", desc: "SSR, static, or edge-rendered apps on modern React architecture." },
];

const TECH_CATEGORIES = [
  { label: "Front-end", pills: ["React", "Next.js", "Angular", "Tailwind CSS", "Framer Motion", "TypeScript"] },
  { label: "Back-end", pills: ["Node.js", "Python", "C# / .NET", "REST APIs", "GraphQL"] },
  { label: "Databases", pills: ["PostgreSQL", "MongoDB", "Oracle", "Supabase", "Redis"] },
  { label: "Infrastructure", pills: ["AWS", "Vercel", "Docker", "Figma", "Git", "Stripe"] },
];

const INDUSTRIES = [
  { icon: "🛒", name: "E-commerce", desc: "We build storefronts, product pages, and checkout flows that convert — on Shopify, Next.js Commerce, or custom stacks.", tags: ["Shopify", "Next Commerce", "Stripe"] },
  { icon: "🏗️", name: "Construction", desc: "Lead-gen sites and company platforms for contractors, builders, and construction firms ready to grow online.", tags: ["Portfolio", "CRM", "Lead Gen"] },
  { icon: "✦", name: "Creative Brands", desc: "Portfolio and studio sites for agencies and creative professionals who need a presence that matches their work.", tags: ["Identity", "Portfolio", "Motion"] },
  { icon: "⚡", name: "Startups", desc: "Launch-ready marketing sites and MVPs for founders who need to move fast without cutting corners on quality.", tags: ["MVP", "Landing Page", "Pitch"] },
  { icon: "◈", name: "SaaS", desc: "Marketing sites, onboarding flows, and dashboard UIs for software products that need to stand out and convert.", tags: ["Dashboard", "Onboarding", "B2B"] },
  { icon: "◎", name: "Local Businesses", desc: "Restaurants, clinics, and service businesses — professional digital presence that drives real local customers.", tags: ["Local SEO", "Booking", "Maps"] },
];

const WORK_ITEMS = [
  { type: "Business Website · Contractor", name: "Contractor & Construction Co.", desc: "Lead-gen site with project portfolio, service areas, and contact flow.", thumb: "contractor", wide: false },
  { type: "Dashboard · Business Platform", name: "Proposal & Invoice System", desc: "Web app for proposals, invoices, and client tracking with a clean portal.", thumb: "dashboard", wide: false },
  { type: "SaaS · Management Interface", name: "SaaS Management Dashboard", desc: "Analytics, KPI tracking, and user management — clean, fast, data-forward.", thumb: "saas", wide: true },
  { type: "Landing Page · Startup", name: "AI Product Landing Page", desc: "High-converting product launch page with waitlist, social proof, and hero.", thumb: "startup", wide: false },
  { type: "Business Website · Local", name: "Local Business Website", desc: "Clean site for local service businesses with booking, reviews, and local SEO.", thumb: "local", wide: false },
];

const PROCESS_STEPS = [
  { n: "01", icon: "◎", name: "Discovery", desc: "We learn your goals, audience, and what success looks like before anything starts." },
  { n: "02", icon: "⬡", name: "Scope & Plan", desc: "Clear deliverables, timeline, and tech choices agreed before any code is written." },
  { n: "03", icon: "◈", name: "Design", desc: "Figma-first. You see and approve every screen before development begins." },
  { n: "04", icon: "⟨/⟩", name: "Development", desc: "Clean, structured code with weekly demos and full repo access throughout." },
  { n: "05", icon: "▲", name: "Launch", desc: "Deployment, DNS, performance checks, and a handoff you can actually use." },
  { n: "06", icon: "◉", name: "Ongoing", desc: "Updates, additions, and support as your business grows. No abandonment after launch." },
];

const FAQ_ITEMS = [
  { q: "How long does a project take?", a: "Most websites take 3–6 weeks. A focused landing page can be done in 1–2 weeks. More complex platforms typically run 6–10 weeks. We give you a realistic timeline after our first call — not a guess." },
  { q: "Do you provide hosting?", a: "We deploy to Vercel, Netlify, AWS, or your preferred provider. Everything stays in your name. We handle the technical setup and can manage it ongoing if needed." },
  { q: "Can you redesign my existing website?", a: "Yes. We audit what you have, identify what's working, and rebuild with better performance and design — while keeping any SEO value you've already built." },
  { q: "Do you build custom web systems?", a: "Absolutely. Proposal tools, client portals, booking systems, invoice platforms — we scope and build custom web apps designed for maintainability." },
  { q: "Is SEO included?", a: "Technical SEO is built into every project — semantic HTML, heading hierarchy, meta tags, Open Graph, structured data, and fast loading. Content strategy and ongoing SEO are separate." },
  { q: "What's your pricing like?", a: "Pricing depends on scope, not a price list. A landing page and a multi-page platform are very different projects. We'll give you a clear number after understanding what you actually need." },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("4rvin-theme") || "dark"; } catch { return "dark"; }
  });
  const toggle = useCallback(() => {
    setTheme(t => {
      const next = t === "dark" ? "light" : "dark";
      try { localStorage.setItem("4rvin-theme", next); } catch {}
      return next;
    });
  }, []);
  return [theme, toggle, tokens[theme]];
}

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = ["services", "industries", "work", "process", "faq"];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const ob = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.3 }
      );
      ob.observe(el);
      return ob;
    });
    return () => observers.forEach(ob => ob?.disconnect());
  }, []);
  return active;
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); ob.unobserve(el); } },
      { threshold: 0.08 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return [ref, visible];
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function scrollTo(href) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
function GlobalStyles({ tk }) {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; font-size: 16px; }
    body {
      background: ${tk.bg}; color: ${tk.text};
      font-family: 'Outfit', sans-serif; font-weight: 300;
      line-height: 1.65; overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      transition: background 0.35s, color 0.35s;
    }
    body::after {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 999;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");
      background-size: 220px; opacity: 0.38;
    }
    h1, h2, h3, h4 { font-family: 'Outfit', sans-serif; font-weight: 700; line-height: 1.08; letter-spacing: -0.03em; }
    ::selection { background: ${tk.accent}; color: ${tk.accentFg}; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: ${tk.bg}; }
    ::-webkit-scrollbar-thumb { background: ${tk.border2}; border-radius: 2px; }
    a { text-decoration: none; }
    button { font-family: 'Outfit', sans-serif; cursor: pointer; border: none; background: none; }
    .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.65s ease, transform 0.65s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

// ─── REVEAL WRAPPER ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
// The 4 numeral's horizontal bar doubles as the A crossbar.
// Green overlay: left diagonal leg + optional right leg hint = reads "ARVIN" with green, "4RVIN" without.
function Logo({ tk, size = "nav" }) {
  const scale = size === "nav" ? 1 : 0.88;
  const W = 96 * scale, H = 28 * scale;
  const fs = 24 * scale; // font-size for "4RVIN"
  const accentColor = tk.accentText;

  return (
    <svg
      width={W} height={H}
      viewBox={`0 0 96 28`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="4Rvin logo"
      role="img"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* BASE: "4RVIN" in heavy Outfit */}
      <text
        x="0" y="22"
        fontFamily="'Outfit', sans-serif"
        fontWeight="900"
        fontSize={fs}
        fill={tk.text}
        letterSpacing="-1"
      >
        4RVIN
      </text>

      {/*
        DUAL-READING OVERLAY — the green geometry that transforms 4 → A:

        The "4" numeral has:
          - A vertical right stroke (top to bottom right)
          - A horizontal crossbar mid-height
          - A left vertical piece (top portion only)

        To read as "A" we need:
          - Left diagonal leg (bottom-left → top-center) ← GREEN
          - The crossbar already exists in the 4 (shared)
          - Right diagonal leg (top-center → bottom-right) — the 4's right vertical is reused

        So we only need to ADD: the left diagonal stroke from bottom-left to apex
        The horizontal crossbar of the 4 already reads as the A's crossbar.
        A subtle right-diagonal accent reinforces the right leg of the A.
      */}

      {/* Left leg of A — from bottom-left of the 4 up to the apex */}
      <line
        x1="1.5" y1="22.5"
        x2="10" y2="4"
        stroke={accentColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.92"
      />

      {/* Right leg accent — thin, reinforces A reading, sits along the 4's right edge */}
      <line
        x1="10" y1="4"
        x2="17.5" y2="22.5"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ tk, theme, toggleTheme }) {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href) => {
    scrollTo(href);
    setMenuOpen(false);
  };

  const navBg = theme === "dark"
    ? scrolled ? "rgba(7,9,13,0.88)" : "rgba(7,9,13,0.6)"
    : scrolled ? "rgba(244,245,248,0.92)" : "rgba(244,245,248,0.75)";

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: 66, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 44px",
        background: navBg,
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${tk.border}`,
        transition: "background 0.35s, border-color 0.35s",
      }}>
        <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Logo tk={tk} size="nav" />
          <span style={{ width: 1, height: 20, background: tk.border2 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: tk.text2 }}>Studio</span>
        </a>

        {/* Desktop nav */}
        <ul style={{ display: "flex", alignItems: "center", gap: 32, listStyle: "none", margin: 0 }}>
          {NAV_ITEMS.map(item => {
            const id = item.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={e => { e.preventDefault(); handleNav(item.href); }}
                  style={{
                    color: isActive ? tk.text : tk.text2,
                    fontSize: 14, fontWeight: isActive ? 500 : 400,
                    transition: "color 0.2s",
                    fontFamily: "'Outfit', sans-serif",
                    position: "relative",
                  }}
                  onMouseEnter={e => e.target.style.color = tk.text}
                  onMouseLeave={e => e.target.style.color = isActive ? tk.text : tk.text2}
                >
                  {item.label}
                  {isActive && (
                    <span style={{
                      position: "absolute", bottom: -4, left: 0, right: 0,
                      height: 1.5, background: tk.accent, borderRadius: 1,
                    }} />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: tk.surface2, border: `1px solid ${tk.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: tk.text2,
              transition: "background 0.2s, border-color 0.2s, color 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = tk.border2; e.currentTarget.style.color = tk.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.text2; }}
          >
            {theme === "dark" ? "☽" : "☀︎"}
          </button>
          <BtnPrimary tk={tk} href="#cta" onClick={e => { e.preventDefault(); scrollTo("#cta"); }}>
            Let's Talk
          </BtnPrimary>
        </div>
      </nav>

      {/* Mobile menu overlay — simple, accessible */}
      <style>{`
        @media (max-width: 768px) {
          nav ul { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

// ─── BUTTON COMPONENTS ────────────────────────────────────────────────────────
function BtnPrimary({ tk, children, href = "#", onClick, style = {}, small = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        background: tk.accent, color: tk.accentFg,
        padding: small ? "9px 20px" : "13px 28px",
        borderRadius: 100, fontSize: small ? 13 : 14,
        fontWeight: 600, letterSpacing: "0.01em",
        display: "inline-flex", alignItems: "center", gap: 8,
        transition: "transform 0.2s, opacity 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-2px)" : "none",
        opacity: hovered ? 0.9 : 1,
        boxShadow: hovered ? `0 0 44px rgba(184,240,64,0.28)` : `0 0 24px rgba(184,240,64,0.15)`,
        fontFamily: "'Outfit', sans-serif",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
}

function BtnGhost({ tk, children, href = "#", onClick, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        color: hovered ? tk.text : tk.text2,
        padding: "13px 22px", borderRadius: 100,
        fontSize: 14, fontWeight: 400,
        border: `1px solid ${hovered ? tk.border2 : tk.border2}`,
        display: "inline-flex", alignItems: "center", gap: 8,
        transition: "color 0.2s, border-color 0.2s",
        fontFamily: "'Outfit', sans-serif",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function SectionLabel({ tk, children, center = false }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
      color: tk.accentText, marginBottom: 18,
      ...(center ? { justifyContent: "center" } : {}),
    }}>
      {!center && <span style={{ width: 18, height: 1, background: "currentColor", opacity: 0.7 }} />}
      {children}
    </div>
  );
}

// ─── ARROW ICON ──────────────────────────────────────────────────────────────
function ArrowIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <path d="M1 6.5h11M7.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── HERO VISUAL MOCKUPS ──────────────────────────────────────────────────────
function HeroVisual({ tk }) {
  const dark = {
    navBg: "#04060a", heroBg: "linear-gradient(155deg,#0f1e30 0%,#0b1520 100%)",
    cardBg: "#070c14", saasHeaderBg: "#040810",
  };

  return (
    <div style={{ position: "relative", height: 480, flexShrink: 0 }}>
      {/* Tech badge */}
      <div style={{
        position: "absolute", left: 55, top: 0,
        background: tk.bg2, border: `1px solid ${tk.border2}`,
        borderRadius: 11, padding: "11px 15px",
        boxShadow: tk.shadow,
        animation: "fc 5s ease-in-out infinite",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: tk.bg3, border: `1px solid ${tk.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: tk.text }}>▲</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: tk.text, lineHeight: 1.3 }}>Next.js 14</div>
          <div style={{ fontSize: 9, color: tk.text2, fontFamily: "'JetBrains Mono', monospace" }}>SSR · Static · Edge</div>
        </div>
      </div>

      {/* Main analytics browser */}
      <div style={{
        position: "absolute", right: 0, top: 20, width: 355,
        borderRadius: 13, overflow: "hidden",
        background: tk.bg3, border: `1px solid ${tk.border2}`,
        boxShadow: tk.shadow,
        animation: "fa 7s ease-in-out infinite",
      }}>
        {/* Browser bar */}
        <div style={{ height: 33, background: tk.bg2, borderBottom: `1px solid ${tk.border}`, display: "flex", alignItems: "center", padding: "0 12px", gap: 5 }}>
          {[["#ff5f56"], ["#ffbd2e"], ["#27c93f"]].map(([c], i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
          ))}
          <div style={{ flex: 1, marginLeft: 10, background: tk.bg, borderRadius: 5, height: 19, display: "flex", alignItems: "center", padding: "0 8px", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: tk.text3 }}>
            dashboard.yourbiz.io
          </div>
        </div>
        {/* Dashboard content */}
        <div style={{ padding: "14px 14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
            {[true, false, false].map((hi, i) => (
              <div key={i} style={{ borderRadius: 8, padding: 10, background: tk.surface, border: `1px solid ${tk.border}` }}>
                <div style={{ height: 8, borderRadius: 3, background: hi ? `rgba(184,240,64,0.6)` : "rgba(255,255,255,0.45)", marginBottom: 5, width: hi ? "65%" : "55%" }} />
                <div style={{ height: 4, borderRadius: 2, background: tk.border2, width: "70%" }} />
              </div>
            ))}
          </div>
          {/* Chart */}
          <div style={{ borderRadius: 9, background: tk.surface, border: `1px solid ${tk.border}`, padding: "10px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ height: 5, width: 70, borderRadius: 2, background: "rgba(255,255,255,0.35)" }} />
              <div style={{ height: 12, width: 36, borderRadius: 100, background: `rgba(184,240,64,0.22)` }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 48 }}>
              {[38, 55, 42, 75, 58, 88, 65].map((h, i) => (
                <div key={i} style={{ flex: 1, borderRadius: "3px 3px 0 0", height: `${h}%`, background: [3, 5].includes(i) ? "rgba(184,240,64,0.75)" : "rgba(91,156,246,0.6)", opacity: [3, 5].includes(i) ? 1 : 0.7 }} />
              ))}
            </div>
          </div>
          {/* Table */}
          <div style={{ borderRadius: 8, overflow: "hidden", background: tk.surface, border: `1px solid ${tk.border}` }}>
            {[{ hd: true }, {}, { hi: true }, {}, { hi: true }].map((row, i) => (
              <div key={i} style={{ height: 18, display: "flex", alignItems: "center", padding: "0 9px", gap: 8, borderBottom: i < 4 ? `1px solid ${tk.border}` : "none", background: row.hd ? tk.surface2 : "transparent" }}>
                {[1, 1, row.hi ? 0.5 : 1].map((flex, j) => (
                  <div key={j} style={{ height: 4, borderRadius: 2, flex, background: row.hi && j === 2 ? "rgba(184,240,64,0.45)" : row.hd ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)" }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CRM pipeline float card */}
      <div style={{
        position: "absolute", left: -10, bottom: 50, width: 188,
        background: tk.bg2, backdropFilter: "blur(20px)",
        border: `1px solid ${tk.border2}`, borderRadius: 13, padding: 16,
        boxShadow: "0 20px 55px rgba(0,0,0,0.42)",
        animation: "fb 6s ease-in-out infinite",
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: tk.text2, marginBottom: 12 }}>CRM PIPELINE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[["#5b9cf6", 80, 8], ["#a78bfa", 55, 5], ["#b8f040", 35, 3], ["#fb923c", 20, 2]].map(([color, pct, count], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
              <div style={{ flex: 1, height: 5, borderRadius: 3, background: tk.surface2, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, opacity: 0.65 }} />
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: tk.text3, width: 16, textAlign: "right" }}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fa { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fb { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-7px) rotate(-2deg)} }
        @keyframes fc { 0%,100%{transform:translateY(0) rotate(1.5deg)} 50%{transform:translateY(-5px) rotate(1.5deg)} }
      `}</style>
    </div>
  );
}

// ─── SECTION: HERO ────────────────────────────────────────────────────────────
function HeroSection({ tk }) {
  return (
    <section style={{ minHeight: "100vh", padding: "130px 44px 90px", position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Grid background */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${tk.border} 1px, transparent 1px), linear-gradient(90deg, ${tk.border} 1px, transparent 1px)`,
        backgroundSize: "54px 54px",
        maskImage: "radial-gradient(ellipse 75% 55% at 50% 0%, black 0%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 55% at 50% 0%, black 0%, transparent 80%)",
      }} />
      {/* Glow */}
      <div aria-hidden style={{
        position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 1000, height: 700, pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(184,240,64,0.055) 0%, rgba(91,156,246,0.035) 40%, transparent 70%)",
      }} />

      <div style={{ maxWidth: 1160, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 1 }}>
        <div>
          {/* Pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: tk.surface2, border: `1px solid ${tk.border2}`, borderRadius: 100, padding: "5px 14px 5px 8px", fontSize: 11, color: tk.text2, marginBottom: 26, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", animation: "blink 2.4s ease-in-out infinite" }} />
            Open for new projects
          </div>
          <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>

          <h1 style={{ fontSize: "clamp(40px, 5vw, 70px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.04, marginBottom: 22, color: tk.text }}>
            Building modern<br />digital systems<br />
            <span style={{ fontWeight: 200, color: tk.text2 }}>for growing businesses.</span>
          </h1>

          <p style={{ fontSize: 17, color: tk.text2, fontWeight: 300, lineHeight: 1.72, maxWidth: 430, marginBottom: 38 }}>
            We design and develop fast websites, web platforms, and business tools — clean code, SEO-ready, built to last.
          </p>

          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <BtnPrimary tk={tk} href="#cta" onClick={e => { e.preventDefault(); scrollTo("#cta"); }}>
              Discuss Your Idea <ArrowIcon />
            </BtnPrimary>
            <BtnGhost tk={tk} href="#work" onClick={e => { e.preventDefault(); scrollTo("#work"); }}>
              See our work
            </BtnGhost>
          </div>
        </div>
        <HeroVisual tk={tk} />
      </div>

      <style>{`@media(max-width:1024px){.hero-grid-inner{grid-template-columns:1fr!important}.hero-visual{display:none!important}}`}</style>
    </section>
  );
}

// ─── SECTION: CAPABILITIES ────────────────────────────────────────────────────
function CapabilitiesSection({ tk }) {
  return (
    <div style={{ borderTop: `1px solid ${tk.border}`, borderBottom: `1px solid ${tk.border}`, background: tk.bg2 }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 44px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: tk.border }}>
        {CAPABILITIES.map((cap, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div style={{ background: tk.bg2, padding: "30px 32px", transition: "background 0.25s", cursor: "default" }}
              onMouseEnter={e => e.currentTarget.style.background = tk.bg3}
              onMouseLeave={e => e.currentTarget.style.background = tk.bg2}>
              <div style={{ fontSize: 18, marginBottom: 10 }}>{cap.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 5, color: tk.text }}>{cap.name}</div>
              <div style={{ fontSize: 12.5, color: tk.text2, lineHeight: 1.55 }}>{cap.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION: SERVICES ────────────────────────────────────────────────────────
function ServicesSection({ tk }) {
  return (
    <section id="services" style={{ borderTop: `1px solid ${tk.border}` }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "120px 44px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>
          <Reveal>
            <div style={{ position: "sticky", top: 110 }}>
              <SectionLabel tk={tk}>What we build</SectionLabel>
              <h2 style={{ fontSize: "clamp(30px,3.6vw,50px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 14, color: tk.text }}>
                Every tool your business needs online.
              </h2>
              <p style={{ fontSize: 16, color: tk.text2, fontWeight: 300, lineHeight: 1.72, maxWidth: 300, marginBottom: 32 }}>
                From a first website to a fully custom platform — design, development, and everything in between.
              </p>
              <BtnPrimary tk={tk} href="#cta" onClick={e => { e.preventDefault(); scrollTo("#cta"); }} style={{ fontSize: 13.5 }}>
                Build Your Website <ArrowIcon />
              </BtnPrimary>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: tk.border, border: `1px solid ${tk.border}`, borderRadius: 14, overflow: "hidden" }}>
            {SERVICES.map((svc, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div
                  style={{ background: tk.bg, padding: "26px 24px", cursor: "default", transition: "background 0.25s", position: "relative", overflow: "hidden" }}
                  onMouseEnter={e => { e.currentTarget.style.background = tk.bg2; }}
                  onMouseLeave={e => { e.currentTarget.style.background = tk.bg; }}
                >
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: tk.text3, letterSpacing: "0.1em", marginBottom: 14 }}>{svc.n}</div>
                  <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 6, color: tk.text }}>{svc.name}</div>
                  <div style={{ fontSize: 12, color: tk.text2, lineHeight: 1.55 }}>{svc.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION: TECH ────────────────────────────────────────────────────────────
function TechSection({ tk }) {
  return (
    <section id="tech" style={{ borderTop: `1px solid ${tk.border}`, background: tk.bg2 }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 44px" }}>
        <Reveal>
          <SectionLabel tk={tk}>Technology</SectionLabel>
          <h2 style={{ fontSize: "clamp(30px,3.6vw,50px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 14, color: tk.text }}>Our stack.</h2>
          <p style={{ fontSize: 16, color: tk.text2, fontWeight: 300, lineHeight: 1.72, maxWidth: 500, marginBottom: 52 }}>
            Production-grade tech across front-end, back-end, databases, and infrastructure.
          </p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: tk.border, border: `1px solid ${tk.border}`, borderRadius: 14, overflow: "hidden" }}>
          {TECH_CATEGORIES.map((cat, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div style={{ background: tk.bg2, padding: "28px 26px" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: tk.text3, marginBottom: 18 }}>{cat.label}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {cat.pills.map((pill, j) => (
                    <span key={j} style={{ fontSize: 12, fontWeight: 500, color: tk.text2, background: tk.surface2, border: `1px solid ${tk.border}`, borderRadius: 100, padding: "5px 13px", transition: "border-color 0.2s, color 0.2s", cursor: "default" }}
                      onMouseEnter={e => { e.target.style.borderColor = tk.border2; e.target.style.color = tk.text; }}
                      onMouseLeave={e => { e.target.style.borderColor = tk.border; e.target.style.color = tk.text2; }}>
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION: INDUSTRIES ─────────────────────────────────────────────────────
function IndustriesSection({ tk }) {
  return (
    <section id="industries" style={{ borderTop: `1px solid ${tk.border}` }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "120px 44px" }}>
        <Reveal>
          <SectionLabel tk={tk}>Industries we build for</SectionLabel>
          <h2 style={{ fontSize: "clamp(30px,3.6vw,50px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 14, color: tk.text }}>Solutions for modern industries.</h2>
          <p style={{ fontSize: 16, color: tk.text2, fontWeight: 300, lineHeight: 1.72, maxWidth: 520, marginBottom: 52 }}>
            We design and develop digital solutions for businesses across multiple industries and markets.
          </p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div
                style={{ border: `1px solid ${tk.border}`, borderRadius: 14, padding: "34px 30px", background: tk.surface, cursor: "default", transition: "border-color 0.3s, transform 0.3s, background 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = tk.border2; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = tk.surface2; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.background = tk.surface; }}
              >
                <span style={{ fontSize: 28, marginBottom: 18, display: "block" }}>{ind.icon}</span>
                <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, letterSpacing: "-0.02em", color: tk.text }}>{ind.name}</div>
                <div style={{ fontSize: 13.5, color: tk.text2, lineHeight: 1.6, marginBottom: 20 }}>{ind.desc}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ind.tags.map((tag, j) => (
                    <span key={j} style={{ fontSize: 11, padding: "3px 11px", borderRadius: 100, border: `1px solid ${tk.border2}`, color: tk.text2, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.03em" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WORK THUMB COMPONENTS ────────────────────────────────────────────────────
function ThumbContractor() {
  return (
    <div style={{ height: "100%", background: "#0b1520", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 29, background: "#06080f", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 14px", gap: 18 }}>
        <div style={{ width: 38, height: 6, background: "rgba(255,255,255,0.65)", borderRadius: 2 }} />
        <div style={{ display: "flex", gap: 9, marginLeft: "auto" }}>
          {[1,2,3].map(k => <div key={k} style={{ width: 20, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />)}
        </div>
        <div style={{ width: 44, height: 14, borderRadius: 100, background: "rgba(184,240,64,0.5)" }} />
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "linear-gradient(155deg,#0f1e30 0%,#0b1520 100%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px 18px 14px" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(-55deg, rgba(255,255,255,0.008) 0, rgba(255,255,255,0.008) 1px, transparent 1px, transparent 16px)" }} />
        <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(184,240,64,0.9)", borderRadius: 4, padding: "3px 8px", fontSize: 8, fontWeight: 700, color: "#080b0f", letterSpacing: "0.06em" }}>CONTRACTOR</div>
        <div style={{ height: 9, width: "82%", background: "rgba(255,255,255,0.78)", borderRadius: 3, marginBottom: 6, position: "relative", zIndex: 1 }} />
        <div style={{ height: 5, width: "58%", background: "rgba(255,255,255,0.28)", borderRadius: 3, marginBottom: 11, position: "relative", zIndex: 1 }} />
        <div style={{ display: "flex", gap: 7, position: "relative", zIndex: 1 }}>
          <div style={{ height: 18, width: 74, background: "rgba(184,240,64,0.85)", borderRadius: 100 }} />
          <div style={{ height: 18, width: 60, borderRadius: 100, border: "1px solid rgba(255,255,255,0.28)" }} />
        </div>
      </div>
      <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
        {[["rgba(255,255,255,0.14)"],["rgba(184,240,64,0.28)"],["rgba(91,156,246,0.28)"]].map(([bg], k) => (
          <div key={k} style={{ height: 38, borderRadius: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", padding: "7px 9px" }}>
            <div style={{ width: 12, height: 12, borderRadius: 4, background: bg, marginBottom: 5 }} />
            <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.09)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbDashboard() {
  return (
    <div style={{ height: "100%", background: "#070c14", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 28, background: "#040709", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 12px", gap: 10 }}>
        <div style={{ width: 20, height: 20, borderRadius: 5, background: "linear-gradient(135deg,rgba(184,240,64,0.7),rgba(91,156,246,0.5))", flexShrink: 0 }} />
        <div style={{ width: 32, height: 5, borderRadius: 2, background: "rgba(255,255,255,0.45)" }} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "linear-gradient(135deg,#fb923c,#f472b6)" }} />
      </div>
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ width: "26%", borderRight: "1px solid rgba(255,255,255,0.05)", padding: "9px 8px", display: "flex", flexDirection: "column", gap: 5 }}>
          {[true,false,false,false].map((act,k) => (
            <div key={k} style={{ height: 19, borderRadius: 6, display: "flex", alignItems: "center", padding: "0 7px", gap: 5, background: act ? "rgba(184,240,64,0.1)" : "transparent" }}>
              <div style={{ width: 5, height: 5, borderRadius: 2, background: act ? "rgba(184,240,64,0.8)" : "rgba(255,255,255,0.15)" }} />
              <div style={{ height: 3, borderRadius: 2, flex: 1, background: act ? "rgba(184,240,64,0.35)" : "rgba(255,255,255,0.08)" }} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: "9px 11px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ height: 7, width: "55%", borderRadius: 2, background: "rgba(255,255,255,0.5)" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[true,false].map((hi,k) => (
              <div key={k} style={{ height: 33, borderRadius: 7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "7px 8px" }}>
                <div style={{ height: 6, width: 44, borderRadius: 2, background: hi ? "rgba(184,240,64,0.5)" : "rgba(255,255,255,0.38)", marginBottom: 5 }} />
                <div style={{ height: 3, width: 30, borderRadius: 2, background: "rgba(255,255,255,0.1)" }} />
              </div>
            ))}
          </div>
          <div style={{ flex: 1, borderRadius: 7, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            {[{hd:true},{hi:false},{hi:true},{hi:false}].map((row,k) => (
              <div key={k} style={{ height: 16, display: "flex", alignItems: "center", padding: "0 7px", gap: 7, borderBottom: k<3 ? "1px solid rgba(255,255,255,0.04)" : "none", background: row.hd ? "rgba(255,255,255,0.04)" : "transparent" }}>
                {[1,1,row.hi?0.55:1].map((flex,j) => (
                  <div key={j} style={{ height: 3, borderRadius: 2, flex, background: row.hi&&j===2 ? "rgba(184,240,64,0.38)" : row.hd ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)" }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThumbSaas() {
  return (
    <div style={{ height: "100%", background: "#06101e", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 28, background: "#040810", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#5b9cf6,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>S</div>
        <div style={{ width: 32, height: 5, borderRadius: 2, background: "rgba(255,255,255,0.4)" }} />
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 6 }}>
          {[true,false,false,false].map((act,k) => <div key={k} style={{ width: 28, height: 5, borderRadius: 2, background: act ? "rgba(184,240,64,0.45)" : "rgba(255,255,255,0.1)" }} />)}
        </div>
      </div>
      <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 9 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7 }}>
          {["rgba(184,240,64,0.5)","rgba(91,156,246,0.5)","rgba(251,146,60,0.45)","rgba(255,255,255,0.42)"].map((bg,k) => (
            <div key={k} style={{ height: 42, borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "8px 10px" }}>
              <div style={{ height: 7, width: 42, borderRadius: 2, background: bg, marginBottom: 5 }} />
              <div style={{ height: 3, width: 28, borderRadius: 2, background: "rgba(255,255,255,0.1)" }} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "9px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
            <div style={{ height: 5, width: 65, borderRadius: 2, background: "rgba(255,255,255,0.35)" }} />
            <div style={{ height: 13, width: 35, borderRadius: 100, background: "rgba(184,240,64,0.18)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 50 }}>
            {[40,60,45,82,55,92,68,76].map((h,k) => (
              <div key={k} style={{ flex: 1, borderRadius: "3px 3px 0 0", height: `${h}%`, background: [3,5].includes(k) ? "rgba(184,240,64,0.65)" : "rgba(91,156,246,0.45)" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThumbStartup() {
  return (
    <div style={{ height: "100%", background: "#040910", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 27, background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 12px" }}>
        <div style={{ width: 46, height: 5, borderRadius: 2, background: "rgba(255,255,255,0.55)" }} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 7, alignItems: "center" }}>
          {[1,2].map(k => <div key={k} style={{ width: 20, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />)}
          <div style={{ height: 13, width: 40, borderRadius: 100, background: "rgba(91,156,246,0.55)" }} />
        </div>
      </div>
      <div style={{ flex: "0 0 105px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 6, background: "radial-gradient(ellipse at 50% 50%, rgba(91,156,246,0.1), transparent 65%)" }}>
        <div style={{ height: 12, width: 76, borderRadius: 100, background: "rgba(91,156,246,0.18)", border: "1px solid rgba(91,156,246,0.25)" }} />
        <div style={{ height: 10, width: "72%", background: "rgba(255,255,255,0.72)", borderRadius: 3 }} />
        <div style={{ height: 6, width: "52%", background: "rgba(255,255,255,0.22)", borderRadius: 3 }} />
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ height: 17, width: 62, borderRadius: 100, background: "rgba(91,156,246,0.65)" }} />
          <div style={{ height: 17, width: 52, borderRadius: 100, border: "1px solid rgba(255,255,255,0.2)" }} />
        </div>
      </div>
      <div style={{ padding: "8px 12px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
        {["rgba(91,156,246,0.5)","rgba(184,240,64,0.4)","rgba(251,146,60,0.4)"].map((bg,k) => (
          <div key={k} style={{ height: 28, borderRadius: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: k===0?4:k===1?"50%":3, background: bg }} />
            <div style={{ height: 3, width: 26, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbLocal() {
  return (
    <div style={{ height: "100%", background: "#090e0b", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 27, background: "#060809", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 12px" }}>
        <div style={{ width: 30, height: 5, borderRadius: 2, background: "rgba(255,255,255,0.55)" }} />
        <div style={{ height: 12, width: 32, borderRadius: 100, background: "rgba(127,255,154,0.25)", marginLeft: "auto" }} />
      </div>
      <div style={{ flex: "0 0 85px", background: "linear-gradient(155deg,#0e1a0c,#15200f)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 16px", gap: 5 }}>
        <div style={{ height: 4, width: 46, borderRadius: 2, background: "rgba(127,255,154,0.45)" }} />
        <div style={{ height: 8, width: "78%", borderRadius: 3, background: "rgba(255,255,255,0.75)" }} />
        <div style={{ height: 4, width: "52%", borderRadius: 2, background: "rgba(255,255,255,0.22)" }} />
        <div style={{ height: 14, width: 54, borderRadius: 100, background: "rgba(127,255,154,0.45)", marginTop: 2 }} />
      </div>
      <div style={{ flex: 1, padding: "8px 12px", display: "flex", gap: 8 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ height: 28, borderRadius: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
          <div style={{ flex: 1, borderRadius: 7, background: "linear-gradient(135deg,rgba(127,255,154,0.05),rgba(91,156,246,0.03))", border: "1px solid rgba(255,255,255,0.05)" }} />
        </div>
        <div style={{ flex: "0 0 84px", display: "flex", flexDirection: "column", gap: 5 }}>
          {[[5],[4],[4]].map(([stars],k) => (
            <div key={k} style={{ height: 20, borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 6px", gap: 4 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({length:stars}).map((_,j) => <div key={j} style={{ width: 5, height: 5, borderRadius: 1, background: "rgba(255,190,0,0.6)" }} />)}
              </div>
              <div style={{ height: 3, flex: 1, borderRadius: 2, background: "rgba(255,255,255,0.09)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const THUMB_MAP = { contractor: ThumbContractor, dashboard: ThumbDashboard, saas: ThumbSaas, startup: ThumbStartup, local: ThumbLocal };

// ─── SECTION: WORK ────────────────────────────────────────────────────────────
function WorkSection({ tk }) {
  return (
    <section id="work" style={{ borderTop: `1px solid ${tk.border}`, background: tk.bg2 }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "120px 44px" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52 }}>
            <div>
              <SectionLabel tk={tk}>Concept work</SectionLabel>
              <h2 style={{ fontSize: "clamp(30px,3.6vw,50px)", fontWeight: 800, letterSpacing: "-0.04em", color: tk.text }}>Projects we build.</h2>
            </div>
            <p style={{ fontSize: 14.5, color: tk.text2, fontWeight: 300, lineHeight: 1.7, maxWidth: 260 }}>
              Types of projects we design and develop — from business sites to SaaS interfaces.
            </p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {WORK_ITEMS.map((item, i) => {
            const ThumbComp = THUMB_MAP[item.thumb];
            return (
              <Reveal key={i} delay={i * 0.06} style={{ gridColumn: item.wide ? "span 2" : "span 1" }}>
                <WorkCard tk={tk} item={item} ThumbComp={ThumbComp} height={item.wide ? 260 : 200} />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ tk, item, ThumbComp, height }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        borderRadius: 14, overflow: "hidden", border: `1px solid ${hovered ? tk.border2 : tk.border}`,
        background: tk.bg, cursor: "pointer",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? tk.shadow : "none",
        transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ height, position: "relative", overflow: "hidden" }}>
        <ThumbComp />
      </div>
      <div style={{ padding: "20px 22px", borderTop: `1px solid ${tk.border}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: tk.accentText, marginBottom: 5 }}>{item.type}</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: tk.text }}>{item.name}</div>
        <div style={{ fontSize: 13, color: tk.text2 }}>{item.desc}</div>
      </div>
    </div>
  );
}

// ─── SECTION: PROCESS ─────────────────────────────────────────────────────────
function ProcessSection({ tk }) {
  return (
    <section id="process" style={{ borderTop: `1px solid ${tk.border}` }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "120px 44px" }}>
        <Reveal>
          <SectionLabel tk={tk}>How we work</SectionLabel>
          <h2 style={{ fontSize: "clamp(30px,3.6vw,50px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 56, color: tk.text }}>
            Clear process,<br />no surprises.
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 1, background: tk.border, border: `1px solid ${tk.border}`, borderRadius: 14, overflow: "hidden" }}>
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <ProcessCard tk={tk} step={step} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessCard({ tk, step }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ background: hovered ? tk.bg2 : tk.bg, padding: "34px 22px", position: "relative", overflow: "hidden", transition: "background 0.25s", cursor: "default" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${tk.accent}, rgba(184,240,64,0.4))`, opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }} />
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: tk.text3, letterSpacing: "0.1em", marginBottom: 16 }}>{step.n}</div>
      <span style={{ fontSize: 22, marginBottom: 13, display: "block" }}>{step.icon}</span>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 7, color: tk.text }}>{step.name}</div>
      <div style={{ fontSize: 12, color: tk.text2, lineHeight: 1.55 }}>{step.desc}</div>
    </div>
  );
}

// ─── SECTION: FAQ ─────────────────────────────────────────────────────────────
function FaqSection({ tk }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="faq" style={{ borderTop: `1px solid ${tk.border}`, background: tk.bg2 }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "120px 44px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 80, alignItems: "start" }}>
          <Reveal>
            <SectionLabel tk={tk}>FAQ</SectionLabel>
            <h3 style={{ fontSize: "clamp(24px,2.8vw,38px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 14, color: tk.text }}>
              Good questions deserve clear answers.
            </h3>
            <p style={{ fontSize: 15, color: tk.text2, lineHeight: 1.7, marginBottom: 28, fontWeight: 300 }}>
              No agency jargon. These are the real questions people ask us before getting started.
            </p>
            <BtnPrimary tk={tk} href="mailto:hello@4rvin.studio" style={{ fontSize: 13.5 }}>
              Ask us directly <ArrowIcon size={12} />
            </BtnPrimary>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: tk.border, border: `1px solid ${tk.border}`, borderRadius: 14, overflow: "hidden" }}>
              {FAQ_ITEMS.map((item, i) => (
                <FaqItem key={i} tk={tk} item={item} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ tk, item, open, onToggle }) {
  return (
    <div style={{ background: open ? tk.bg3 : tk.bg }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: "100%", padding: "19px 22px", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14,
          fontWeight: 600, fontSize: 14.5, color: tk.text, textAlign: "left",
          background: "transparent", border: "none", fontFamily: "'Outfit', sans-serif",
        }}
      >
        {item.q}
        <span style={{
          width: 21, height: 21, borderRadius: "50%",
          border: `1px solid ${open ? tk.accent : tk.border2}`,
          background: open ? tk.accent : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: open ? tk.accentFg : tk.text2, flexShrink: 0,
          transform: open ? "rotate(45deg)" : "none",
          transition: "transform 0.3s, background 0.2s, border-color 0.2s, color 0.2s",
        }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 250 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ padding: "0 22px 18px", fontSize: 14, color: tk.text2, lineHeight: 1.72 }}>{item.a}</div>
      </div>
    </div>
  );
}

// ─── SECTION: CTA ─────────────────────────────────────────────────────────────
function CtaSection({ tk }) {
  return (
    <section id="cta" style={{ borderTop: `1px solid ${tk.border}`, padding: "130px 44px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 380, pointerEvents: "none", background: "radial-gradient(ellipse, rgba(184,240,64,0.055), rgba(91,156,246,0.03) 40%, transparent 70%)" }} />
      <Reveal style={{ position: "relative", zIndex: 1 }}>
        <SectionLabel tk={tk} center>Ready to build?</SectionLabel>
        <h2 style={{ fontSize: "clamp(36px,4.2vw,58px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.06, maxWidth: 700, margin: "0 auto 18px", color: tk.text }}>
          Launch your platform.<br />
          <span style={{ fontWeight: 300, color: tk.text2 }}>Let's build something modern.</span>
        </h2>
        <p style={{ fontSize: 17, color: tk.text2, fontWeight: 300, marginBottom: 42 }}>
          Tell us about your project — we'll get back to you within 24 hours.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <BtnPrimary tk={tk} href="mailto:hello@4rvin.studio">
            Let's Talk <ArrowIcon />
          </BtnPrimary>
          <BtnGhost tk={tk} href="mailto:hello@4rvin.studio">
            hello@4rvin.studio
          </BtnGhost>
        </div>
        {/* Contact chips */}
        <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {["Book a Call", "Start Your Project", "Build With Us"].map((label, i) => (
            <a key={i} href="mailto:hello@4rvin.studio" style={{ fontSize: 12, padding: "6px 16px", borderRadius: 100, border: `1px solid ${tk.border2}`, color: tk.text2, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em", transition: "color 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { e.target.style.color = tk.text; e.target.style.borderColor = tk.border2; }}
              onMouseLeave={e => { e.target.style.color = tk.text2; }}>
              {label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ tk }) {
  return (
    <footer style={{ borderTop: `1px solid ${tk.border}`, padding: "56px 44px 34px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 44, marginBottom: 48 }}>
          <div>
            <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <Logo tk={tk} size="footer" />
              <span style={{ width: 1, height: 20, background: tk.border2 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: tk.text2 }}>Studio</span>
            </a>
            <p style={{ fontSize: 13, color: tk.text2, lineHeight: 1.7, maxWidth: 200, marginTop: 13, fontWeight: 300 }}>
              A modern digital studio building websites, platforms, and web systems for businesses ready to grow.
            </p>
            <a href="mailto:hello@4rvin.studio" style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 16, fontSize: 13, color: tk.text2, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = tk.text}
              onMouseLeave={e => e.currentTarget.style.color = tk.text2}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="3" width="11" height="7" rx="1.2"/><path d="M1 4.5l5.5 3 5.5-3"/></svg>
              hello@4rvin.studio
            </a>
          </div>
          {[
            { title: "Studio", links: [{ label: "Services", href: "#services" }, { label: "Work", href: "#work" }, { label: "Process", href: "#process" }, { label: "FAQ", href: "#faq" }] },
            { title: "Build", links: [{ label: "Website Development", href: "#cta" }, { label: "Landing Pages", href: "#cta" }, { label: "Branding", href: "#cta" }, { label: "Web Platforms", href: "#cta" }] },
            { title: "Contact", links: [{ label: "Discuss Your Idea", href: "#cta" }, { label: "Send an Email", href: "mailto:hello@4rvin.studio" }, { label: "LinkedIn", href: "#" }, { label: "Twitter / X", href: "#" }] },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: "0.02em", marginBottom: 16, color: tk.text }}>{col.title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href={link.href}
                      onClick={link.href.startsWith("#") ? e => { e.preventDefault(); scrollTo(link.href); } : undefined}
                      style={{ fontSize: 13, color: tk.text2, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = tk.text}
                      onMouseLeave={e => e.target.style.color = tk.text2}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 26, borderTop: `1px solid ${tk.border}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: tk.text3 }}>© 2025 4Rvin Studio — All rights reserved</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["𝕏","in","gh","be"].map((s, i) => (
              <a key={i} href="#" style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${tk.border}`, background: tk.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: tk.text2, textDecoration: "none", transition: "border-color 0.2s, background 0.2s, color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = tk.border2; e.currentTarget.style.background = tk.surface2; e.currentTarget.style.color = tk.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.background = tk.surface; e.currentTarget.style.color = tk.text2; }}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, toggleTheme, tk] = useTheme();

  return (
    <>
      <GlobalStyles tk={tk} />
      <Nav tk={tk} theme={theme} toggleTheme={toggleTheme} />
      <main>
        <HeroSection tk={tk} />
        <CapabilitiesSection tk={tk} />
        <ServicesSection tk={tk} />
        <TechSection tk={tk} />
        <IndustriesSection tk={tk} />
        <WorkSection tk={tk} />
        <ProcessSection tk={tk} />
        <FaqSection tk={tk} />
        <CtaSection tk={tk} />
      </main>
      <Footer tk={tk} />
    </>
  );
}
