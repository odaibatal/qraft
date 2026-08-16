import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, Plus, Trash2, Check, Upload } from "lucide-react";
import { useBrandKit, type BrandKit } from "../../contexts/BrandKitContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { ease, spring } from "../../lib/motion";
import { isSafeImageUrl } from "../../lib/security";

const DEFAULT_FORM = {
  name: "",
  primaryColor: "#0E1420",
  secondaryColor: "#B7F04A",
  logoUrl: "",
};

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
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
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
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
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function BrandCard({
  brand,
  onApply,
  onEdit,
  onDelete,
}: {
  brand: BrandKit;
  onApply: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useLanguage();
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<BrandKit>;
      if (custom.detail?.id === brand.id) setApplied(true);
    };
    window.addEventListener("brand-kit:apply", handler);
    return () => window.removeEventListener("brand-kit:apply", handler);
  }, [brand.id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: ease.outExpo }}
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {brand.logoUrl && isSafeImageUrl(brand.logoUrl) ? (
        <img
          src={brand.logoUrl}
          alt={brand.name}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            objectFit: "contain",
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        />
      ) : (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Palette size={16} color="#fff" />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 14,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {brand.name}
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: brand.primaryColor,
              border: "1px solid var(--border)",
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: brand.secondaryColor,
              border: "1px solid var(--border)",
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={spring.interactive}
          onClick={onApply}
          aria-label={t("Apply brand")}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: applied ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
            background: applied ? "var(--accent)" : "var(--surface)",
            color: applied ? "var(--ink)" : "var(--muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
          title={t("Apply brand")}
        >
          <Check size={14} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={spring.interactive}
          onClick={onEdit}
          aria-label={t("Save brand")}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1.5px solid var(--border)",
            background: "var(--surface)",
            color: "var(--muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
          title="Edit"
        >
          <Upload size={14} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={spring.interactive}
          onClick={onDelete}
          aria-label={t("Delete brand")}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1.5px solid var(--border)",
            background: "var(--surface)",
            color: "var(--micro)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
          title={t("Delete brand")}
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function BrandKit() {
  const { brands, createBrand, updateBrand, deleteBrand, applyBrand } = useBrandKit();
  const { t } = useLanguage();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      updateBrand(editingId, {
        name: form.name,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        logoUrl: form.logoUrl || undefined,
      });
      setEditingId(null);
    } else {
      createBrand({
        name: form.name,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        logoUrl: form.logoUrl || undefined,
      });
    }
    setForm(DEFAULT_FORM);
  };

  const startEdit = (brand: BrandKit) => {
    setEditingId(brand.id);
    setForm({
      name: brand.name,
      primaryColor: brand.primaryColor,
      secondaryColor: brand.secondaryColor,
      logoUrl: brand.logoUrl || "",
    });
  };

  const handleApply = (id: string) => {
    applyBrand(id);
  };

  const handleDelete = (id: string) => {
    deleteBrand(id);
    if (editingId === id) {
      setEditingId(null);
      setForm(DEFAULT_FORM);
    }
  };

  return (
    <section
      style={{
        padding: "80px 0",
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: ease.outExpo }}
          style={{ marginBottom: 32 }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            <Palette size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            {t("Brand Kit")}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(24px, 3.5vw, 36px)",
              letterSpacing: "-0.03em",
              color: "var(--ink)",
            }}
          >
            {t("Brand Kit")}
          </h2>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: ease.outExpo, delay: 0.1 }}
          style={{
            background: "var(--surface)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid var(--border)",
            marginBottom: 24,
          }}
        >
          <div style={{ marginBottom: 14 }}>
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
              {t("Brand name")}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("Brand name")}
              aria-label={t("Brand name")}
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
            <ColorField
              label={t("Primary color")}
              value={form.primaryColor}
              onChange={(v) => setForm({ ...form, primaryColor: v })}
            />
            <ColorField
              label={t("Secondary color")}
              value={form.secondaryColor}
              onChange={(v) => setForm({ ...form, secondaryColor: v })}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
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
              {t("Logo URL")}
            </label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
              aria-label={t("Logo URL")}
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={spring.interactive}
            onClick={handleSubmit}
            style={{
              width: "100%",
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
            <Plus size={15} />
            {editingId ? t("Save brand") : t("Save brand")}
          </motion.button>
        </motion.div>

        {/* Brands list */}
        <AnimatePresence mode="popLayout">
          {brands.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "var(--muted)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
              }}
            >
              {t("No brands saved yet")}
            </motion.div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {brands.map((brand) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                onApply={() => handleApply(brand.id)}
                onEdit={() => startEdit(brand)}
                onDelete={() => handleDelete(brand.id)}
              />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
}
