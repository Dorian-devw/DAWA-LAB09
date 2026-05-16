import type { Metadata } from "next";

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
      {children}
    </div>
  );
}
