"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import type { MovieSearchItem } from "../types/movie";

interface HeroCarouselProps {
  movies: MovieSearchItem[];
}

const AUTO_PLAY_MS = 6000;

function hasPoster(poster: string) {
  return poster && poster !== "N/A";
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = movies.length;
  const current = movies[activeIndex] ?? null;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (count <= 1) return;

    const timer = setInterval(goNext, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [count, goNext]);

  if (!current) {
    return (
      <section className="relative flex h-[50vh] min-h-[320px] items-end bg-zinc-950 px-6 pb-12 md:px-12">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-red-600">
            PELIS-FSO
          </p>
          <h1 className="mt-2 max-w-2xl text-4xl font-bold md:text-5xl">
            Galería de películas y series
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[55vh] min-h-[360px] w-full overflow-hidden">
      {movies.map((movie, index) => (
        <div
          key={movie.imdbID}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={index !== activeIndex}
        >
          {hasPoster(movie.Poster) ? (
            <Image
              src={movie.Poster}
              alt=""
              fill
              priority={index === 0}
              className="object-cover object-top"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
          )}
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[var(--cinema-bg)] via-black/70 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-14 md:px-12 md:pb-16">
        <p className="text-sm font-medium uppercase tracking-widest text-red-600">
          Destacados · {activeIndex + 1} / {count}
        </p>
        <h1 className="mt-2 max-w-3xl text-4xl font-bold transition-all md:text-6xl">
          {current.Title}
        </h1>
        <p className="mt-3 flex flex-wrap items-center gap-3 text-zinc-300">
          <span>{current.Year}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-500" />
          <span className="capitalize">{current.Type}</span>
        </p>
        <a
          href="#catalogo"
          className="mt-6 w-fit rounded bg-[var(--cinema-accent)] px-8 py-2.5 text-sm font-semibold transition hover:bg-red-700"
        >
          Explorar catálogo
        </a>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70"
            aria-label="Anterior"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70"
            aria-label="Siguiente"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {movies.map((movie, index) => (
              <button
                key={movie.imdbID}
                type="button"
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-8 bg-red-600"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Ir a ${movie.Title}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
