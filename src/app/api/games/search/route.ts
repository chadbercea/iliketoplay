import { NextRequest, NextResponse } from "next/server";
import { searchGames, rawgToGameData, PLATFORM_MAP } from "@/lib/rawg";
import dbConnect from "@/lib/db";
import GameCache from "@/lib/models/game-cache";
import { auth } from "@/lib/auth";

// GET /api/games/search?q=mario&platform=nes
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const platform = searchParams.get("platform");

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Step 1: Check cache first
    const cacheQuery: any = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { platform: { $regex: query, $options: 'i' } },
      ],
    };

    if (platform) {
      cacheQuery.platform = { $regex: platform, $options: 'i' };
    }

    const cachedResults = await GameCache.find(cacheQuery).limit(20).lean();

    if (cachedResults.length > 0) {
      // Cache hit - return cached results
      const games = cachedResults.map((cached) => ({
        rawgId: cached.rawgId,
        title: cached.title,
        platform: cached.platform,
        year: cached.year,
        genre: cached.genre,
        coverImageUrl: cached.coverImageUrl,
        notes: cached.description ? `Added from RAWG. ${cached.description.substring(0, 100)}...` : `Added from RAWG. Rating: ${cached.rating?.toFixed(2) || 'N/A'}/5`,
      }));

      return NextResponse.json({
        success: true,
        count: cachedResults.length,
        data: games,
        cached: true,
      });
    }

    // Step 2: Cache miss - check if RAWG API is configured
    if (!process.env.RAWG_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "RAWG API not configured. Please use manual entry.",
          fallbackToManual: true,
        },
        { status: 503 }
      );
    }

    // Step 3: Search RAWG API
    const results = await searchGames(query, platform || undefined);

    // Step 4: Save results to cache
    const cachePromises = results.results.map(async (game) => {
      try {
        // Determine the correct platform to cache
        let cachePlatform = "Unknown";
        if (platform) {
          const platformConfig = PLATFORM_MAP[platform.toLowerCase()];
          if (platformConfig) {
            const matchingPlatform = game.platforms?.find(
              (p) => p.platform.id.toString() === platformConfig.id
            );
            cachePlatform = matchingPlatform?.platform.name || platformConfig.name;
          }
        }
        if (cachePlatform === "Unknown") {
          cachePlatform = game.platforms?.[0]?.platform?.name || "Unknown";
        }

        await GameCache.findOneAndUpdate(
          { rawgId: game.id },
          {
            rawgId: game.id,
            title: game.name,
            platform: cachePlatform,
            year: game.released ? new Date(game.released).getFullYear() : undefined,
            genre: game.genres?.[0]?.name || undefined,
            coverImageUrl: game.background_image || undefined,
            rating: game.rating || undefined,
            metacritic: game.metacritic || undefined,
            description: game.description_raw || undefined,
            metadata: {
              platforms: game.platforms?.map((p) => p.platform.name) || [],
              genres: game.genres?.map((g) => g.name) || [],
              developers: [],
              publishers: [],
            },
            cachedAt: new Date(),
          },
          { upsert: true, new: true }
        );
      } catch (cacheError) {
        // Don't fail the whole request if caching fails
        console.error('Failed to cache game:', game.id, cacheError);
      }
    });

    // Wait for all cache operations to complete (non-blocking)
    Promise.all(cachePromises).catch((err) => console.error('Cache save error:', err));

    // Step 5: Return results
    const games = results.results.map((game) => ({
      rawgId: game.id,
      ...rawgToGameData(game, platform || undefined),
    }));

    return NextResponse.json({
      success: true,
      count: results.count,
      data: games,
      cached: false,
    });
  } catch (error: any) {
    console.error("Search error:", error);

    // Graceful degradation - tell client to fall back to manual entry
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Search failed. Please use manual entry.",
        fallbackToManual: true,
      },
      { status: 500 }
    );
  }
}

