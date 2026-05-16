/*
 * SSR: esta página es un Server Component async.
 * Las películas se obtienen en el servidor antes de enviar HTML al cliente,
 * mejorando SEO y la carga inicial.
 */
import HeroCarousel from "./components/HeroCarousel";
import MovieCatalog from "./components/MovieCatalog";
import { getCatalogMovies, getFeaturedMovies } from "./lib/omdb";

export default async function PelisFsoPage() {
  const movies = await getCatalogMovies();
  const featured = getFeaturedMovies(movies, 6);

  return (
    <>
      <HeroCarousel movies={featured} />
      <MovieCatalog initialMovies={movies} />
    </>
  );
}
