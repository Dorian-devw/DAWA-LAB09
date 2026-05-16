import axios from "axios";

import type {
  MovieDetail,
  MovieSearchItem,
  OmdbDetailResponse,
  OmdbSearchResponse,
} from "../types/movie";

const BASE_URL = "https://www.omdbapi.com/";
const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;

type OmdbType = "movie" | "series" | "episode";

interface GetMoviesOptions {
  year?: string;
  type?: OmdbType;
}

export async function getMovies(
  search: string,
  options?: GetMoviesOptions
): Promise<MovieSearchItem[]> {
  if (!search.trim()) return [];

  try {
    const { data } = await axios.get<OmdbSearchResponse>(BASE_URL, {
      params: {
        apikey: apiKey,
        s: search.trim(),
        ...(options?.year && { y: options.year }),
        ...(options?.type && { type: options.type }),
      },
    });

    if (data.Response !== "True" || !data.Search) {
      if (data.Error) console.error("[OMDb]", data.Error);
      return [];
    }

    return data.Search;
  } catch (error) {
    console.error("[OMDb] getMovies:", error);
    return [];
  }
}

export async function getMovieById(id: string): Promise<MovieDetail | null> {
  if (!id.trim()) return null;

  try {
    const { data } = await axios.get<OmdbDetailResponse>(BASE_URL, {
      params: {
        apikey: apiKey,
        i: id.trim(),
      },
    });

    if (data.Response !== "True") {
      if (data.Error) console.error("[OMDb]", data.Error);
      return null;
    }

    return {
      imdbID: data.imdbID,
      Title: data.Title,
      Year: data.Year,
      Type: data.Type,
      Poster: data.Poster,
      Plot: data.Plot,
      Genre: data.Genre,
      Director: data.Director,
      Actors: data.Actors,
      imdbRating: data.imdbRating,
      Runtime: data.Runtime,
    };
  } catch (error) {
    console.error("[OMDb] getMovieById:", error);
    return null;
  }
}

function hasValidPoster(poster: string) {
  return poster && poster !== "N/A";
}

function parseYear(year: string) {
  const match = year.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
}

/** Mezcla resultados de varias búsquedas para un catálogo variado (no solo un género). */
function mergeCatalogBatches(batches: MovieSearchItem[][], perBatch = 4): MovieSearchItem[] {
  const seen = new Set<string>();
  const merged: MovieSearchItem[] = [];

  for (let i = 0; i < perBatch; i++) {
    for (const batch of batches) {
      const movie = batch[i];
      if (movie && !seen.has(movie.imdbID)) {
        seen.add(movie.imdbID);
        merged.push(movie);
      }
    }
  }

  return merged;
}

/** Catálogo inicial diverso: años recientes, géneros y series. */
export async function getCatalogMovies(): Promise<MovieSearchItem[]> {
  const year = new Date().getFullYear();

  const queries: { s: string; type?: OmdbType; year?: string }[] = [
    { s: String(year), type: "movie" },
    { s: String(year - 1), type: "movie" },
    { s: "action", type: "movie" },
    { s: "drama", type: "movie" },
    { s: "comedy", type: "movie" },
    { s: "adventure", type: "movie" },
    { s: "thriller", type: "movie" },
    { s: "animation", type: "movie" },
    { s: "science fiction", type: "movie" },
    { s: "documentary", type: "movie" },
    { s: "series", type: "series" },
  ];

  const batches = await Promise.all(
    queries.map((q) => getMovies(q.s, { type: q.type, year: q.year }))
  );

  return mergeCatalogBatches(batches, 5);
}

/** Destacados para el carrusel: poster válido y prioridad por año reciente. */
export function getFeaturedMovies(
  catalog: MovieSearchItem[],
  limit = 6
): MovieSearchItem[] {
  const withPoster = catalog.filter((m) => hasValidPoster(m.Poster));
  const sorted = [...withPoster].sort(
    (a, b) => parseYear(b.Year) - parseYear(a.Year)
  );

  if (sorted.length >= limit) return sorted.slice(0, limit);

  const seen = new Set(sorted.map((m) => m.imdbID));
  for (const movie of catalog) {
    if (sorted.length >= limit) break;
    if (!seen.has(movie.imdbID)) {
      seen.add(movie.imdbID);
      sorted.push(movie);
    }
  }

  return sorted.slice(0, limit);
}
