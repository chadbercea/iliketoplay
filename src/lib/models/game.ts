import mongoose, { Schema, Model } from "mongoose";
import { IGame } from "@/types/game";

const PurchaseInfoSchema = new Schema({
  price: { type: Number },
  date: { type: Date },
  location: { type: String },
}, { _id: false });

const GameSchema = new Schema<IGame>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a title for the game"],
      trim: true,
    },
    platform: {
      type: String,
      required: [true, "Please provide a platform for the game"],
      trim: true,
    },
    year: {
      type: Number,
      min: 1970,
      max: new Date().getFullYear() + 1,
    },
    genre: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["owned", "wishlist"],
      default: "owned",
      required: true,
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
    },
    condition: {
      type: String,
      enum: ["mint", "excellent", "good", "fair", "poor"],
    },
    purchaseInfo: PurchaseInfoSchema,
  },
  {
    timestamps: true,
  }
);

const Game: Model<IGame> = mongoose.models.Game || mongoose.model<IGame>("Game", GameSchema);

export default Game;

