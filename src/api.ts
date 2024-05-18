export const API_KEY = "4d61ce9eafcbe91b13a841f060a1ec14";
const BEARER_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDYxY2U5ZWFmY2JlOTFiMTNhODQxZjA2MGExZWMxNCIsInN1YiI6IjVmNjAzNTA1MzEyMzQ1MDAzOTY1ZmYyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tCZ21xfS4oFnkXa17pWIkp-kV2XCJWcGm1CsPd8WYJk";
const BASE_PATH = "https://api.themoviedb.org/3/";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_title: string;
  original_language: string;
  popularity: number;
  release_date: string;
  vote_average: number;
  vote_count: number;
  adult: boolean;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${BEARER_KEY}`,
    },
  };
  return fetch(
    `${BASE_PATH}/movie/now_playing?language=en-US&page=1`,
    options
  ).then((res) => res.json());
}
