import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

// GET /api/players/[id] - Get player details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const player = await Player.findById(params.id).populate('teamId', 'name');

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: player });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/players/[id] - Update player
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, imageUrl, city, isCaptain, isWicketKeeper, playingRole, teamId, battingOrder } = body;

    // If setting this player as captain, remove captain status from other players in the team
    if (isCaptain && teamId) {
      await Player.updateMany(
        { teamId, isCaptain: true, _id: { $ne: params.id } },
        { isCaptain: false }
      );
    }

    const player = await Player.findByIdAndUpdate(
      params.id,
      { name, imageUrl, city, isCaptain, isWicketKeeper, playingRole, teamId, battingOrder },
      { new: true, runValidators: true }
    ).populate('teamId', 'name');

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: player });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/players/[id] - Delete player
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const player = await Player.findByIdAndDelete(params.id);

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Player deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
