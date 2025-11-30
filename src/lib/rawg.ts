/**
 * RAWG API Client
 * Documentation: https://rawg.io/apidocs
 * Free tier: 20,000 requests/month
 */

const RAWG_API_KEY = process.env.RAWG_API_KEY || "";
const RAWG_BASE_URL = "https://api.rawg.io/api";

export interface RAWGGame {
  id: number;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  metacritic?: number;
  description_raw?: string;
  platforms: Array<{
    platform: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  genres: Array<{
    id: number;
    name: string;
  }>;
}

export interface RAWGSearchResponse {
  count: number;
  results: RAWGGame[];
}

/**
 * Search for games on RAWG
 */
export async function searchGames(
  query: string,
  platform?: string
): Promise<RAWGSearchResponse> {
  if (!RAWG_API_KEY) {
    throw new Error("RAWG_API_KEY is not configured");
  }

  const params = new URLSearchParams({
    key: RAWG_API_KEY,
    search: query,
    page_size: "10",
  });

  // Filter by platform if specified
  if (platform) {
    // RAWG platform IDs: NES = 49, SNES = 83, etc.
    const platformMap: Record<string, string> = {
      nes: "49",
      snes: "83",
      genesis: "167",
      "game-boy": "26",
    };
    const platformId = platformMap[platform.toLowerCase()];
    if (platformId) {
      params.append("platforms", platformId);
    }
  }

  const url = `${RAWG_BASE_URL}/games?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }

    const data: RAWGSearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to search RAWG:", error);
    throw error;
  }
}

/**
 * Get detailed game information
 */
export async function getGameDetails(gameId: number): Promise<RAWGGame> {
  if (!RAWG_API_KEY) {
    throw new Error("RAWG_API_KEY is not configured");
  }

  const url = `${RAWG_BASE_URL}/games/${gameId}?key=${RAWG_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }

    const data: RAWGGame = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get game details:", error);
    throw error;
  }
}

/**
 * Convert RAWG game data to our game format
 */
export function rawgToGameData(rawgGame: RAWGGame) {
  const year = rawgGame.released
    ? new Date(rawgGame.released).getFullYear()
    : undefined;

  const platform = rawgGame.platforms[0]?.platform.name || "Unknown";
  const genre = rawgGame.genres[0]?.name || "";

  return {
    title: rawgGame.name,
    platform,
    year,
    genre,
    status: "owned" as const,
    coverImageUrl: rawgGame.background_image,
    notes: `Added from RAWG. Rating: ${rawgGame.rating}/5`,
  };
}

