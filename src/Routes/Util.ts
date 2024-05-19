export function makeImgPath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
export async function bgArrayRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export enum movieStatus {
  latest = "latest",
  topRated = "topRated",
  upComming = "upComming",
}

export enum tvStatus {
  latest = "latest",
  airingToday = "airingToday",
  popular = "popular",
  rated = "rated",
}

export enum searchStatus {
  searchTv = "searchTv",
  searchMovie = "searchMovie",
}
