export function makeImgPath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
export async function bgArrayRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
