export interface CheapSharkGame {
  gameID: string;
  steamAppID: string;
  cheapest: string;
  cheapestDealID: string;
  external: string;
  internalName: string;
  thumb: string;
}

export interface CheapSharkDeal {
  storeID: string;
  dealID: string;
  price: string;
  retailPrice: string;
  savings: string;
}

export interface CheapSharkGameDetails {
  info: {
    title: string;
    steamAppID: string;
    thumb: string;
  };
  cheapestPriceEver: {
    price: string;
    date: number;
  };
  deals: CheapSharkDeal[];
}

export interface CheapSharkStore {
  storeID: string;
  storeName: string;
  isActive: number;
  images: {
    banner: string;
    logo: string;
    icon: string;
  };
}

const BASE_URL = "https://www.cheapshark.com/api/1.0";

export const getStores = async (): Promise<CheapSharkStore[]> => {
  const response = await fetch(`${BASE_URL}/stores`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stores: ${response.statusText}`);
  }
  return response.json();
};

export const searchGames = async (title: string): Promise<CheapSharkGame[]> => {
  const response = await fetch(
    `${BASE_URL}/games?title=${encodeURIComponent(title)}`
  );
  if (!response.ok) {
    throw new Error(`Failed to search games: ${response.statusText}`);
  }
  return response.json();
};

export const getGameDetails = async (
  id: string
): Promise<CheapSharkGameDetails> => {
  const response = await fetch(`${BASE_URL}/games?id=${id}`);
  if (!response.ok) {
    throw new Error(`Failed to get game details: ${response.statusText}`);
  }
  return response.json();
};
