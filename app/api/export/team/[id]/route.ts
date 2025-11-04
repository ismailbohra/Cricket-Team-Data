import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';
import Player from '@/models/Player';
import * as XLSX from 'xlsx';

// POST /api/export/team/[id] - Export team data to Excel
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const team = await Team.findById(id);
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    const players = await Player.find({ teamId: id }).sort({ battingOrder: 1, name: 1 });

    // Prepare data for Excel
    const data = players.map((player) => ({
      'Player Name': player.name,
      'City': player.city || '',
      'Playing Role': player.playingRole,
      'Captain': player.isCaptain ? 'Yes' : 'No',
      'Wicket Keeper': player.isWicketKeeper ? 'Yes' : 'No',
      'Batting Order': player.battingOrder || '',
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Player Name
      { wch: 15 }, // City
      { wch: 15 }, // Playing Role
      { wch: 10 }, // Captain
      { wch: 15 }, // Wicket Keeper
      { wch: 15 }, // Batting Order
    ];

    XLSX.utils.book_append_sheet(wb, ws, team.name);

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${team.name.replace(/[^a-z0-9]/gi, '_')}_players.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
