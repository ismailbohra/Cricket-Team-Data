'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash } from 'lucide-react';

interface PlayerRow {
  id: number;
  name: string;
  city: string;
  isCaptain: boolean;
  isWicketKeeper: boolean;
  playingRole: string;
}

interface BulkPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  teamId: string;
}

export default function BulkPlayerDialog({ open, onOpenChange, onSuccess, teamId }: BulkPlayerDialogProps) {
  const [loading, setLoading] = useState(false);
  const [playerRows, setPlayerRows] = useState<PlayerRow[]>([
    { id: 1, name: '', city: '', isCaptain: false, isWicketKeeper: false, playingRole: 'Bat' },
  ]);

  const addNewRow = () => {
    setPlayerRows([
      ...playerRows,
      {
        id: Date.now(),
        name: '',
        city: '',
        isCaptain: false,
        isWicketKeeper: false,
        playingRole: 'Bat',
      },
    ]);
  };

  const removeRow = (id: number) => {
    if (playerRows.length > 1) {
      setPlayerRows(playerRows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (id: number, field: keyof PlayerRow, value: any) => {
    setPlayerRows(
      playerRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all rows have names
    const validRows = playerRows.filter((row) => row.name.trim() !== '');
    
    if (validRows.length === 0) {
      alert('Please add at least one player with a name');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API
      const playersData = validRows.map((row) => ({
        name: row.name.trim(),
        city: row.city.trim(),
        isCaptain: row.isCaptain,
        isWicketKeeper: row.isWicketKeeper,
        playingRole: row.playingRole,
        teamId,
      }));

      const res = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playersData),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        // Reset form
        setPlayerRows([
          { id: 1, name: '', city: '', isCaptain: false, isWicketKeeper: false, playingRole: 'Bat' },
        ]);
      } else {
        alert(data.error || 'Failed to add players');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to add players');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Bulk Players</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {playerRows.map((row, index) => (
              <div key={row.id} className="border rounded-lg p-4 space-y-3 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Player {index + 1}</span>
                  {playerRows.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(row.id)}
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${row.id}`}>Name *</Label>
                    <Input
                      id={`name-${row.id}`}
                      value={row.name}
                      onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                      placeholder="Player name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`city-${row.id}`}>City</Label>
                    <Input
                      id={`city-${row.id}`}
                      value={row.city}
                      onChange={(e) => updateRow(row.id, 'city', e.target.value)}
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`role-${row.id}`}>Playing Role *</Label>
                    <Select
                      value={row.playingRole}
                      onValueChange={(value) => updateRow(row.id, 'playingRole', value)}
                    >
                      <SelectTrigger id={`role-${row.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bat">Bat</SelectItem>
                        <SelectItem value="Bowl">Bowl</SelectItem>
                        <SelectItem value="A.R">A.R</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <Switch
                          id={`captain-${row.id}`}
                          checked={row.isCaptain}
                          onCheckedChange={(checked) => updateRow(row.id, 'isCaptain', checked)}
                        />
                        <Label htmlFor={`captain-${row.id}`} className="text-sm cursor-pointer">Captain</Label>
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <Switch
                          id={`wk-${row.id}`}
                          checked={row.isWicketKeeper}
                          onCheckedChange={(checked) => updateRow(row.id, 'isWicketKeeper', checked)}
                        />
                        <Label htmlFor={`wk-${row.id}`} className="text-sm cursor-pointer">WK</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addNewRow} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New Player
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add All Players'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
