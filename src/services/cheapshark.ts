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

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch from API: ${response.statusText}`);
  }
  return response.json();
}

export const getStores = async (): Promise<CheapSharkStore[]> => {
  return fetchFromApi<CheapSharkStore[]>('/stores');
};

export const searchGames = async (title: string): Promise<CheapSharkGame[]> => {
  return fetchFromApi<CheapSharkGame[]>(`/games?title=${encodeURIComponent(title)}`);
};

export const getGameDetails = async (
  id: string
): Promise<CheapSharkGameDetails> => {
  return fetchFromApi<CheapSharkGameDetails>(`/games?id=${id}`);
};
