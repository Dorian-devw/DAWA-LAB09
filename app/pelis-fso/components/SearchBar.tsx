"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
}

export default function SearchBar({ value, onChange, loading }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <svg
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar películas o series..."
        className="glass-panel w-full rounded-full border border-zinc-700/50 py-3 pl-12 pr-12 text-white placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
      />
      {loading && (
        <div
          className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-zinc-600 border-t-red-600"
          role="status"
          aria-label="Buscando"
        />
      )}
    </div>
  );
}
