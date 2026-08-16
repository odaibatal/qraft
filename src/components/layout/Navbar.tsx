import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { slideDown } from "../../lib/motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

const QrPixelMark = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="6" height="6" rx="1" fill="currentColor" />
    <rect x="12" y="2" width="6" height="6" rx="1" fill="currentColor" />
    <rect x="2" y="12" width="6" height="6" rx="1" fill="currentColor" />
    <rect x="12" y="12" width="3" height="3" fill="currentColor" />
    <rect x="17" y="12" width="2" height="2" fill="currentColor" />
    <rect x="12" y="16" width="2" height="2" fill="currentColor" />
    <rect x="15" y="15" width="2" height="2" fill="currentColor" />
    <rect x="17" y="17" width="2" height="2" fill="currentColor" />
  </svg>
);

interface NavbarProps {
  onOpenStudio: () => void;
}

export default function Navbar({ onOpenStudio }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      variants={slideDown}
      initial="hidden"
      animate="visible"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        background: scrolled ? (isDark ? "rgba(14, 20, 32, 0.85)" : "rgba(250, 250, 247, 0.85)") : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "var(--ink)",
          }}
        >
          <QrPixelMark />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: "-0.02em",
            }}
          >
            Qraft
          </span>
        </a>

        {/* Nav links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
          aria-label="Main navigation"
        >
          {["Studio", "Templates", "Bulk Generator", "How it works"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: 14,
                color: "var(--muted)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              {t(link)}
            </a>
          ))}

          <motion.button
            onClick={onOpenStudio}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              background: "var(--accent)",
              color: "var(--ink)",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              letterSpacing: "-0.01em",
            }}
          >
            {t("Open Studio")}
          </motion.button>

          <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              background: "var(--surface)",
              color: "var(--ink)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 12px",
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              fontSize: 12,
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            {language === "en" ? "عربي" : "EN"}
          </motion.button>

          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              background: "var(--surface)",
              color: "var(--ink)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label={isDark ? t("Light mode") : t("Dark mode")}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>
        </nav>
      </div>
    </motion.header>
  );
}
