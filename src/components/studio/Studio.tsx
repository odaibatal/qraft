import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Wifi, Link, User, Type, ChevronDown, Share2, Upload } from "lucide-react";
import { useQrSettings, type QrType, type ErrorLevel } from "../../hooks/useQrSettings";
import { spring, ease } from "../../lib/motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { isSafeImageUrl } from "../../lib/security";

const PRESET_COLORS = [
  "#0E1420", "#FFFFFF", "#B7F04A", "#FF5C38",
  "#1E3A5F", "#6B21A8", "#0F766E", "#B45309",
];

const TYPE_TABS: { id: QrType; label: string; icon: React.ReactNode }[] = [
  { id: "url", label: "URL", icon: <Link size={14} /> },
  { id: "wifi", label: "Wi-Fi", icon: <Wifi size={14} /> },
  { id: "vcard", label: "vCard", icon: <User size={14} /> },
  { id: "text", label: "Text", icon: <Type size={14} /> },
];

function ColorSwatch({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      transition={spring.interactive}
      aria-label={`Select color ${color}`}
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        background: color,
        border: selected ? "2px solid var(--accent)" : "2px solid var(--border)",
        cursor: "pointer",
        padding: 0,
        boxShadow: selected ? "0 0 0 2px var(--ink)" : "none",
        transition: "box-shadow 0.15s",
      }}
    />
  );
}

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 500,
        color: "var(--muted)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        display: "block",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

function StudioInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <MonoLabel>{label}</MonoLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        style={{
          width: "100%",
          background: "var(--bg)",
          border: "1.5px solid var(--border)",
          borderRadius: 8,
          padding: "10px 12px",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--ink)",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
    </div>
  );
}

