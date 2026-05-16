"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { getMovieById } from "../lib/omdb";
import type { MovieDetail } from "../types/movie";

interface MovieModalProps {
  imdbID: string | null;
  onClose: () => void;
}

function hasPoster(poster: string) {
  return poster && poster !== "N/A";
}

export default function MovieModal({ imdbID, onClose }: MovieModalProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imdbID) {
      setMovie(null);
      setError(null);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      setMovie(null);

      const detail = await getMovieById(imdbID);

      if (!detail) {
        setError("No se pudo cargar el detalle de la película.");
      } else {
        setMovie(detail);
      }

      setLoading(false);
    };

    fetchDetail();
  }, [imdbID]);

  useEffect(() => {
    if (!imdbID) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [imdbID, onClose]);

  if (!imdbID) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-label="Cerrar modal"
      />

      <div className="glass-panel relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Cerrar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading && (
          <div className="flex min-h-[280px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-600 border-t-red-600" />
          </div>
        )}

        {error && !loading && (
          <p className="py-12 text-center text-red-400">{error}</p>
        )}

        {movie && !loading && (
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="relative mx-auto aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-lg md:mx-0 md:w-56">
              {hasPoster(movie.Poster) ? (
                <Image
                  src={movie.Poster}
                  alt={movie.Title}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-zinc-800 text-zinc-500">
                  Sin poster
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 id="movie-modal-title" className="text-2xl font-bold md:text-3xl">
                {movie.Title}
              </h2>
              <p className="mt-1 text-zinc-400">
                {movie.Year} · <span className="capitalize">{movie.Type}</span>
              </p>

              <dl className="mt-6 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-zinc-300">Género</dt>
                  <dd className="text-zinc-400">{movie.Genre || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-zinc-300">Director</dt>
                  <dd className="text-zinc-400">{movie.Director || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-zinc-300">Actores</dt>
                  <dd className="text-zinc-400">{movie.Actors || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-zinc-300">Duración</dt>
                  <dd className="text-zinc-400">{movie.Runtime || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-zinc-300">Rating IMDb</dt>
                  <dd className="text-amber-400">
                    {movie.imdbRating && movie.imdbRating !== "N/A"
                      ? `${movie.imdbRating} / 10`
                      : "N/A"}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <h3 className="font-semibold text-zinc-300">Sinopsis</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {movie.Plot || "Sinopsis no disponible."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
