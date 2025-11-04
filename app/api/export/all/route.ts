import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';
import Player from '@/models/Player';
import * as XLSX from 'xlsx';

// POST /api/export/all - Export all teams data to Excel
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const teams = await Team.find().sort({ name: 1 });

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create a sheet for each team
    for (const team of teams) {
      const players = await Player.find({ teamId: team._id }).sort({ battingOrder: 1, name: 1 });

      const data = players.map((player) => ({
        'Player Name': player.name,
        'City': player.city || '',
        'Playing Role': player.playingRole,
        'Captain': player.isCaptain ? 'Yes' : 'No',
        'Wicket Keeper': player.isWicketKeeper ? 'Yes' : 'No',
        'Batting Order': player.battingOrder || '',
      }));

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

      // Sheet name limited to 31 characters
      const sheetName = team.name.substring(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="all_teams_players.xlsx"`,
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
