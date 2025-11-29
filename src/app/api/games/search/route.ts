import { NextRequest, NextResponse } from "next/server";
import { searchGames, rawgToGameData } from "@/lib/rawg";

// GET /api/games/search?q=mario&platform=nes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const platform = searchParams.get("platform");

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // Check if RAWG API key is configured
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

    // Search RAWG
    const results = await searchGames(query, platform || undefined);

    // Convert to our format
    const games = results.results.map((game) => ({
      rawgId: game.id,
      ...rawgToGameData(game),
    }));

    return NextResponse.json({
      success: true,
      count: results.count,
      data: games,
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

