import { useRef } from "react";
import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { Wifi, Camera, Briefcase, CalendarDays, UtensilsCrossed } from "lucide-react";
import { ease, spring } from "../../lib/motion";
import { useLanguage } from "../../contexts/LanguageContext";
import type { QrSettings } from "../../hooks/useQrSettings";

interface Template {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  settings: Partial<QrSettings>;
}

const TEMPLATES: Template[] = [
  {
    id: "wifi-cafe",
    label: "Wi-Fi — Café",
    description: "Let guests connect without asking.",
    icon: <Wifi size={18} />,
    accent: "#B7F04A",
    settings: {
      type: "wifi",
      ssid: "Qraft Coffee",
      wifiPassword: "password",
      wifiEncryption: "WPA",
      fgColor: "#0E1420",
      bgColor: "#FFFFFF",
    },
  },
  {
    id: "instagram",
    label: "Instagram Profile",
    description: "Drive followers straight to your grid.",
    icon: <Camera size={18} />,
    accent: "#6B21A8",
    settings: {
      type: "url",
      url: "https://instagram.com/qraft.studio",
      fgColor: "#3B0764",
      bgColor: "#FFFFFF",
    },
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "Your work — one scan away.",
    icon: <Briefcase size={18} />,
    accent: "#0F766E",
    settings: {
      type: "url",
      url: "https://portfolio.qraft.studio",
      fgColor: "#042F2E",
      bgColor: "#F0FDFA",
    },
  },
  {
    id: "event",
    label: "Event",
    description: "Share event details and RSVP.",
    icon: <CalendarDays size={18} />,
    accent: "#B45309",
    settings: {
      type: "url",
      url: "https://event.qraft.studio/rsvp",
      fgColor: "#431407",
      bgColor: "#FFFBEB",
    },
  },
  {
    id: "restaurant-menu",
    label: "Restaurant Menu",
    description: "Scan to browse today's specials.",
    icon: <UtensilsCrossed size={18} />,
    accent: "#FF5C38",
    settings: {
      type: "url",
      url: "https://menu.qraft.studio/today",
      fgColor: "#431407",
      bgColor: "#FFF7ED",
    },
  },
];

function TemplateCard({
  template,
  index,
  onSelect,
}: {
  template: Template;
  index: number;
  onSelect: (t: Template) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg)";
  };

  const qrValue =
    template.settings.type === "wifi"
      ? `WIFI:T:WPA;S:${template.settings.ssid};P:${template.settings.wifiPassword};;`
      : template.settings.url || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: ease.outExpo }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 24,
          cursor: "pointer",
          transition: "transform 0.15s ease, box-shadow 0.2s",
          transformStyle: "preserve-3d",
        }}
        onClick={() => onSelect(template)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 16px 48px rgba(14,20,32,0.12)";
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: template.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink)",
              flexShrink: 0,
            }}
          >
            {template.icon}
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 15,
                color: "var(--ink)",
                letterSpacing: "-0.01em",
              }}
            >
              {t(template.label)}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--muted)",
                marginTop: 1,
              }}
            >
              {t(template.description)}
            </div>
          </div>
        </div>

        {/* Mini QR preview */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            background: template.settings.bgColor || "#fff",
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <QRCodeSVG
            value={qrValue}
            size={120}
            fgColor={template.settings.fgColor || "#0E1420"}
            bgColor={template.settings.bgColor || "#FFFFFF"}
            level="M"
          />
        </div>

        {/* CTA */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={spring.interactive}
          style={{
            width: "100%",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "9px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--muted)",
            textAlign: "center",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {t("Load in Studio")} →
        </motion.div>
      </div>
    </motion.div>
  );
}

interface TemplatesProps {
  onSelectTemplate: (settings: Partial<QrSettings>) => void;
}

export default function Templates({ onSelectTemplate }: TemplatesProps) {
  const { t } = useLanguage();

  return (
    <section
      id="templates"
      style={{
        padding: "100px 0",
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: ease.outExpo }}
          style={{ marginBottom: 48 }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {t("Templates")}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 44px)",
              letterSpacing: "-0.03em",
              color: "var(--ink)",
            }}
          >
            {t("Start from a preset.")}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "var(--muted)",
              marginTop: 10,
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            {t("Pick a template and instantly load it into the Studio — fully customizable from there.")}
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {TEMPLATES.map((template, i) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={i}
              onSelect={(t) => onSelectTemplate(t.settings)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
