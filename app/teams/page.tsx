'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Download } from 'lucide-react';
import Image from 'next/image';
import TeamFormDialog from '@/components/TeamFormDialog';

interface Team {
  _id: string;
  name: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, [search]);

  const fetchTeams = async () => {
    try {
      const url = search
        ? `/api/teams?search=${encodeURIComponent(search)}`
        : '/api/teams';
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setTeams(data.data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamCreated = () => {
    setShowTeamDialog(false);
    fetchTeams();
  };

  const handleExportAll = async () => {
    try {
      setExporting(true);
      const res = await fetch('/api/export/all', {
        method: 'POST',
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'all_teams_players.xlsx';
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading teams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Cricket Teams</h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleExportAll} 
            disabled={exporting || teams.length === 0}
            size="sm"
            className="sm:h-10"
          >
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'Export All'}</span>
          </Button>
          <Button onClick={() => setShowTeamDialog(true)} size="sm" className="sm:h-10">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Team</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No teams found</p>
            <Button onClick={() => setShowTeamDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {teams.map((team) => (
            <Card
              key={team._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/teams/${team._id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  {team.logoUrl ? (
                    <Image
                      src={team.logoUrl}
                      alt={team.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {team.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-center">{team.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <TeamFormDialog
        open={showTeamDialog}
        onOpenChange={setShowTeamDialog}
        onSuccess={handleTeamCreated}
      />
    </div>
  );
}
