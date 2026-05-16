"use client";

import Image from "next/image";

import type { MovieSearchItem } from "../types/movie";

interface MovieCardProps {
  movie: MovieSearchItem;
  onSelect: (imdbID: string) => void;
}

function hasPoster(poster: string) {
  return poster && poster !== "N/A";
}

export default function MovieCard({ movie, onSelect }: MovieCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(movie.imdbID)}
      className="group w-full cursor-pointer text-left transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
    >
      <div className="glass-panel relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg transition-shadow group-hover:shadow-red-900/30">
        {hasPoster(movie.Poster) ? (
          <Image
            src={movie.Poster}
            alt={movie.Title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800 p-4 text-center text-sm text-zinc-400">
            Sin poster
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="line-clamp-2 text-sm font-semibold">{movie.Title}</p>
          <p className="text-xs text-zinc-400">{movie.Year}</p>
        </div>
      </div>
      <h3 className="mt-2 line-clamp-1 text-sm font-medium group-hover:text-red-500">
        {movie.Title}
      </h3>
      <p className="text-xs text-zinc-500">{movie.Year}</p>
    </button>
  );
}
