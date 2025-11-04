'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import Image from 'next/image';

interface TeamFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  team?: {
    _id: string;
    name: string;
    logoUrl?: string;
    homeCity?: string;
    foundedYear?: number;
  };
}

export default function TeamFormDialog({ open, onOpenChange, onSuccess, team }: TeamFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: team?.name || '',
    logoUrl: team?.logoUrl || '',
    homeCity: team?.homeCity || '',
    foundedYear: team?.foundedYear || '',
  });
  const [previewUrl, setPreviewUrl] = useState(team?.logoUrl || '');

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
        setFormData((prev) => ({ ...prev, logoUrl: data.data.url }));
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
      alert('Team name is required');
      return;
    }

    try {
      setLoading(true);
      const url = team ? `/api/teams/${team._id}` : '/api/teams';
      const method = team ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          logoUrl: formData.logoUrl,
          homeCity: formData.homeCity.trim(),
          foundedYear: formData.foundedYear ? Number(formData.foundedYear) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        // Reset form
        setFormData({ name: '', logoUrl: '', homeCity: '', foundedYear: '' });
        setPreviewUrl('');
      } else {
        alert(data.error || 'Failed to save team');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{team ? 'Edit Team' : 'Add New Team'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter team name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="homeCity">Home City</Label>
              <Input
                id="homeCity"
                value={formData.homeCity}
                onChange={(e) => setFormData({ ...formData, homeCity: e.target.value })}
                placeholder="Enter home city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.foundedYear}
                onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                placeholder="Enter founded year"
              />
            </div>

            <div className="space-y-2">
              <Label>Team Logo</Label>
              <div className="flex items-center gap-4">
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Logo preview"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <Label
                    htmlFor="logo"
                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload Logo'}
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
              {loading ? 'Saving...' : team ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
