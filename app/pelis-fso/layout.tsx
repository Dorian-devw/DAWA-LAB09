import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PELIS-FSO",
  description: "Galería de películas y series con SSR y CSR usando OMDb",
};

export default function PelisFsoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[var(--cinema-bg)] text-white">
      <header className="w-full bg-neutral-800/40 backdrop-blur-sm border-b border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-semibold">PELIS-FSO</span>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
