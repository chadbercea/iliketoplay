import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Game from "@/lib/models/game";
import { auth } from "@/lib/auth";

// GET /api/games/:id - Get a single game (must belong to authenticated user)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const game = await Game.findOne({ _id: id, userId: session.user.id });
    
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

// PUT /api/games/:id - Update a game (must belong to authenticated user)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    // Ensure userId cannot be changed
    const { userId, ...updateData } = body;
    
    const game = await Game.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    
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

// DELETE /api/games/:id - Delete a game (must belong to authenticated user)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const game = await Game.findOneAndDelete({ _id: id, userId: session.user.id });
    
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

