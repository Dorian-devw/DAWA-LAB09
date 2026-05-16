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
          <Link href="/" className="flex items-center gap-3 hover:opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3l9 8h-3v7a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2v-7H1l11-8z" />
            </svg>
            <span className="font-semibold">Inicio</span>
          </Link>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
