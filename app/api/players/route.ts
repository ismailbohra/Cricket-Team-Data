import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

// GET /api/players - Get all players or players by team
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const search = searchParams.get('search') || '';

    let query: any = {};

    if (teamId) {
      query.teamId = teamId;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const players = await Player.find(query)
      .populate('teamId', 'name')
      .sort({ battingOrder: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: players });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/players - Create player(s)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    // Handle bulk creation
    if (Array.isArray(body)) {
      // Validate that all players have required fields
      for (const player of body) {
        if (!player.name || !player.teamId || !player.playingRole) {
          return NextResponse.json(
            { success: false, error: 'Each player must have name, teamId, and playingRole' },
            { status: 400 }
          );
        }
      }

      const players = await Player.insertMany(body);
      return NextResponse.json({ success: true, data: players }, { status: 201 });
    }

    // Handle single player creation
    const { name, imageUrl, city, isCaptain, isWicketKeeper, playingRole, teamId, battingOrder } = body;

    if (!name || !teamId || !playingRole) {
      return NextResponse.json(
        { success: false, error: 'Name, teamId, and playingRole are required' },
        { status: 400 }
      );
    }

    // If this player is captain, remove captain status from other players in the team
    if (isCaptain) {
      await Player.updateMany(
        { teamId, isCaptain: true },
        { isCaptain: false }
      );
    }

    const player = await Player.create({
      name,
      imageUrl,
      city,
      isCaptain: isCaptain || false,
      isWicketKeeper: isWicketKeeper || false,
      playingRole,
      teamId,
      battingOrder,
    });

    await player.populate('teamId', 'name');

    return NextResponse.json({ success: true, data: player }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
