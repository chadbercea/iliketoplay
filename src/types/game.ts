export type GameStatus = "owned" | "wishlist";

export type GameCondition = "mint" | "excellent" | "good" | "fair" | "poor";

export interface PurchaseInfo {
  price?: number;
  date?: Date;
  location?: string;
}

export interface IGame {
  _id?: string;
  userId: string;
  title: string;
  platform: string;
  year?: number;
  genre?: string;
  status: GameStatus;
  coverImageUrl?: string;
  notes?: string;
  rating?: number;
  condition?: GameCondition;
  purchaseInfo?: PurchaseInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

