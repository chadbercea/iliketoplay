import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Game from "@/lib/models/game";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const games = await Game.find({ userId: session.user.id });

    // Calculate statistics
    const totalGames = games.length;
    const ownedCount = games.filter((g) => g.status === "owned").length;
    const wishlistCount = games.filter((g) => g.status === "wishlist").length;

    // Platform breakdown
    const platformCounts: Record<string, number> = {};
    games.forEach((game) => {
      platformCounts[game.platform] = (platformCounts[game.platform] || 0) + 1;
    });
    const platformBreakdown = Object.entries(platformCounts).map(([name, count]) => ({
      name,
      count,
    })).sort((a, b) => b.count - a.count);

    // Genre breakdown
    const genreCounts: Record<string, number> = {};
    games.forEach((game) => {
      if (game.genre) {
        genreCounts[game.genre] = (genreCounts[game.genre] || 0) + 1;
      }
    });
    const genreBreakdown = Object.entries(genreCounts).map(([name, count]) => ({
      name,
      count,
    })).sort((a, b) => b.count - a.count);

    // Condition breakdown (only for owned games)
    const conditionCounts: Record<string, number> = {};
    games.forEach((game) => {
      if (game.status === "owned" && game.condition) {
        conditionCounts[game.condition] = (conditionCounts[game.condition] || 0) + 1;
      }
    });
    const conditionBreakdown = Object.entries(conditionCounts).map(([name, count]) => ({
      name,
      count,
    }));

    // Total collection value
    let totalValue = 0;
    games.forEach((game) => {
      if (game.purchaseInfo?.price) {
        totalValue += game.purchaseInfo.price;
      }
    });

    // Average game year
    const yearsWithGames = games.filter((g) => g.year).map((g) => g.year as number);
    const averageYear = yearsWithGames.length > 0
      ? Math.round(yearsWithGames.reduce((sum, year) => sum + year, 0) / yearsWithGames.length)
      : null;

    // Status breakdown for charts
    const statusBreakdown = [
      { name: "Owned", count: ownedCount },
      { name: "Wishlist", count: wishlistCount },
    ];

    return NextResponse.json({
      success: true,
      stats: {
        totalGames,
        ownedCount,
        wishlistCount,
        totalValue,
        averageYear,
        platformBreakdown,
        genreBreakdown,
        conditionBreakdown,
        statusBreakdown,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

