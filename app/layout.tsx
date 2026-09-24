import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SunnyValley — Turismo, Lore, Regras e VIPs",
  description: "Olá, turista. Conheça SunnyValley, consulte as regras oficiais, encontre seu imóvel e compre sua passagem para a cidade.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  icons: { icon: "/assets/emblema-sunnyvalley.webp", shortcut: "/assets/emblema-sunnyvalley.webp" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}

