"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IGame } from "@/types/game";
import { GameCard } from "./game-card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";
import Fuse from "fuse.js";

export function GameList() {
  const router = useRouter();
  const [games, setGames] = useState<IGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games");
      const data = await response.json();
      if (data.success) {
        setGames(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGames(games.filter((game) => game._id !== id));
        router.refresh();
      } else {
        alert("Failed to delete game");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(games, {
      keys: ["title", "platform", "genre", "notes"],
      threshold: 0.4, // 0 = exact match, 1 = match anything
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [games]);

  // Perform fuzzy search
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) {
      return games;
    }
    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  }, [games, searchQuery, fuse]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return <div className="text-center py-8">Loading games...</div>;
  }

  return (
    <div className="space-y-6">
      {games.length > 0 && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search your collection (title, platform, genre, notes)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {searchQuery && (
        <div className="text-sm text-slate-600">
          {filteredGames.length === 0 ? (
            <span>No games found for "{searchQuery}"</span>
          ) : filteredGames.length === 1 ? (
            <span>Found 1 game</span>
          ) : (
            <span>Found {filteredGames.length} games</span>
          )}
        </div>
      )}

      {games.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No games in your collection yet. Add your first game!
        </div>
      ) : filteredGames.length === 0 && searchQuery ? (
        <div className="text-center py-8 text-muted-foreground">
          No games match your search. Try different keywords.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames.map((game) => (
            <GameCard key={game._id} game={game} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

