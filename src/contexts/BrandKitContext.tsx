import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface BrandKit {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  createdAt: number;
}

interface BrandKitContextValue {
  brands: BrandKit[];
  createBrand: (brand: Omit<BrandKit, "id" | "createdAt">) => BrandKit;
  updateBrand: (id: string, updates: Partial<Omit<BrandKit, "id" | "createdAt">>) => void;
  deleteBrand: (id: string) => void;
  getBrand: (id: string) => BrandKit | undefined;
  listBrands: () => BrandKit[];
  applyBrand: (id: string) => BrandKit | undefined;
}

const STORAGE_KEY = "brand-kits";

const BrandKitContext = createContext<BrandKitContextValue | undefined>(undefined);

export function BrandKitProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<BrandKit[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      return [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
  }, [brands]);

  const createBrand = useCallback((data: Omit<BrandKit, "id" | "createdAt">): BrandKit => {
    const brand: BrandKit = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setBrands((prev) => [...prev, brand]);
    return brand;
  }, []);

  const updateBrand = useCallback((id: string, updates: Partial<Omit<BrandKit, "id" | "createdAt">>) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const deleteBrand = useCallback((id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const getBrand = useCallback((id: string) => {
    return brands.find((b) => b.id === id);
  }, [brands]);

  const listBrands = useCallback(() => {
    return [...brands];
  }, [brands]);

  const applyBrand = useCallback((id: string) => {
    const brand = brands.find((b) => b.id === id);
    if (brand) {
      const event = new CustomEvent("brand-kit:apply", { detail: brand });
      window.dispatchEvent(event);
    }
    return brand;
  }, [brands]);

  return (
    <BrandKitContext.Provider
      value={{ brands, createBrand, updateBrand, deleteBrand, getBrand, listBrands, applyBrand }}
    >
      {children}
    </BrandKitContext.Provider>
  );
}

export function useBrandKit(): BrandKitContextValue {
  const context = useContext(BrandKitContext);
  if (!context) {
    throw new Error("useBrandKit must be used within a BrandKitProvider");
  }
  return context;
}
