// IGDB API Service
// Documentation: https://api-docs.igdb.com/

export interface IGDBGame {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  storyline?: string;
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  total_rating?: number;
  total_rating_count?: number;
  first_release_date?: number;
  cover?: {
    id: number;
    image_id: string;
  };
  platforms?: {
    id: number;
    name: string;
    abbreviation?: string;
  }[];
  genres?: {
    id: number;
    name: string;
  }[];
  screenshots?: {
    id: number;
    image_id: string;
  }[];
  websites?: {
    id: number;
    url: string;
    category: number;
  }[];
  involved_companies?: {
    id: number;
    company: {
      id: number;
      name: string;
    };
    developer: boolean;
    publisher: boolean;
  }[];
}

export interface IGDBPlatform {
  id: number;
  name: string;
  abbreviation?: string;
  platform_family?: {
    id: number;
    name: string;
  };
}

// Token cache
let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Reset token cache - used for testing
 */
export function resetTokenCache(): void {
  accessToken = null;
  tokenExpiry = 0;
}

/**
 * Get OAuth2 access token from Twitch
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 5 min buffer)
  if (accessToken && Date.now() < tokenExpiry - 300000) {
    return accessToken;
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set in environment variables"
    );
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST" }
  );

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return accessToken!;
}

/**
 * Make authenticated request to IGDB API
 */
async function igdbFetch<T>(endpoint: string, body: string): Promise<T> {
  const token = await getAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID!;

  const response = await fetch(`https://api.igdb.com/v4${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`IGDB API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search games by name
 */
export async function searchGames(
  query: string,
  limit: number = 20
): Promise<IGDBGame[]> {
  const body = `
    search "${query}";
    fields name, slug, summary, rating, aggregated_rating, total_rating,
           first_release_date, cover.image_id,
           platforms.name, platforms.abbreviation,
           genres.name;
    limit ${limit};
  `;

  return igdbFetch<IGDBGame[]>("/games", body);
}

/**
 * Get game details by ID
 */
export async function getGameById(id: number): Promise<IGDBGame | null> {
  const body = `
    where id = ${id};
    fields name, slug, summary, storyline,
           rating, rating_count,
           aggregated_rating, aggregated_rating_count,
           total_rating, total_rating_count,
           first_release_date,
           cover.image_id,
           platforms.name, platforms.abbreviation,
           genres.name,
           screenshots.image_id,
           websites.url, websites.category,
           involved_companies.company.name, involved_companies.developer, involved_companies.publisher;
    limit 1;
  `;

  const games = await igdbFetch<IGDBGame[]>("/games", body);
  return games[0] || null;
}

/**
 * Get game details by slug
 */
export async function getGameBySlug(slug: string): Promise<IGDBGame | null> {
  const body = `
    where slug = "${slug}";
    fields name, slug, summary, storyline,
           rating, rating_count,
           aggregated_rating, aggregated_rating_count,
           total_rating, total_rating_count,
           first_release_date,
           cover.image_id,
           platforms.name, platforms.abbreviation,
           genres.name,
           screenshots.image_id,
           websites.url, websites.category,
           involved_companies.company.name, involved_companies.developer, involved_companies.publisher;
    limit 1;
  `;

  const games = await igdbFetch<IGDBGame[]>("/games", body);
  return games[0] || null;
}

/**
 * Get list of platforms
 */
export async function getPlatforms(): Promise<IGDBPlatform[]> {
  const body = `
    fields name, abbreviation, platform_family.name;
    limit 500;
    sort name asc;
  `;

  return igdbFetch<IGDBPlatform[]>("/platforms", body);
}

/**
 * Get popular/trending games
 */
export async function getPopularGames(limit: number = 20): Promise<IGDBGame[]> {
  const body = `
    fields name, slug, summary, rating, aggregated_rating, total_rating,
           first_release_date, cover.image_id,
           platforms.name, platforms.abbreviation,
           genres.name;
    where total_rating_count > 50;
    sort total_rating desc;
    limit ${limit};
  `;

  return igdbFetch<IGDBGame[]>("/games", body);
}

/**
 * Search games by platform
 */
export async function searchGamesByPlatform(
  platformId: number,
  limit: number = 20
): Promise<IGDBGame[]> {
  const body = `
    fields name, slug, summary, rating, aggregated_rating, total_rating,
           first_release_date, cover.image_id,
           platforms.name, platforms.abbreviation,
           genres.name;
    where platforms = (${platformId});
    sort total_rating desc;
    limit ${limit};
  `;

  return igdbFetch<IGDBGame[]>("/games", body);
}

/**
 * Get IGDB image URL
 * @param imageId - The image_id from IGDB
 * @param size - Image size: cover_small, cover_big, screenshot_med, screenshot_big, screenshot_huge, 720p, 1080p
 */
export function getImageUrl(
  imageId: string,
  size: "cover_small" | "cover_big" | "screenshot_med" | "screenshot_big" | "screenshot_huge" | "720p" | "1080p" = "cover_big"
): string {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

// Website category constants from IGDB
export const WEBSITE_CATEGORIES = {
  1: "official",
  2: "wikia",
  3: "wikipedia",
  4: "facebook",
  5: "twitter",
  6: "twitch",
  8: "instagram",
  9: "youtube",
  10: "iphone",
  11: "ipad",
  12: "android",
  13: "steam",
  14: "reddit",
  15: "itch",
  16: "epicgames",
  17: "gog",
  18: "discord",
} as const;
