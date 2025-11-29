import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Game from "@/lib/models/game";

// GET /api/games/:id - Get a single game
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const game = await Game.findById(id);
    
    if (!game) {
      return NextResponse.json(
        { success: false, error: "Game not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: game });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}

// PUT /api/games/:id - Update a game
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const game = await Game.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!game) {
      return NextResponse.json(
        { success: false, error: "Game not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: game });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update game" },
      { status: 400 }
    );
  }
}

// DELETE /api/games/:id - Delete a game
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const game = await Game.findByIdAndDelete(id);
    
    if (!game) {
      return NextResponse.json(
        { success: false, error: "Game not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete game" },
      { status: 500 }
    );
  }
}

