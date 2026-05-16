"use client";

import { useEffect, useState } from "react";

import { getMovies } from "../lib/omdb";
import type { MovieSearchItem } from "../types/movie";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";
import SearchBar from "./SearchBar";

interface MovieCatalogProps {
  initialMovies: MovieSearchItem[];
}

export default function MovieCatalog({ initialMovies }: MovieCatalogProps) {
  const [movies, setMovies] = useState<MovieSearchItem[]>(initialMovies);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setMovies(initialMovies);
      setError(null);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      const results = await getMovies(query);

      if (results.length === 0) {
        setError("No se encontraron resultados. Intenta con otro término.");
      }

      setMovies(results);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, initialMovies]);

  const handleSelect = (imdbID: string) => {
    setSelectedId(imdbID);
  };

  const handleCloseModal = () => {
    setSelectedId(null);
  };

  return (
    <section id="catalogo" className="scroll-mt-4 px-6 py-10 md:px-12">
      <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">Catálogo</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {query.trim()
              ? `Resultados para "${query}"`
              : "Películas y series de distintos géneros y años recientes"}
          </p>
        </div>
        <SearchBar value={query} onChange={setQuery} loading={loading} />
      </header>

      {error && (
        <p className="mb-6 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && movies.length === 0 && !error && (
        <p className="text-center text-zinc-500">No hay películas para mostrar.</p>
      )}

      {loading && movies.length === 0 && (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-600 border-t-red-600" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} onSelect={handleSelect} />
        ))}
      </div>

      <MovieModal imdbID={selectedId} onClose={handleCloseModal} />
    </section>
  );
}
