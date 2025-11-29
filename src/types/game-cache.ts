export interface IGameCache {
  _id?: string;
  rawgId: number;
  title: string;
  platform: string;
  year?: number;
  genre?: string;
  coverImageUrl?: string;
  rating?: number;
  metacritic?: number;
  description?: string;
  metadata?: {
    platforms?: string[];
    genres?: string[];
    developers?: string[];
    publishers?: string[];
  };
  cachedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

