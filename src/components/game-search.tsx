"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SearchResult {
  rawgId: number;
  title: string;
  platform: string;
  year?: number;
  genre?: string;
  coverImageUrl?: string;
  notes?: string;
}

interface GameSearchProps {
  onSelectGame: (game: SearchResult) => void;
  onManualEntry: () => void;
}

export function GameSearch({ onSelectGame, onManualEntry }: GameSearchProps) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const url = `/api/games/search?q=${encodeURIComponent(query)}${
        platform ? `&platform=${encodeURIComponent(platform)}` : ""
      }`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      if (data.success) {
        setResults(data.data);
        setShowResults(true);

        if (data.data.length === 0) {
          setError("No games found. Try a different search or add manually.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Search failed. Please try manual entry.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (game: SearchResult) => {
    onSelectGame(game);
    setShowResults(false);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <Label htmlFor="search">Search for a game</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="search"
              type="text"
              placeholder="e.g., Mario, Zelda, Metroid"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              disabled={loading}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Platforms</option>
              <option value="nes">NES</option>
              <option value="snes">SNES</option>
              <option value="genesis">Genesis</option>
              <option value="game-boy">Game Boy</option>
            </select>
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Found {results.length} result{results.length !== 1 ? "s" : ""}. Click
            to select:
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((game) => (
              <Card
                key={game.rawgId}
                className="p-3 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleSelect(game)}
              >
                <div className="flex gap-3">
                  {game.coverImageUrl && (
                    <img
                      src={game.coverImageUrl}
                      alt={game.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{game.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {game.platform} {game.year ? `(${game.year})` : ""}
                    </p>
                    {game.genre && (
                      <p className="text-xs text-muted-foreground">{game.genre}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <p className="text-sm text-muted-foreground mb-2">
          Can't find your game?
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onManualEntry}
          className="w-full"
        >
          Add Game Manually
        </Button>
      </div>
    </div>
  );
}

