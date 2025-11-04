import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ITeam extends Document {
  _id: string;
  name: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      unique: true,
    },
    logoUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Team = models.Team || model<ITeam>('Team', TeamSchema);

export default Team;
