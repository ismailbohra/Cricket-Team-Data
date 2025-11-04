'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';

interface Player {
  _id: string;
  name: string;
  imageUrl?: string;
  city?: string;
  isCaptain: boolean;
  isWicketKeeper: boolean;
  playingRole: string;
  battingOrder?: number;
}

interface BattingOrderManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  teamId: string;
  players: Player[];
}

function SortablePlayer({ player, index }: { player: Player; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-md transition-shadow"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold">
        {index + 1}
      </div>

      {player.imageUrl ? (
        <Image
          src={player.imageUrl}
          alt={player.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-gray-400">
            {player.name.charAt(0)}
          </span>
        </div>
      )}

      <div className="flex-1">
        <div className="font-semibold">{player.name}</div>
        <div className="flex gap-1 mt-1">
          <Badge variant="secondary" className="text-xs">{player.playingRole}</Badge>
          {player.isCaptain && <Badge variant="default" className="text-xs">C</Badge>}
          {player.isWicketKeeper && <Badge variant="default" className="text-xs">WK</Badge>}
        </div>
      </div>
    </div>
  );
}

export default function BattingOrderManager({
  open,
  onOpenChange,
  onSuccess,
  teamId,
  players,
}: BattingOrderManagerProps) {
  const [orderedPlayers, setOrderedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (open && players.length > 0) {
      // Sort by existing batting order or keep original order
      const sorted = [...players].sort((a, b) => {
        if (a.battingOrder && b.battingOrder) {
          return a.battingOrder - b.battingOrder;
        }
        if (a.battingOrder) return -1;
        if (b.battingOrder) return 1;
        return 0;
      });
      setOrderedPlayers(sorted);
    }
  }, [open, players]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedPlayers((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Prepare update data with new batting order
      const updates = orderedPlayers.slice(0, 11).map((player, index) => ({
        _id: player._id,
        battingOrder: index + 1,
      }));

      const res = await fetch('/api/players/batch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        alert(data.error || 'Failed to update batting order');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to update batting order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Set Batting Order</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Drag and drop players to set their batting order. Only the first 11 players will be assigned batting order.
          </p>
        </DialogHeader>

        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {orderedPlayers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No players available
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedPlayers.map((p) => p._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {orderedPlayers.map((player, index) => (
                    <SortablePlayer key={player._id} player={player} index={index} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || orderedPlayers.length === 0}>
            {loading ? 'Saving...' : 'Save Batting Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
