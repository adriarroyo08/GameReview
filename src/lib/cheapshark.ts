export interface Game {
  gameID: string;
  steamAppID: string | null;
  cheapest: string;
  cheapestDealID: string;
  external: string;
  internalName: string;
  thumb: string;
}

export const CHEAPSHARK_BASE_URL = "https://www.cheapshark.com/api/1.0";

export async function getGames(title: string): Promise<Game[]> {
  const response = await fetch(`${CHEAPSHARK_BASE_URL}/games?title=${encodeURIComponent(title)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.statusText}`);
  }
  return response.json();
}
