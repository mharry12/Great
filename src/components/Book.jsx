import React, { useState, useEffect, useRef } from "react";
import ProfileImage from "../assets/noon.jpeg";
import ChaseLogo from "../assets/chase logo 2.png";
import PlusImage from "../assets/plus.png";

const TRANSACTIONS = [
  { id: 1,  icon: "ti-bolt",              bg: "bg-yellow-100", color: "text-yellow-600", label: "Electricity Bill", sub: "Con Edison",              amount: -12400,  date: "Jun 22", category: "electricity" },
  { id: 2,  icon: "ti-droplet",           bg: "bg-blue-100",   color: "text-blue-600",   label: "Water Bill",       sub: "NYC Water Board",         amount: -4200,   date: "Jun 20", category: "water"       },
  { id: 3,  icon: "ti-player-play",       bg: "bg-red-100",    color: "text-red-600",    label: "Netflix",          sub: "Monthly Subscription",    amount: -4900,   date: "Jun 19", category: "bills"       },
  { id: 4,  icon: "ti-send",              bg: "bg-violet-100", color: "text-violet-600", label: "Zelle Transfer",   sub: "To: Michael A.",          amount: -50000,  date: "Jun 18", category: "transfer"    },
  { id: 5,  icon: "ti-device-mobile",     bg: "bg-orange-100", color: "text-orange-600", label: "Phone Bill",       sub: "Verizon Monthly Plan",    amount: -8500,   date: "Jun 16", category: "phone"       },
  { id: 6,  icon: "ti-arrow-down-circle", bg: "bg-green-100",  color: "text-green-600",  label: "Deposit",          sub: "Direct Deposit",          amount: 200000,  date: "Jun 15", category: "transfer"    },
  { id: 7,  icon: "ti-wifi",              bg: "bg-sky-100",    color: "text-sky-600",    label: "Internet Bill",    sub: "Xfinity Broadband",       amount: -15000,  date: "Jun 13", category: "bills"       },
  { id: 8,  icon: "ti-bolt",              bg: "bg-yellow-100", color: "text-yellow-600", label: "Electricity Bill", sub: "Con Edison",              amount: -11800,  date: "Jun 10", category: "electricity" },
  { id: 9,  icon: "ti-music",             bg: "bg-green-100",  color: "text-green-600",  label: "Spotify",          sub: "Premium Subscription",    amount: -3200,   date: "Jun 9",  category: "bills"       },
  { id: 10, icon: "ti-send",              bg: "bg-violet-100", color: "text-violet-600", label: "Zelle Transfer",   sub: "To: Sarah K.",            amount: -25000,  date: "Jun 8",  category: "transfer"    },
  { id: 11, icon: "ti-droplet",           bg: "bg-blue-100",   color: "text-blue-600",   label: "Water Bill",       sub: "NYC Water Board",         amount: -3900,   date: "Jun 5",  category: "water"       },
  { id: 12, icon: "ti-home",              bg: "bg-purple-100", color: "text-purple-600", label: "Rent Payment",     sub: "Manhattan Apt · Unit 4B", amount: -350000, date: "Jun 1",  category: "bills"       },
];

// ── SVG brand icons for Open an Account cards ──────────────────────────────
const AccountIcons = {
  CreditCards: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="3" fill="#7c3aed" opacity="0.15"/>
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="#7c3aed" strokeWidth="1.8"/>
      <path d="M2 9h20" stroke="#7c3aed" strokeWidth="1.8"/>
      <rect x="5" y="13" width="5" height="2.5" rx="0.8" fill="#7c3aed"/>
      <circle cx="18" cy="14.5" r="2" fill="#7c3aed" opacity="0.4"/>
      <circle cx="20" cy="14.5" r="2" fill="#7c3aed" opacity="0.7"/>
    </svg>
  ),
  Business: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="10" width="18" height="11" rx="2" stroke="#15803d" strokeWidth="1.8"/>
      <path d="M8 10V7a4 4 0 018 0v3" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M3 15h18" stroke="#15803d" strokeWidth="1.5" strokeDasharray="2 2"/>
      <rect x="10" y="13" width="4" height="4" rx="1" fill="#15803d" opacity="0.5"/>
    </svg>
  ),
  Savings: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M19 11c0 4.42-3.13 8-7 8s-7-3.58-7-8a7 7 0 0114 0z" stroke="#b45309" strokeWidth="1.8"/>
      <path d="M12 7v4l2.5 2.5" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M19 5l1.5-1.5M5 5L3.5 3.5" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 3h6" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Investments: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <polyline points="4,17 9,12 13,15 20,7" stroke="#0369a1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="7" r="2" fill="#0369a1"/>
      <path d="M4 20h16" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 7v13" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Mortgage: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5" stroke="#9d174d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 9v11h14V9" stroke="#9d174d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="9" y="14" width="6" height="6" rx="1" stroke="#9d174d" strokeWidth="1.5"/>
      <path d="M12 14v6" stroke="#9d174d" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
};

