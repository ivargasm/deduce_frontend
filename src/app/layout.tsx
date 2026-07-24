import type { Metadata } from "next";
import { Geist, Geist_Mono, Hanken_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"
import Navbar from "./components/navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Deduce | Maximiza tu salud fiscal y saldo a favor",
    template: "%s | Deduce"
  },
  description: "Plataforma inteligente para profesionistas e independientes en México. Controla tus facturas, proyecta tu ISR anual y maximiza tu devolución de impuestos ante el SAT.",
  keywords: ["deducciones personales", "SAT", "impuestos", "devolución de impuestos", "ISR", "facturas", "contabilidad México"],
  authors: [{ name: "Ismael Vargas Martinez" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://deduce.juristechespace.com",
    title: "Deduce | Tu aliado fiscal",
    description: "Controla tus facturas y maximiza tu devolución de impuestos.",
    siteName: "Deduce",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hankenGrotesk.variable} ${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
