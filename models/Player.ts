import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IPlayer extends Document {
  _id: string;
  name: string;
  imageUrl?: string;
  city?: string;
  isCaptain: boolean;
  isWicketKeeper: boolean;
  playingRole: 'Bat' | 'Bowl' | 'A.R';
  teamId: mongoose.Types.ObjectId;
  battingOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema = new Schema<IPlayer>(
  {
    name: {
      type: String,
      required: [true, 'Player name is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      trim: true,
    },
    isCaptain: {
      type: Boolean,
      default: false,
    },
    isWicketKeeper: {
      type: Boolean,
      default: false,
    },
    playingRole: {
      type: String,
      enum: ['Bat', 'Bowl', 'A.R'],
      required: [true, 'Playing role is required'],
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team is required'],
    },
    battingOrder: {
      type: Number,
      min: 1,
      max: 11,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
PlayerSchema.index({ teamId: 1, battingOrder: 1 });

const Player = models.Player || model<IPlayer>('Player', PlayerSchema);

export default Player;