function QrPreview({
  value,
  settings,
  onUpdate,
}: {
  value: string;
  settings: ReturnType<typeof useQrSettings>["settings"];
  onUpdate: ReturnType<typeof useQrSettings>["update"];
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [popKey, setPopKey] = useState(0);
  const [logoPos, setLogoPos] = useState({ x: settings.logoX, y: settings.logoY });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [logoError, setLogoError] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setLogoPos({ x: settings.logoX, y: settings.logoY });
  }, [settings.logoX, settings.logoY]);

  useEffect(() => {
    setPopKey((k) => k + 1);
    setLogoError(false);
  }, [value, settings.fgColor, settings.bgColor, settings.size, settings.errorLevel, settings.logoUrl]);

  const handleLogoMouseDown = (e: React.MouseEvent) => {
    if (!settings.logoEnabled) return;
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX - logoPos.x, y: e.clientY - logoPos.y });
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setLogoPos({
        x: Math.max(0, Math.min(100, e.clientX - dragStart.x)),
        y: Math.max(0, Math.min(100, e.clientY - dragStart.y)),
      });
    };
    const handleMouseUp = () => {
      setDragging(false);
      if (settings.logoEnabled) {
        onUpdate("logoX", Math.round(logoPos.x));
        onUpdate("logoY", Math.round(logoPos.y));
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragStart, logoPos, settings.logoEnabled, onUpdate]);

  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(14,20,32,0.10), 0 2px 12px rgba(14,20,32,0.06)",
        padding: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        position: "sticky",
        top: 90,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          alignSelf: "flex-start",
        }}
      >
        {t("Live Preview")}
      </div>

      <motion.div
        key={popKey}
        initial={{ scale: 0.94, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring.interactive}
        ref={canvasRef}
        style={{
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <QRCodeCanvas
          value={value}
          size={settings.size}
          fgColor={settings.fgColor}
          bgColor={settings.bgColor}
          level={settings.errorLevel}
          marginSize={2}
        />
        {/* Scanline */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${settings.fgColor}40 40%, ${settings.fgColor}60 60%, transparent)`,
            pointerEvents: "none",
          }}
          animate={{ top: ["5%", "95%", "5%"] }}
          transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatDelay: 1.5 }}
        />
        {settings.logoEnabled && settings.logoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring.interactive}
            onMouseDown={handleLogoMouseDown}
            style={{
              position: "absolute",
              left: `${logoPos.x}%`,
              top: `${logoPos.y}%`,
              transform: "translate(-50%, -50%)",
              width: settings.logoSize,
              height: settings.logoSize,
              borderRadius: 8,
              border: "2px solid var(--surface)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              background: "var(--surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: dragging ? "grabbing" : "grab",
              overflow: "hidden",
              zIndex: 10,
            }}
          >
            {!logoError && isSafeImageUrl(settings.logoUrl) ? (
              <img
                src={settings.logoUrl}
                alt="Logo"
                draggable={false}
                onError={() => setLogoError(true)}
                style={{
                  width: settings.logoSize - 8,
                  height: settings.logoSize - 8,
                  objectFit: "contain",
                }}
              />
            ) : (
              <span style={{ fontSize: 10, color: "var(--muted)", padding: 4 }}>Logo</span>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Caption */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--muted)",
          textAlign: "center",
          lineHeight: 1.6,
          letterSpacing: "0.03em",
        }}
      >
        {settings.size}×{settings.size}px · EC:{settings.errorLevel} · {settings.type.toUpperCase()}
        <br />
        FG: {settings.fgColor} · BG: {settings.bgColor}
        {settings.logoEnabled && (
          <>
            <br />
            Logo overlay: {settings.logoEnabled ? "ON" : "OFF"}
          </>
        )}
      </div>
    </div>
  );
}

function ControlsContent({ settings, update, onDownloadPng, onDownloadSvg }: {
  settings: ReturnType<typeof useQrSettings>["settings"];
  update: ReturnType<typeof useQrSettings>["update"];
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
}) {
  const { t } = useLanguage();

  return (
    <>
      {/* Type selector */}
      <div style={{ marginBottom: 24 }}>
        <MonoLabel>{t("Type")}</MonoLabel>
        <LayoutGroup>
          <div
            style={{
              display: "flex",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: 3,
              gap: 2,
            }}
            role="tablist"
          >
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={settings.type === tab.id}
                onClick={() => update("type", tab.id)}
                style={{
                  position: "relative",
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  borderRadius: 8,
                  padding: "8px 4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: settings.type === tab.id ? "var(--ink)" : "var(--muted)",
                  transition: "color 0.2s",
                  zIndex: 1,
                }}
              >
                {settings.type === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "var(--accent)",
                      borderRadius: 7,
                      zIndex: -1,
                    }}
                    transition={spring.interactive}
                  />
                )}
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      {/* Dynamic content inputs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={settings.type}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: ease.outExpo }}
        >
          {settings.type === "url" && (
            <StudioInput
              label="URL"
              value={settings.url}
              onChange={(v) => update("url", v)}
              placeholder={t("https://yoursite.com")}
              type="url"
            />
          )}
          {settings.type === "wifi" && (
            <>
              <StudioInput
                label={t("Network Name (SSID)")}
                value={settings.ssid}
                onChange={(v) => update("ssid", v)}
                placeholder={t("My Network")}
              />
              <StudioInput
                label={t("Password")}
                value={settings.wifiPassword}
                onChange={(v) => update("wifiPassword", v)}
                placeholder="••••••••"
                type="password"
              />
              <div style={{ marginBottom: 16 }}>
                <MonoLabel>{t("Encryption")}</MonoLabel>
                <div style={{ position: "relative" }}>
                  <select
                    value={settings.wifiEncryption}
                    onChange={(e) => update("wifiEncryption", e.target.value as "WPA" | "WEP" | "nopass")}
                    aria-label="Wi-Fi encryption type"
                    style={{
                      width: "100%",
                      appearance: "none",
                      background: "var(--bg)",
                      border: "1.5px solid var(--border)",
                      borderRadius: 8,
                      padding: "10px 36px 10px 12px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--ink)",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="WPA">{t("WPA/WPA2")}</option>
                    <option value="WEP">{t("WEP")}</option>
                    <option value="nopass">{t("None")}</option>
                  </select>
                  <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} />
                </div>
              </div>
            </>
          )}
          {settings.type === "vcard" && (
            <>
              <StudioInput label={t("Full Name")} value={settings.name} onChange={(v) => update("name", v)} placeholder={t("Jane Smith")} />
              <StudioInput label={t("Phone")} value={settings.phone} onChange={(v) => update("phone", v)} placeholder={t("+1 (555) 000-0000")} type="tel" />
              <StudioInput label={t("Email")} value={settings.email} onChange={(v) => update("email", v)} placeholder={t("jane@example.com")} type="email" />
            </>
          )}
          {settings.type === "text" && (
            <div style={{ marginBottom: 16 }}>
              <MonoLabel>{t("Text Content")}</MonoLabel>
              <textarea
                value={settings.text}
                onChange={(e) => update("text", e.target.value)}
                placeholder={t("Enter any text...")}
                rows={3}
                aria-label="Text content"
                style={{
                  width: "100%",
                  background: "var(--bg)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--ink)",
                  outline: "none",
                  resize: "vertical",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />

      {/* Colors */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <MonoLabel>{t("Foreground")}</MonoLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {PRESET_COLORS.slice(0, 4).map((c) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  selected={settings.fgColor === c}
                  onClick={() => update("fgColor", c)}
                />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="color"
                value={settings.fgColor}
                onChange={(e) => update("fgColor", e.target.value)}
                aria-label="Foreground color picker"
                style={{
                  width: 32,
                  height: 32,
                  border: "1.5px solid var(--border)",
                  borderRadius: 6,
                  padding: 2,
                  cursor: "pointer",
                  background: "var(--bg)",
                }}
              />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
                {settings.fgColor}
              </span>
            </div>
          </div>
          <div>
            <MonoLabel>{t("Background")}</MonoLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {PRESET_COLORS.slice(0, 4).map((c) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  selected={settings.bgColor === c}
                  onClick={() => update("bgColor", c)}
                />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="color"
                value={settings.bgColor}
                onChange={(e) => update("bgColor", e.target.value)}
                aria-label="Background color picker"
                style={{
                  width: 32,
                  height: 32,
                  border: "1.5px solid var(--border)",
                  borderRadius: 6,
                  padding: 2,
                  cursor: "pointer",
                  background: "var(--bg)",
                }}
              />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
                {settings.bgColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />

      {/* Logo overlay */}
      <div style={{ marginBottom: 20 }}>
        <MonoLabel>{t("Logo overlay")}</MonoLabel>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <motion.button
            onClick={() => update("logoEnabled", !settings.logoEnabled)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.interactive}
            style={{
              flex: 1,
              padding: "8px",
              border: settings.logoEnabled ? "1.5px solid var(--ink)" : "1.5px solid var(--border)",
              borderRadius: 8,
              background: settings.logoEnabled ? "var(--ink)" : "var(--bg)",
              color: settings.logoEnabled ? "var(--accent)" : "var(--muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {settings.logoEnabled ? t("Enabled") : t("Disabled")}
          </motion.button>
          <label
            style={{
              flex: 1,
              padding: "8px",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              background: "var(--bg)",
              color: "var(--muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Upload size={12} />
            {settings.logoUrl ? t("Change logo") : t("Upload logo")}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") {
                      update("logoUrl", reader.result);
                      update("logoEnabled", true);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
        {settings.logoEnabled && (
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <MonoLabel>Size</MonoLabel>
              <input
                type="range"
                min={32}
                max={120}
                step={4}
                value={settings.logoSize}
                onChange={(e) => update("logoSize", parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />

      {/* Deep link */}
      <div style={{ marginBottom: 20 }}>
        <MonoLabel>{t("Share")}</MonoLabel>
        <motion.button
          onClick={async () => {
            const url = new URL(window.location.href);
            const params = new URLSearchParams();
            params.set("type", settings.type);
            params.set("fg", settings.fgColor);
            params.set("bg", settings.bgColor);
            params.set("size", String(settings.size));
            params.set("ec", settings.errorLevel);
            if (settings.type === "url" && settings.url) params.set("url", settings.url);
            if (settings.type === "wifi") {
              params.set("ssid", settings.ssid);
              params.set("we", settings.wifiEncryption);
            }
            if (settings.type === "vcard") {
              if (settings.name) params.set("name", settings.name);
              if (settings.phone) params.set("phone", settings.phone);
              if (settings.email) params.set("email", settings.email);
            }
            if (settings.type === "text" && settings.text) params.set("text", settings.text);
            if (settings.logoEnabled && settings.logoUrl) {
              params.set("logo", settings.logoUrl);
              params.set("lx", String(settings.logoX));
              params.set("ly", String(settings.logoY));
              params.set("ls", String(settings.logoSize));
            }
            url.search = params.toString();
            try {
              await navigator.clipboard.writeText(url.toString());
            } catch {
              // fallback
            }
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.interactive}
          style={{
            width: "100%",
            padding: "10px",
            border: "1.5px solid var(--border)",
            borderRadius: 8,
            background: "var(--bg)",
            color: "var(--muted)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
        >
          <Share2 size={14} />
          {t("Copy shareable link")}
        </motion.button>
      </div>

      {/* Size */}
      <div style={{ marginBottom: 20 }}>
        <MonoLabel>{t("Size — {n}px").replace("{n}", String(settings.size))}</MonoLabel>
        <input
          type="range"
          min={180}
          max={400}
          step={20}
          value={settings.size}
          onChange={(e) => update("size", parseInt(e.target.value))}
          aria-label="QR code size"
          style={{
            width: "100%",
            accentColor: "var(--accent)",
          }}
        />
      </div>

      {/* Error correction */}
      <div style={{ marginBottom: 24 }}>
        <MonoLabel>{t("Error Correction")}</MonoLabel>
        <div style={{ display: "flex", gap: 6 }}>
          {(["L", "M", "Q", "H"] as ErrorLevel[]).map((lvl) => (
            <motion.button
              key={lvl}
              onClick={() => update("errorLevel", lvl)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={spring.interactive}
              style={{
                flex: 1,
                padding: "7px 4px",
                border: settings.errorLevel === lvl ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                borderRadius: 6,
                background: settings.errorLevel === lvl ? "var(--accent)" : "var(--bg)",
                color: settings.errorLevel === lvl ? "var(--ink)" : "var(--muted)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {lvl}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Download buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <motion.button
          onClick={onDownloadPng}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.interactive}
          style={{
            flex: 1,
            background: "var(--accent)",
            color: "var(--ink)",
            border: "none",
            borderRadius: 10,
            padding: "12px",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            letterSpacing: "-0.01em",
          }}
        >
          <Download size={15} />
          {t("Download PNG")}
        </motion.button>
        <motion.button
          onClick={onDownloadSvg}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.interactive}
          style={{
            flex: 1,
            background: "transparent",
            color: "var(--ink)",
            border: "1.5px solid var(--border)",
            borderRadius: 10,
            padding: "12px",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            letterSpacing: "-0.01em",
          }}
        >
          <Download size={15} />
          {t("Download SVG")}
        </motion.button>
      </div>
    </>
  );
}

export default function Studio({
  initialSettings,
}: {
  initialSettings?: Partial<ReturnType<typeof useQrSettings>["settings"]>;
}) {
  const { settings, update, getValue, fromUrlParams } = useQrSettings();
  const { t, dir } = useLanguage();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      Object.entries(initialSettings).forEach(([k, v]) => {
        update(k as keyof typeof settings, v as never);
      });
    }
    const params = fromUrlParams(window.location.search);
    if (Object.keys(params).length > 0) {
      Object.entries(params).forEach(([k, v]) => {
        update(k as keyof typeof settings, v as never);
      });
    }
  }, []);

  useEffect(() => {
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(timer);
  }, [settings]);

  const qrValue = getValue(settings);

  const downloadPng = useCallback(() => {
    const canvas = document.querySelector("#qr-studio-canvas canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qraft-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const downloadSvg = useCallback(() => {
    const svg = document.querySelector("#qr-studio-canvas svg");
    if (!svg) {
      const canvas = document.querySelector("#qr-studio-canvas canvas") as HTMLCanvasElement;
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "qraft-qr.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      return;
    }
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "qraft-qr.svg";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <section
      id="studio"
      style={{
        padding: "100px 0",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Section header */}
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
            {t("The Studio")}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 44px)",
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {t("Your QR code, your rules.")}
            {saved && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--accent)",
                  letterSpacing: "0.04em",
                }}
              >
                {t("Auto-saved")}
              </motion.span>
            )}
          </h2>
        </motion.div>

        {/* 2-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "start",
          }}
        >
          {dir === "rtl" ? (
            <>
              {/* RIGHT: Live QR Preview */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: ease.outExpo }}
                id="qr-studio-canvas"
              >
                <QrPreview value={qrValue} settings={settings} onUpdate={update} />
              </motion.div>

              {/* LEFT: Controls */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: ease.outExpo }}
                style={{
                  background: "var(--surface)",
                  borderRadius: 20,
                  padding: 28,
                  border: "1px solid var(--border)",
                }}
              >
                <ControlsContent settings={settings} update={update} onDownloadPng={downloadPng} onDownloadSvg={downloadSvg} />
              </motion.div>
            </>
          ) : (
            <>
              {/* LEFT: Controls */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: ease.outExpo }}
                style={{
                  background: "var(--surface)",
                  borderRadius: 20,
                  padding: 28,
                  border: "1px solid var(--border)",
                }}
              >
                <ControlsContent settings={settings} update={update} onDownloadPng={downloadPng} onDownloadSvg={downloadSvg} />
              </motion.div>

              {/* RIGHT: Live QR Preview */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: ease.outExpo }}
                id="qr-studio-canvas"
              >
                <QrPreview value={qrValue} settings={settings} onUpdate={update} />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
