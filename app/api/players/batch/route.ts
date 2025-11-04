import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

// PUT /api/players/batch - Bulk update players (for batting order)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Request body must be an array of player updates' },
        { status: 400 }
      );
    }

    // Bulk update players
    const bulkOps = body.map((player) => ({
      updateOne: {
        filter: { _id: player._id },
        update: { $set: player },
      },
    }));

    await Player.bulkWrite(bulkOps);

    return NextResponse.json({
      success: true,
      message: 'Players updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
