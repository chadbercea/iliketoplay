import mongoose, { Schema, Model } from "mongoose";
import { IGameCache } from "@/types/game-cache";

const MetadataSchema = new Schema({
  platforms: [{ type: String }],
  genres: [{ type: String }],
  developers: [{ type: String }],
  publishers: [{ type: String }],
}, { _id: false });

const GameCacheSchema = new Schema<IGameCache>(
  {
    rawgId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    platform: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    year: {
      type: Number,
    },
    genre: {
      type: String,
      trim: true,
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    metacritic: {
      type: Number,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
    },
    metadata: MetadataSchema,
    cachedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient search queries
GameCacheSchema.index({ title: 'text', platform: 'text' });

const GameCache: Model<IGameCache> =
  mongoose.models.GameCache || mongoose.model<IGameCache>("GameCache", GameCacheSchema);

export default GameCache;

