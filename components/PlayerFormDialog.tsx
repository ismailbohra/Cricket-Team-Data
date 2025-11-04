'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload } from 'lucide-react';
import Image from 'next/image';

interface PlayerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  teamId: string;
}

export default function PlayerFormDialog({ open, onOpenChange, onSuccess, teamId }: PlayerFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    city: '',
    isCaptain: false,
    isWicketKeeper: false,
    playingRole: 'Bat',
    battingOrder: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.data.url }));
        setPreviewUrl(data.data.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Player name is required');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          imageUrl: formData.imageUrl,
          city: formData.city.trim(),
          isCaptain: formData.isCaptain,
          isWicketKeeper: formData.isWicketKeeper,
          playingRole: formData.playingRole,
          teamId,
          battingOrder: formData.battingOrder ? Number(formData.battingOrder) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        // Reset form
        setFormData({
          name: '',
          imageUrl: '',
          city: '',
          isCaptain: false,
          isWicketKeeper: false,
          playingRole: 'Bat',
          battingOrder: '',
        });
        setPreviewUrl('');
      } else {
        alert(data.error || 'Failed to add player');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to add player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">Player Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter player name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Playing Role *</Label>
              <Select
                value={formData.playingRole}
                onValueChange={(value) => setFormData({ ...formData, playingRole: value })}
              >
                <SelectTrigger>
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
              <Label htmlFor="battingOrder">Batting Order (1-11)</Label>
              <Input
                id="battingOrder"
                type="number"
                min="1"
                max="11"
                value={formData.battingOrder}
                onChange={(e) => setFormData({ ...formData, battingOrder: e.target.value })}
                placeholder="Enter batting order"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="captain">Captain</Label>
              <Switch
                id="captain"
                checked={formData.isCaptain}
                onCheckedChange={(checked) => setFormData({ ...formData, isCaptain: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="wicketkeeper">Wicket Keeper</Label>
              <Switch
                id="wicketkeeper"
                checked={formData.isWicketKeeper}
                onCheckedChange={(checked) => setFormData({ ...formData, isWicketKeeper: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label>Player Image</Label>
              <div className="flex items-center gap-4">
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Player preview"
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image"
                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? 'Adding...' : 'Add Player'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
