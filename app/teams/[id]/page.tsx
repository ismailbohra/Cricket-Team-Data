'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash, Download, Users, Plus } from 'lucide-react';
import Image from 'next/image';
import TeamFormDialog from '@/components/TeamFormDialog';
import PlayerFormDialog from '@/components/PlayerFormDialog';
import PlayerEditDialog from '@/components/PlayerEditDialog';
import BulkPlayerDialog from '@/components/BulkPlayerDialog';
import BattingOrderManager from '@/components/BattingOrderManager';
import { useAuth } from '@/lib/auth';

interface Team {
  _id: string;
  name: string;
  logoUrl?: string;
}

interface Player {
  _id: string;
  name: string;
  imageUrl?: string;
  city?: string;
  isCaptain: boolean;
  isWicketKeeper: boolean;
  playingRole: string;
  teamId: string;
  battingOrder?: number;
}

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  useAuth(); // Protect this page
  const router = useRouter();
  const [teamId, setTeamId] = useState<string>('');
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showEditPlayer, setShowEditPlayer] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [showBattingOrder, setShowBattingOrder] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    // Unwrap the params promise
    params.then((resolvedParams) => {
      setTeamId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (teamId) {
      fetchTeam();
      fetchPlayers();
    }
  }, [teamId]);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}`);
      const data = await res.json();
      if (data.success) {
        setTeam(data.data);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await fetch(`/api/players?teamId=${teamId}`);
      const data = await res.json();
      if (data.success) {
        setPlayers(data.data);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm('Are you sure you want to delete this team? All players will also be deleted.')) {
      return;
    }

    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/teams');
      } else {
        alert('Failed to delete team');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team');
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm('Are you sure you want to delete this player?')) {
      return;
    }

    try {
      const res = await fetch(`/api/players/${playerId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPlayers();
      } else {
        alert('Failed to delete player');
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Failed to delete player');
    }
  };

  const handleExportTeam = async () => {
    try {
      setExporting(true);
      const res = await fetch(`/api/export/team/${teamId}`, {
        method: 'POST',
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${team?.name.replace(/[^a-z0-9]/gi, '_')}_players.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setShowEditPlayer(true);
  };

  const handleSuccess = () => {
    setShowEditTeam(false);
    setShowAddPlayer(false);
    setShowEditPlayer(false);
    setShowBulkAdd(false);
    setShowBattingOrder(false);
    setSelectedPlayer(null);
    fetchTeam();
    fetchPlayers();
  };

  if (loading || !team) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
          Burhani Premiere League Season 16
        </h1>
      </div>

      <Button
        variant="ghost"
        className="mb-4 sm:mb-6"
        onClick={() => router.push('/teams')}
        size="sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Teams
      </Button>

      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              {team.logoUrl ? (
                <Image
                  src={team.logoUrl}
                  alt={team.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover sm:w-20 sm:h-20"
                />
              ) : (
                <div className="w-15 h-15 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-400">
                    {team.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <CardTitle className="text-xl sm:text-3xl">{team.name}</CardTitle>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowEditTeam(true)} size="sm" className="sm:h-10">
                <Edit className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Edit Team</span>
              </Button>
              <Button variant="destructive" onClick={handleDeleteTeam} size="sm" className="sm:h-10">
                <Trash className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Delete Team</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl sm:text-2xl font-bold">Players ({players.length})</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleExportTeam}
            disabled={exporting || players.length === 0}
            size="sm"
            className="sm:h-10"
          >
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'Export to Excel'}</span>
          </Button>
          <Button variant="outline" onClick={() => setShowBattingOrder(true)} disabled={players.length === 0} size="sm" className="sm:h-10">
            <span className="text-xs sm:text-sm">Batting Order</span>
          </Button>
          <Button variant="outline" onClick={() => setShowBulkAdd(true)} size="sm" className="sm:h-10">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Bulk Players</span>
            <span className="sm:hidden text-xs">Bulk</span>
          </Button>
          <Button onClick={() => setShowAddPlayer(true)} size="sm" className="sm:h-10">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Player</span>
            <span className="sm:hidden text-xs">Add</span>
          </Button>
        </div>
      </div>

      {players.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No players in this team yet</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => setShowBulkAdd(true)}>
                Add Bulk Players
              </Button>
              <Button variant="outline" onClick={() => setShowAddPlayer(true)}>
                Add Single Player
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {players.map((player) => (
            <Card key={player._id}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  {player.imageUrl ? (
                    <Image
                      src={player.imageUrl}
                      alt={player.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover mb-3"
                    />
                  ) : (
                    <div className="w-15 h-15 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-gray-400">
                        {player.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h3 className="font-semibold text-center mb-2">{player.name}</h3>
                  {player.city && (
                    <p className="text-sm text-gray-600 mb-2">{player.city}</p>
                  )}
                  <div className="flex flex-wrap gap-1 justify-center mb-3">
                    <Badge variant="secondary">{player.playingRole}</Badge>
                    {player.isCaptain && <Badge variant="default">Captain</Badge>}
                    {player.isWicketKeeper && <Badge variant="default">WK</Badge>}
                    {player.battingOrder && (
                      <Badge variant="outline">Order: {player.battingOrder}</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600"
                      onClick={() => handleEditPlayer(player)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDeletePlayer(player._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TeamFormDialog
        open={showEditTeam}
        onOpenChange={setShowEditTeam}
        onSuccess={handleSuccess}
        team={team}
      />

      <PlayerFormDialog
        open={showAddPlayer}
        onOpenChange={setShowAddPlayer}
        onSuccess={handleSuccess}
        teamId={teamId}
      />

      <PlayerEditDialog
        open={showEditPlayer}
        onOpenChange={setShowEditPlayer}
        onSuccess={handleSuccess}
        player={selectedPlayer}
      />

      <BulkPlayerDialog
        open={showBulkAdd}
        onOpenChange={setShowBulkAdd}
        onSuccess={handleSuccess}
        teamId={teamId}
      />

      <BattingOrderManager
        open={showBattingOrder}
        onOpenChange={setShowBattingOrder}
        onSuccess={handleSuccess}
        teamId={teamId}
        players={players}
      />
    </div>
  );
}