// ── SVG brand-style icons for Vault Offers cards ──────────────────────────
const OfferIcons = {
  OakHoney: () => (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      {/* Honeycomb hex */}
      <polygon points="19,4 31,11 31,25 19,32 7,25 7,11" fill="#a855f7" opacity="0.18"/>
      <polygon points="19,4 31,11 31,25 19,32 7,25 7,11" stroke="#7e22ce" strokeWidth="1.5" fill="none"/>
      {/* Leaf */}
      <path d="M14 22 Q19 12 24 16 Q19 26 14 22Z" fill="#7e22ce" opacity="0.7"/>
      <path d="M19 19 Q16 21 14 22" stroke="#7e22ce" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  Faire: () => (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      {/* Shopping bag */}
      <rect x="8" y="14" width="22" height="18" rx="3" fill="#dc2626" opacity="0.15" stroke="#dc2626" strokeWidth="1.6"/>
      <path d="M14 14v-3a5 5 0 0110 0v3" stroke="#dc2626" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M13 22h12M13 27h8" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
    </svg>
  ),
  KiwiCo: () => (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      {/* Rocket / education */}
      <circle cx="19" cy="19" r="13" fill="#1d4ed8" opacity="0.1" stroke="#1d4ed8" strokeWidth="1.5"/>
      <path d="M19 10 Q24 14 24 19 Q24 24 19 27 Q14 24 14 19 Q14 14 19 10Z" fill="#1d4ed8" opacity="0.6"/>
      <circle cx="19" cy="19" r="3" fill="#fff"/>
      <path d="M14 24 L11 27M24 24 L27 27" stroke="#1d4ed8" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Instacart: () => (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      {/* Cart */}
      <path d="M7 9h3l3 14h14l3-10H13" stroke="#15803d" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="27" r="2" fill="#15803d"/>
      <circle cx="24" cy="27" r="2" fill="#15803d"/>
      {/* Carrot top */}
      <path d="M22 9 Q25 5 28 7" stroke="#15803d" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
};

export default function ChaseVaultApp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [useToken, setUseToken] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fileInputRef = useRef(null);

  const [balance, setBalance] = useState(0);
  const [activeNav, setActiveNav] = useState("Account");
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const target = 834740;
      const duration = 1600;
      const delay = 400;
      const timeout = setTimeout(() => {
        const start = performance.now();
        const ease = (p) => (p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p);
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          setBalance(Math.floor(ease(p) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    const validUser = "DaveRaymond411";
    const validPass = "Sa44167618";
    if (username === validUser && password === validPass) {
      setIsLoading(true);
      setLoginError("");
      setTimeout(() => { setIsLoading(false); setIsLoggedIn(true); }, 1500);
    } else {
      setLoginError("Invalid username or password. Please try again.");
      setTimeout(() => setLoginError(""), 4000);
    }
  };

  const quickActions = [
    { icon: "ti-send", label: "Send Zelle", restricted: true },
    { icon: "ti-receipt", label: "Pay Bills", restricted: true },
    { icon: "ti-arrow-down-circle", label: "Deposit", restricted: true },
    { icon: "ti-tag", label: "Offers", restricted: false },
    { icon: "ti-grid-dots", label: "More", restricted: false },
  ];

  const accounts = [
    { bg: "#f3e8ff", iconBg: "#ede9fe", iconColor: "#7c3aed", label: "Credit Cards",  Icon: AccountIcons.CreditCards  },
    { bg: "#dcfce7", iconBg: "#bbf7d0", iconColor: "#15803d", label: "Business",      Icon: AccountIcons.Business      },
    { bg: "#fef3c7", iconBg: "#fde68a", iconColor: "#b45309", label: "Saving & CD",   Icon: AccountIcons.Savings       },
    { bg: "#e0f2fe", iconBg: "#bae6fd", iconColor: "#0369a1", label: "Investments",   Icon: AccountIcons.Investments   },
    { bg: "#fce7f3", iconBg: "#fbcfe8", iconColor: "#9d174d", label: "Mortgage",      Icon: AccountIcons.Mortgage      },
  ];

  const offers = [
    { bg: "#f3e8ff", tagBg: "#7e22ce", tag: "New",     Icon: OfferIcons.OakHoney,  name: "Oak & Honey", cb: "5% cash back"  },
    { bg: "#fee2e2", tagBg: "#dc2626", tag: "New",     Icon: OfferIcons.Faire,     name: "Faire",       cb: "20% cash back" },
    { bg: "#dbeafe", tagBg: "#1d4ed8", tag: "Limited", Icon: OfferIcons.KiwiCo,    name: "KiwiCo",      cb: "15% cash back" },
    { bg: "#dcfce7", tagBg: "#15803d", tag: "Limited", Icon: OfferIcons.Instacart, name: "Instacart",   cb: "10% cash back" },
  ];

  const navItems = [
    { icon: "ti-currency-dollar", label: "Pay" },
    { icon: "ti-credit-card", label: "Account" },
    { icon: "ti-sparkles", label: "Assistant", center: true },
    { icon: "ti-chart-bar", label: "Track" },
    { icon: "ti-dots", label: "More" },
  ];

  const sideNavLinks = [
    { icon: "ti-home", label: "Home" },
    { icon: "ti-credit-card", label: "My Cards" },
    { icon: "ti-history", label: "Transfer History", action: "history" },
    { icon: "ti-bolt", label: "Electricity Bills", action: "history", filter: "electricity" },
    { icon: "ti-droplet", label: "Water Bills", action: "history", filter: "water" },
    { icon: "ti-device-mobile", label: "Phone Bills", action: "history", filter: "phone" },
    { icon: "ti-player-play", label: "Subscriptions", action: "history", filter: "bills" },
    { icon: "ti-chart-pie", label: "Spending Analytics" },
    { icon: "ti-settings", label: "Settings" },
    { icon: "ti-help-circle", label: "Support" },
    { icon: "ti-logout", label: "Sign Out" },
  ];

  const filtered = historyFilter === "all"
    ? TRANSACTIONS
    : TRANSACTIONS.filter((t) => t.category === historyFilter);

  const formatted = balance.toLocaleString("en-US");

  // ── LOGIN ──────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #0a1f3c 0%, #0d2a50 50%, #0e3060 100%)", fontFamily: "'Inter', -apple-system, sans-serif", padding: "16px" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 0 }}>

          {/* ── HEADER BRAND AREA ── */}
          <div style={{ textAlign: "center", paddingBottom: 32, paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
              <img
                src={ChaseLogo}
                alt="Chase"
                style={{ height: 42, width: "auto", mixBlendMode: "screen", filter: "brightness(2) saturate(0) invert(1)" }}
              />
              <span style={{ color: "#ffffff", fontSize: 28, fontWeight: 300, letterSpacing: "0.18em", lineHeight: 1 }}>
                CHASE
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Secure Online Banking
            </p>
          </div>

          {/* ── CARD ── */}
          <div style={{ background: "#ffffff", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ height: 4, background: "linear-gradient(90deg, #1a46c8, #4d8bff, #1a46c8)" }} />
            <div style={{ padding: "28px 28px 24px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0a1628", marginBottom: 4, letterSpacing: "-0.3px" }}>Sign in to your account</h2>
              <p style={{ fontSize: 12, color: "#8a99b3", marginBottom: 24 }}>Enter your credentials to continue</p>

              {loginError && (
                <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "#fff1f1", border: "1px solid #fecaca", display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="ti ti-alert-circle" style={{ color: "#ef4444", fontSize: 15, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#dc2626", lineHeight: 1.4 }}>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Username</label>
                  <div style={{ position: "relative" }}>
                    <i className="ti ti-user" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 15 }} />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username"
                      style={{ width: "100%", boxSizing: "border-box", paddingLeft: 24, paddingTop: 10, paddingBottom: 10, border: "none", borderBottom: "2px solid #e2e8f0", fontSize: 13, color: "#1e293b", background: "transparent", outline: "none", fontFamily: "inherit" }}
                      onFocus={(e) => e.target.style.borderBottomColor = "#1a46c8"}
                      onBlur={(e) => e.target.style.borderBottomColor = "#e2e8f0"} />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <i className="ti ti-lock" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 15 }} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                      style={{ width: "100%", boxSizing: "border-box", paddingLeft: 24, paddingTop: 10, paddingBottom: 10, border: "none", borderBottom: "2px solid #e2e8f0", fontSize: 13, color: "#1e293b", background: "transparent", outline: "none", fontFamily: "inherit" }}
                      onFocus={(e) => e.target.style.borderBottomColor = "#1a46c8"}
                      onBlur={(e) => e.target.style.borderBottomColor = "#e2e8f0"} />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ width: 15, height: 15, accentColor: "#1a46c8" }} />
                    <span style={{ fontSize: 12, color: "#475569" }}>Remember me</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                    <input type="checkbox" checked={useToken} onChange={(e) => setUseToken(e.target.checked)} style={{ width: 15, height: 15, accentColor: "#1a46c8" }} />
                    <span style={{ fontSize: 12, color: "#475569" }}>Use token</span>
                  </label>
                </div>

                <button type="submit" disabled={isLoading}
                  style={{ width: "100%", background: isLoading ? "#4a6fa5" : "linear-gradient(135deg, #1a46c8 0%, #0d2e96 100%)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "13px 0", borderRadius: 12, border: "none", cursor: isLoading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(26,70,200,0.35)", fontFamily: "inherit" }}>
                  {isLoading ? (
                    <>
                      <svg style={{ width: 18, height: 18, animation: "spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                        <path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Signing in...
                    </>
                  ) : "Sign in"}
                </button>

                <div style={{ textAlign: "center", marginTop: 14 }}>
                  <a href="#" style={{ color: "#1a46c8", fontSize: 12, textDecoration: "none", fontWeight: 500 }}>Forgot username or password?</a>
                </div>
              </form>

              <div style={{ display: "flex", justifyContent: "center", gap: 6, alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                {["Sign up", "Open an account", "Privacy"].map((link, i, arr) => (
                  <React.Fragment key={link}>
                    <a href="#" style={{ color: "#1a46c8", fontSize: 12, textDecoration: "none", fontWeight: 500 }}>{link}</a>
                    {i < arr.length - 1 && <span style={{ color: "#cbd5e1", fontSize: 11 }}>|</span>}
                  </React.Fragment>
                ))}
              </div>

              <div style={{ marginTop: 16, textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8" }}>Equal Housing Lender</span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1", display: "inline-block" }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8" }}>Member FDIC</span>
                </div>
                <p style={{ fontSize: 10, color: "#b0bec5", lineHeight: 1.6 }}>
                  Deposit products provided by JPMorgan Chase Bank, N.A.<br />Credit cards issued by JPMorgan Chase Bank, N.A. Member FDIC
                </p>
                <p style={{ fontSize: 10, color: "#cfd8dc", marginTop: 4 }}>© 2023 JPMorgan Chase & Co.</p>
              </div>
            </div>
          </div>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-screen bg-[#eef2f8] font-sans flex items-center justify-center overflow-hidden">

      {sideNavOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[3px]" onClick={() => setSideNavOpen(false)} />
      )}

      {/* SIDE NAV */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#07111f] z-50 flex flex-col transition-transform duration-300 ease-in-out ${sideNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div style={{ background: "linear-gradient(135deg, #0d1f3c 0%, #091629 100%)", padding: "40px 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #1a56db", overflow: "hidden", flexShrink: 0 }}>
              <img src={ProfileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Dave Raymond</p>
              <p style={{ color: "#64748b", fontSize: 11 }}>···· 9440 · Debit</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ color: "#22c55e", fontSize: 10, fontWeight: 600 }}>Active</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {sideNavLinks.map(({ icon, label, action, filter }) => (
            <button key={label}
              onClick={() => {
                setSideNavOpen(false);
                if (action === "history") { setHistoryFilter(filter || "all"); setModal("history"); }
                else if (label === "Sign Out") setIsLoggedIn(false);
              }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 20px", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 13, textAlign: "left", transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#94a3b8"; }}
            >
              <i className={`ti ${icon}`} style={{ fontSize: 17, width: 20, textAlign: "center" }} />
              <span style={{ flex: 1 }}>{label}</span>
              {action === "history" && (
                <span style={{ fontSize: 9, background: "rgba(26,86,219,0.2)", color: "#4d8bff", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>VIEW</span>
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 10, color: "#334155" }}>Vault Secure Banking · Member FDIC</p>
        </div>
      </div>

      {/* ACCOUNT LOCKED MODAL */}
      {modal === "restricted" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", width: "100%", maxWidth: 300, textAlign: "center", boxShadow: "0 30px 80px rgba(0,0,0,0.3)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #fee2e2, #fecaca)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <i className="ti ti-lock" style={{ color: "#dc2626", fontSize: 28 }} />
            </div>
            <h3 style={{ color: "#0a1628", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Account Locked</h3>
            <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.6, marginBottom: 20 }}>
              This feature is currently unavailable on your account. Please contact our customer service team to resolve this issue.
            </p>
            <a href="tel:+18003356000"
              style={{ display: "block", background: "linear-gradient(135deg, #1a46c8, #0d2e96)", color: "#fff", fontWeight: 700, fontSize: 13, padding: "13px 0", borderRadius: 12, textDecoration: "none", marginBottom: 10, boxShadow: "0 4px 14px rgba(26,70,200,0.3)" }}>
              <i className="ti ti-phone" style={{ marginRight: 6 }} />Call Customer Service
            </a>
            <button onClick={() => setModal(null)} style={{ width: "100%", background: "none", border: "none", color: "#94a3b8", fontSize: 13, padding: "8px 0", cursor: "pointer" }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {modal === "history" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 430, maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 -20px 60px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 12 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e2e8f0" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 10px" }}>
              <h3 style={{ color: "#0a1628", fontWeight: 700, fontSize: 15 }}>Transaction History</h3>
              <button onClick={() => setModal(null)} style={{ width: 30, height: 30, borderRadius: "50%", background: "#f1f5f9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="ti ti-x" style={{ color: "#64748b", fontSize: 13 }} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, padding: "0 20px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
              {[{ key: "all", label: "All" }, { key: "transfer", label: "Transfers" }, { key: "bills", label: "Subscriptions" }, { key: "electricity", label: "Electricity" }, { key: "water", label: "Water" }, { key: "phone", label: "Phone" }].map(({ key, label }) => (
                <button key={key} onClick={() => setHistoryFilter(key)}
                  style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", background: historyFilter === key ? "#0a1628" : "#f1f5f9", color: historyFilter === key ? "#fff" : "#64748b", transition: "all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filtered.map((t) => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderTop: "1px solid #f8fafc" }}>
                  <div className={`${t.bg}`} style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`ti ${t.icon} ${t.color}`} style={{ fontSize: 17 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#1e293b", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{t.label}</p>
                    <p style={{ color: "#94a3b8", fontSize: 11 }}>{t.sub} · {t.date}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.amount > 0 ? "#16a34a" : "#1e293b" }}>
                    {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN APP */}
      <div className="relative w-full h-full max-w-[430px] bg-white flex flex-col shadow-2xl overflow-hidden">

        {/* Top bar */}
        <div style={{ background: "#eef2f8", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #e2e8f0", flexShrink: 0, zIndex: 10 }}>
          <button onClick={() => setSideNavOpen(true)} style={{ display: "flex", flexDirection: "column", gap: 4, padding: 6, background: "none", border: "none", cursor: "pointer" }}>
            <span style={{ display: "block", width: 20, height: 2, background: "#1a1a2e", borderRadius: 2 }} />
            <span style={{ display: "block", width: 13, height: 2, background: "#1a1a2e", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "#1a1a2e", borderRadius: 2 }} />
          </button>
          <img src={ChaseLogo} alt="Chase" style={{ height: 36, width: "auto", objectFit: "contain", mixBlendMode: "multiply", filter: "contrast(1.1) brightness(1.1)" }} />
          <div style={{ position: "relative" }}>
            <div onClick={() => setShowProfileMenu(v => !v)} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #1a56db", overflow: "hidden", cursor: "pointer" }}>
              <img src={ProfileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, background: "#22c55e", borderRadius: "50%", border: "2px solid #eef2f8" }} />
            {showProfileMenu && (
              <div style={{ position: "absolute", top: 44, right: 0, background: "#fff", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", border: "1px solid #f1f5f9", minWidth: 180, zIndex: 100, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#0a1628" }}>Dave Raymond</p>
                  <p style={{ fontSize: 10, color: "#94a3b8" }}>···· 9440 · Debit</p>
                </div>
                <button onClick={() => { setShowProfileMenu(false); setIsLoggedIn(false); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13, fontWeight: 600 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m0-8V7a3 3 0 016 0v1"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80, scrollbarWidth: "none" }}>
          <div style={{ padding: 16 }}>

            {/* Hero card */}
            <div style={{ position: "relative", background: "linear-gradient(135deg, #1250d4 0%, #0b3aa8 55%, #071f6b 100%)", borderRadius: 22, padding: "20px 20px 20px", color: "#fff", overflow: "hidden", marginBottom: 20, boxShadow: "0 12px 40px rgba(10,46,150,0.45)" }}>
              <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", border: "30px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -60, left: -30, width: 160, height: 160, borderRadius: "50%", border: "24px solid rgba(255,255,255,0.035)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 0, left: "30%", width: "45%", height: "100%", background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)", pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "4px 12px", border: "1px solid rgba(255,255,255,0.15)" }}>Debit Card</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 28, height: 28, background: "rgba(0,0,0,0.6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
                    </svg>
                  </div>
                  <div style={{ width: 28, height: 28, background: "rgba(0,0,0,0.6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <span style={{ marginLeft: 4, fontSize: 20, fontWeight: 900, fontStyle: "italic", fontFamily: "Georgia, serif", opacity: 0.95, letterSpacing: "0.02em" }}>VISA</span>
                </div>
              </div>

              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5, marginBottom: 6 }}>Available balance</p>
              <p style={{ fontSize: 34, fontWeight: 300, letterSpacing: "-1px", lineHeight: 1, marginBottom: 4 }}>
                ${formatted}<span style={{ fontSize: 34, fontWeight: 300 }}>.00</span>
              </p>
              <p style={{ fontSize: 9, opacity: 0.38, marginBottom: 18, letterSpacing: "0.04em" }}>Vault Secure Banking</p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 22, background: "linear-gradient(135deg, rgba(255,220,100,0.9), rgba(200,160,40,0.8))", borderRadius: 5, border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.25)" }} />
                    <div style={{ position: "absolute", left: "33%", top: 0, bottom: 0, width: "1px", background: "rgba(0,0,0,0.25)" }} />
                  </div>
                  <span style={{ fontSize: 10, opacity: 0.6, letterSpacing: "0.08em" }}>···· ···· ···· 9440</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 10, opacity: 0.55 }}>11 / 29</span>
                  <button style={{ width: 32, height: 32, background: "#0a0f1e", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", border: "none", boxShadow: "0 3px 10px rgba(0,0,0,0.5)", cursor: "pointer" }}>
                    <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                      <path d="M11 4V18M4 11H18" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Card meta */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 2 }}>Vault Secure Banking ···· 9440</p>
            </div>

            {/* Quick actions */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 16, scrollbarWidth: "none" }}>
              {quickActions.map(({ icon, label, restricted }) => (
                <button key={label}
                  onClick={() => restricted ? setModal("restricted") : null}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1.5px solid rgba(0,0,0,0.07)", borderRadius: 24, padding: "8px 14px", fontSize: 11, fontWeight: 700, color: "#1a56db", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", cursor: "pointer" }}>
                  <i className={`ti ${icon}`} style={{ fontSize: 12 }} />
                  {label}
                </button>
              ))}
            </div>

            {/* Snapshot */}
            <div style={{ border: "1.5px dashed #93b8f5", borderRadius: 18, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16, background: "#fff" }}>
              <div style={{ width: 46, height: 46, background: "#eff6ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className="ti ti-chart-bar" style={{ fontSize: 22, color: "#1a56db" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  Snapshot
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#1a56db", background: "#eff6ff", padding: "2px 8px", borderRadius: 20, marginLeft: 8 }}>30 secs</span>
                </p>
                <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5, marginBottom: 8 }}>Your spending this month is $6,754. You're 12% under budget.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a56db" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e2e8f0" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e2e8f0" }} />
                </div>
              </div>
            </div>

            {/* History quick links */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
              {[
                { icon: "ti-history", label: "Transfer History", filter: "transfer" },
                { icon: "ti-bolt", label: "Electricity Bills", filter: "electricity" },
                { icon: "ti-droplet", label: "Water Bills", filter: "water" },
              ].map(({ icon, label, filter }) => (
                <button key={label}
                  onClick={() => { setHistoryFilter(filter); setModal("history"); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 16, padding: "12px 8px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#93b8f5"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#f1f5f9"}
                >
                  <div style={{ width: 38, height: 38, background: "#eff6ff", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={`ti ${icon}`} style={{ fontSize: 18, color: "#1a56db" }} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#475569", textAlign: "center", lineHeight: 1.3 }}>{label}</span>
                </button>
              ))}
            </div>

            {/* ── Open an account ── */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Open an account</p>
                <button style={{ width: 28, height: 28, background: "#1a56db", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="ti ti-arrow-right" style={{ fontSize: 13, color: "#fff" }} />
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                {accounts.map(({ bg, iconBg, label, Icon }) => (
                  <div key={label} onClick={() => setModal("restricted")}
                    style={{ minWidth: 76, flexShrink: 0, borderRadius: 18, padding: "14px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", background: bg, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1.5px solid rgba(0,0,0,0.05)", transition: "transform 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div style={{ width: 44, height: 44, background: iconBg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon />
                    </div>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#374151", textAlign: "center", lineHeight: 1.3 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Vault Offers ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Vault Offers</p>
                <button style={{ width: 28, height: 28, background: "#1a56db", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="ti ti-arrow-right" style={{ fontSize: 13, color: "#fff" }} />
                </button>
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                {offers.map(({ bg, tagBg, tag, Icon, name, cb }) => (
                  <div key={name} style={{ minWidth: 100, flexShrink: 0, cursor: "pointer" }}>
                    <div style={{ height: 90, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: 8, background: bg, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", transition: "transform 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <span style={{ position: "absolute", top: 8, left: 8, fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 20, background: tagBg, color: "#fff" }}>{tag}</span>
                      <Icon />
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>{name}</p>
                    <p style={{ fontSize: 10, color: "#94a3b8" }}>{cb}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM NAV */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg style={{ width: "100%", height: 36, display: "block" }} viewBox="0 0 430 36" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,18 C80,32 155,6 195,16 C204,18 210,24 215,26 C220,24 226,18 235,16 C275,6 350,32 430,18 L430,36 L0,36 Z" fill="#07111f"/>
          </svg>

          <div style={{ background: "#07111f", display: "flex", alignItems: "flex-end", justifyContent: "space-around", paddingBottom: 14, paddingLeft: 4, paddingRight: 4 }}>

            {(() => { const isActive = activeNav === "Pay"; return (
              <button onClick={() => setActiveNav("Pay")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "0 8px", position: "relative" }}>
                {isActive && <div style={{ position: "absolute", top: -18, width: 4, height: 4, borderRadius: "50%", background: "#4d8bff", boxShadow: "0 0 6px #4d8bff" }} />}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke={isActive ? "#fff" : "#4a5568"} strokeWidth="1.8"/>
                  <path d="M12 7v1m0 8v1M9.5 9.5C9.5 8.67 10.17 8 11 8h2.5a1.5 1.5 0 010 3H11a1.5 1.5 0 000 3h2.5a1.5 1.5 0 010 3H11c-.83 0-1.5-.67-1.5-1.5" stroke={isActive ? "#fff" : "#4a5568"} strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : "#4a5568" }}>Pay</span>
              </button>
            ); })()}

            {(() => { const isActive = activeNav === "Account"; return (
              <button onClick={() => setActiveNav("Account")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "0 8px", position: "relative" }}>
                {isActive && <div style={{ position: "absolute", top: -18, width: 4, height: 4, borderRadius: "50%", background: "#4d8bff", boxShadow: "0 0 6px #4d8bff" }} />}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="13" rx="2.5" stroke={isActive ? "#fff" : "#4a5568"} strokeWidth="1.8"/>
                  <path d="M3 10h18" stroke={isActive ? "#fff" : "#4a5568"} strokeWidth="1.8"/>
                  <rect x="6" y="13.5" width="4" height="2" rx="0.5" fill={isActive ? "#fff" : "#4a5568"}/>
                </svg>
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : "#4a5568" }}>Account</span>
              </button>
            ); })()}

            {(() => { const isActive = activeNav === "Assistant"; return (
              <button onClick={() => setActiveNav("Assistant")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", marginTop: -28, position: "relative", zIndex: 10 }}>
                <div style={{ width: 58, height: 58, borderRadius: "50%", background: isActive ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #1d4ed8 100%)" : "linear-gradient(135deg, #334155 0%, #1e293b 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isActive ? "0 0 0 3px rgba(96,165,250,0.25), 0 8px 24px rgba(59,130,246,0.55)" : "0 4px 16px rgba(0,0,0,0.5)", transition: "all 0.2s" }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 4L15.5 11.5L23 13L15.5 14.5L14 22L12.5 14.5L5 13L12.5 11.5L14 4Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
                    <path d="M21 4L21.8 7.2L25 8L21.8 8.8L21 12L20.2 8.8L17 8L20.2 7.2L21 4Z" fill="rgba(255,255,255,0.6)" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, color: isActive ? "#93c5fd" : "#4a5568" }}>Assistant</span>
              </button>
            ); })()}

            {(() => { const isActive = activeNav === "Track"; return (
              <button onClick={() => setActiveNav("Track")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "0 8px", position: "relative" }}>
                {isActive && <div style={{ position: "absolute", top: -18, width: 4, height: 4, borderRadius: "50%", background: "#4d8bff", boxShadow: "0 0 6px #4d8bff" }} />}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="13" width="3.5" height="7" rx="1" fill={isActive ? "#fff" : "#4a5568"}/>
                  <rect x="10.25" y="9" width="3.5" height="11" rx="1" fill={isActive ? "#fff" : "#4a5568"}/>
                  <rect x="16.5" y="5" width="3.5" height="15" rx="1" fill={isActive ? "#fff" : "#4a5568"}/>
                  <path d="M5.75 13L12 9L18.25 5" stroke={isActive ? "#93c5fd" : "#334155"} strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : "#4a5568" }}>Track</span>
              </button>
            ); })()}

            {(() => { const isActive = activeNav === "More"; return (
              <button onClick={() => setActiveNav("More")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "0 8px", position: "relative" }}>
                {isActive && <div style={{ position: "absolute", top: -18, width: 4, height: 4, borderRadius: "50%", background: "#4d8bff", boxShadow: "0 0 6px #4d8bff" }} />}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="5.5" cy="12" r="2" fill={isActive ? "#fff" : "#4a5568"}/>
                  <circle cx="12" cy="12" r="2" fill={isActive ? "#fff" : "#4a5568"}/>
                  <circle cx="18.5" cy="12" r="2" fill={isActive ? "#fff" : "#4a5568"}/>
                </svg>
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : "#4a5568" }}>More</span>
              </button>
            ); })()}

          </div>
        </div>
      </div>
    </div>
  );
}
