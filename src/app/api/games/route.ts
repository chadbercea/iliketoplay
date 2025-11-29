import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Game from "@/lib/models/game";

// GET /api/games - Get all games
export async function GET() {
  try {
    await dbConnect();
    const games = await Game.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: games });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

// POST /api/games - Create a new game
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const game = await Game.create(body);
    return NextResponse.json({ success: true, data: game }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create game" },
      { status: 400 }
    );
  }
}

