export interface MovieSearchItem {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  Plot: string;
  Genre: string;
  Director: string;
  Actors: string;
  imdbRating: string;
  Runtime: string;
}

export interface OmdbSearchResponse {
  Search?: MovieSearchItem[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}

export interface OmdbDetailResponse extends MovieDetail {
  Response: "True" | "False";
  Error?: string;
}
