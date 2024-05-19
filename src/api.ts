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

export interface ITopRated {
  adult: boolean;
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface ITopRatedResult {
  page: number;
  results: ITopRated[];
  total_pages: number;
  total_results: number;
}

export interface IUpcoming {
  adult: boolean;
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IUpcomingResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IUpcoming[];
  total_pages: number;
  total_results: number;
}

export interface ITvLatest {
  adult: boolean;
  backdrop_path: string;
  id: number;
  origin_country: [];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface ITvLatestResult {
  page: number;
  results: ITvLatest[];
  total_pages: number;
  total_results: number;
}

export interface ITvAiringToday {
  adult: Boolean;
  backdrop_path: string;
  id: number;
  origin_country: [];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface ITvAiringTodayResult {
  page: number;
  results: ITvAiringToday[];
  total_pages: number;
  total_results: number;
}

export interface ITvPopular {
  adult: boolean;
  backdrop_path: string;
  id: number;
  origin_country: [];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface ITvPopularResult {
  page: number;
  results: ITvPopular[];
  total_pages: number;
  total_results: number;
}

export interface ITvTopRated {
  adult: boolean;
  backdrop_path: string;
  id: number;
  origin_country: [];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface ITvTopRatedResult {
  page: number;
  results: ITvTopRated[];
  total_pages: number;
  total_results: number;
}

export interface ISearchMovie {
  adult: boolean;
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface ISearchMovieResult {
  page: number;
  results: ISearchMovie[];
  total_pages: number;
  total_results: number;
}

export interface ISearchTv {
  adult: boolean;
  backdrop_path: string;
  id: number;
  origin_country: [];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface ISearchTvResult {
  page: number;
  results: ISearchTv[];
  total_pages: number;
  total_results: number;
}

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${BEARER_KEY}`,
  },
};
export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?language=en-US&page=1`,
    options
  ).then((res) => res.json());
}

export function getMoviesTopRated() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?language=en-US&page=1`,
    options
  ).then((res) => res.json());
}
export function getMoviesUpcoming() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?language=en-US&page=1`,
    options
  ).then((res) => res.json());
}
