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

// Platform ID mapping for RAWG API
export const PLATFORM_MAP: Record<string, { id: string; name: string }> = {
  nes: { id: "49", name: "NES" },
  snes: { id: "83", name: "SNES" },
  genesis: { id: "167", name: "Genesis" },
  "game-boy": { id: "26", name: "Game Boy" },
};

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
    const platformConfig = PLATFORM_MAP[platform.toLowerCase()];
    if (platformConfig) {
      params.append("platforms", platformConfig.id);
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
 * @param rawgGame - Game data from RAWG API
 * @param platformFilter - Optional platform filter to find specific platform in results
 */
export function rawgToGameData(rawgGame: RAWGGame, platformFilter?: string) {
  const year = rawgGame.released
    ? new Date(rawgGame.released).getFullYear()
    : undefined;

  // If platform filter was used, find that specific platform in the platforms array
  let platform = "Unknown";
  if (platformFilter) {
    const platformConfig = PLATFORM_MAP[platformFilter.toLowerCase()];
    if (platformConfig) {
      // Find the platform matching our filter in the game's platforms array
      const matchingPlatform = rawgGame.platforms?.find(
        (p) => p.platform.id.toString() === platformConfig.id
      );
      platform = matchingPlatform?.platform.name || platformConfig.name;
    }
  }
  
  // Fall back to first platform if no filter or not found
  if (platform === "Unknown") {
    platform = rawgGame.platforms[0]?.platform.name || "Unknown";
  }

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

