export const API_KEY = "4d61ce9eafcbe91b13a841f060a1ec14";
const BEARER_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDYxY2U5ZWFmY2JlOTFiMTNhODQxZjA2MGExZWMxNCIsInN1YiI6IjVmNjAzNTA1MzEyMzQ1MDAzOTY1ZmYyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tCZ21xfS4oFnkXa17pWIkp-kV2XCJWcGm1CsPd8WYJk";
const BASE_PATH = "https://api.themoviedb.org/3/";

export interface IHomeMovies {
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
  video?: boolean;
}

export interface IHomeMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IHomeMovies[];
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

export interface ISearch {
  adult?: boolean;
  backdrop_path?: string;
  id?: number;
  original_language?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  first_air_date?: string;
  release_date?: string;
  title?: string;
  name?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  origin_country?: [];
}

export interface ISearchResult {
  page: number;
  results: ISearch[];
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

export function getTv() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?language=en-US&page=1`,
    options
  ).then((res) => res.json());
}

export function getTvAiringToday() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?language=en-US&page=1`,
    options
  ).then((res) => res.json());
}
export function getTvPopular() {
  return fetch(`${BASE_PATH}/tv/popular?language=en-US&page=1`, options).then(
    (res) => res.json()
  );
}
export function getTvTopRated() {
  return fetch(`${BASE_PATH}/tv/top_rated?language=en-US&page=1`, options).then(
    (res) => res.json()
  );
}

export function getSearchMovie(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?query=${keyword}&include_adult=true&language=en-US&page=1`,
    options
  ).then((res) => res.json());
}
export function getSearchTv(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?query=${keyword}&include_adult=true&language=en-US&page=1`,
    options
  ).then((res) => res.json());
}
