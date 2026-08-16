import { useState, useCallback, useEffect } from "react";

export type QrType = "url" | "wifi" | "vcard" | "text";
export type ErrorLevel = "L" | "M" | "Q" | "H";

export interface QrSettings {
  type: QrType;
  // URL
  url: string;
  // Wi-Fi
  ssid: string;
  wifiPassword: string;
  wifiEncryption: "WPA" | "WEP" | "nopass";
  // vCard
  name: string;
  phone: string;
  email: string;
  // Text
  text: string;
  // Appearance
  fgColor: string;
  bgColor: string;
  logoEnabled: boolean;
  logoUrl: string;
  logoX: number;
  logoY: number;
  logoSize: number;
  size: number;
  errorLevel: ErrorLevel;
}

const defaults: QrSettings = {
  type: "url",
  url: "https://qraft.studio",
  ssid: "",
  wifiPassword: "",
  wifiEncryption: "WPA",
  name: "",
  phone: "",
  email: "",
  text: "",
  fgColor: "#0E1420",
  bgColor: "#FFFFFF",
  logoEnabled: false,
  logoUrl: "",
  logoX: 50,
  logoY: 50,
  logoSize: 64,
  size: 280,
  errorLevel: "M",
};

const STORAGE_KEY = "qraft-qr-settings";

const MAX_PARAM_LENGTH = 1024;

export function useQrSettings() {
  const [settings, setSettings] = useState<QrSettings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        return { ...defaults, ...saved };
      }
    } catch {
      return defaults;
    }
    return defaults;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update = useCallback(<K extends keyof QrSettings>(key: K, value: QrSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyTemplate = useCallback((template: Partial<QrSettings>) => {
    setSettings((prev) => ({ ...prev, ...template }));
  }, []);

  const getValue = useCallback((s: QrSettings): string => {
    switch (s.type) {
      case "url":
        return s.url || "https://qraft.studio";
      case "wifi":
        return `WIFI:T:${s.wifiEncryption};S:${s.ssid};P:${s.wifiPassword};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${s.name}\nTEL:${s.phone}\nEMAIL:${s.email}\nEND:VCARD`;
      case "text":
        return s.text || "Qraft Studio";
    }
  }, []);

  const toUrlParams = useCallback((s: QrSettings): string => {
    const params = new URLSearchParams();
    const truncate = (val: string) => val.length > MAX_PARAM_LENGTH ? val.slice(0, MAX_PARAM_LENGTH) : val;
    params.set("type", truncate(s.type));
    params.set("fg", truncate(s.fgColor));
    params.set("bg", truncate(s.bgColor));
    params.set("size", String(s.size));
    params.set("ec", truncate(s.errorLevel));
    if (s.type === "url" && s.url) params.set("url", truncate(s.url));
    if (s.type === "wifi") {
      params.set("ssid", truncate(s.ssid));
      params.set("we", truncate(s.wifiEncryption));
    }
    if (s.type === "vcard") {
      if (s.name) params.set("name", truncate(s.name));
      if (s.phone) params.set("phone", truncate(s.phone));
      if (s.email) params.set("email", truncate(s.email));
    }
    if (s.type === "text" && s.text) params.set("text", truncate(s.text));
    if (s.logoEnabled && s.logoUrl) {
      params.set("logo", truncate(s.logoUrl));
      params.set("lx", String(s.logoX));
      params.set("ly", String(s.logoY));
      params.set("ls", String(s.logoSize));
    }
    return params.toString();
  }, []);

  const fromUrlParams = useCallback((search: string): Partial<QrSettings> => {
    const params = new URLSearchParams(search);
    const result: Partial<QrSettings> = {};
    const type = params.get("type");
    if (type && type.length <= MAX_PARAM_LENGTH) result.type = type as QrType;
    const fg = params.get("fg");
    if (fg && fg.length <= MAX_PARAM_LENGTH) result.fgColor = fg;
    const bg = params.get("bg");
    if (bg && bg.length <= MAX_PARAM_LENGTH) result.bgColor = bg;
    const size = params.get("size");
    if (size && size.length <= MAX_PARAM_LENGTH && !isNaN(parseInt(size))) result.size = parseInt(size);
    const ec = params.get("ec");
    if (ec && ec.length <= MAX_PARAM_LENGTH) result.errorLevel = ec as ErrorLevel;
    const url = params.get("url");
    if (url && url.length <= MAX_PARAM_LENGTH) result.url = url;
    const ssid = params.get("ssid");
    if (ssid && ssid.length <= MAX_PARAM_LENGTH) result.ssid = ssid;
    const name = params.get("name");
    if (name && name.length <= MAX_PARAM_LENGTH) result.name = name;
    const phone = params.get("phone");
    if (phone && phone.length <= MAX_PARAM_LENGTH) result.phone = phone;
    const email = params.get("email");
    if (email && email.length <= MAX_PARAM_LENGTH) result.email = email;
    const text = params.get("text");
    if (text && text.length <= MAX_PARAM_LENGTH) result.text = text;
    const logo = params.get("logo");
    if (logo && logo.length <= MAX_PARAM_LENGTH) {
      result.logoEnabled = true;
      result.logoUrl = logo;
      const lx = params.get("lx");
      if (lx && lx.length <= MAX_PARAM_LENGTH && !isNaN(parseInt(lx))) result.logoX = parseInt(lx);
      const ly = params.get("ly");
      if (ly && ly.length <= MAX_PARAM_LENGTH && !isNaN(parseInt(ly))) result.logoY = parseInt(ly);
      const ls = params.get("ls");
      if (ls && ls.length <= MAX_PARAM_LENGTH && !isNaN(parseInt(ls))) result.logoSize = parseInt(ls);
    }
    return result;
  }, []);

  return { settings, update, applyTemplate, getValue, toUrlParams, fromUrlParams };
}
