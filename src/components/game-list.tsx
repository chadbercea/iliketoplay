"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IGame } from "@/types/game";
import { GameCard } from "./game-card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, X, Filter, SlidersHorizontal } from "lucide-react";
import Fuse from "fuse.js";

type SortOption = "title-asc" | "title-desc" | "year-new" | "year-old" | "added-new" | "added-old" | "platform-asc";

export function GameList() {
  const router = useRouter();
  const [games, setGames] = useState<IGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("added-new");

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

  // Get unique values for filter options
  const uniquePlatforms = useMemo(() => [...new Set(games.map(g => g.platform).filter(Boolean))].sort(), [games]);
  const uniqueGenres = useMemo(() => [...new Set(games.map(g => g.genre).filter(Boolean))].sort() as string[], [games]);
  const uniqueConditions = useMemo(() => [...new Set(games.map(g => g.condition).filter(Boolean))].sort() as string[], [games]);

  // Perform fuzzy search first
  const searchedGames = useMemo(() => {
    if (!searchQuery.trim()) {
      return games;
    }
    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  }, [games, searchQuery, fuse]);

  // Then apply filters and sorting
  const filteredAndSortedGames = useMemo(() => {
    let result = [...searchedGames];

    // Apply filters
    if (selectedPlatforms.length > 0) {
      result = result.filter(g => selectedPlatforms.includes(g.platform));
    }
    if (selectedStatus.length > 0) {
      result = result.filter(g => selectedStatus.includes(g.status));
    }
    if (selectedGenres.length > 0) {
      result = result.filter(g => g.genre && selectedGenres.includes(g.genre));
    }
    if (selectedConditions.length > 0) {
      result = result.filter(g => g.condition && selectedConditions.includes(g.condition));
    }

    // Apply sorting
    switch (sortBy) {
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "year-new":
        result.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case "year-old":
        result.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case "added-new":
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case "added-old":
        result.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        break;
      case "platform-asc":
        result.sort((a, b) => a.platform.localeCompare(b.platform));
        break;
    }

    return result;
  }, [searchedGames, selectedPlatforms, selectedStatus, selectedGenres, selectedConditions, sortBy]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearAllFilters = () => {
    setSelectedPlatforms([]);
    setSelectedStatus([]);
    setSelectedGenres([]);
    setSelectedConditions([]);
  };

  const toggleFilter = (value: string, currentFilters: string[], setFilters: (filters: string[]) => void) => {
    if (currentFilters.includes(value)) {
      setFilters(currentFilters.filter(f => f !== value));
    } else {
      setFilters([...currentFilters, value]);
    }
  };

  const hasActiveFilters = selectedPlatforms.length > 0 || selectedStatus.length > 0 || 
                          selectedGenres.length > 0 || selectedConditions.length > 0;

  if (loading) {
    return <div className="text-center py-8">Loading games...</div>;
  }

  return (
    <div className="space-y-6">
      {games.length > 0 && (
        <div className="space-y-4">
          {/* Search and Filter Toggle */}
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
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {[selectedPlatforms, selectedStatus, selectedGenres, selectedConditions]
                    .reduce((acc, arr) => acc + arr.length, 0)}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="border rounded-lg p-4 space-y-4 bg-slate-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear all
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Platform Filter */}
                {uniquePlatforms.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Platform</label>
                    <div className="flex flex-wrap gap-2">
                      {uniquePlatforms.map(platform => (
                        <Badge
                          key={platform}
                          variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleFilter(platform, selectedPlatforms, setSelectedPlatforms)}
                        >
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {["owned", "wishlist"].map(status => (
                      <Badge
                        key={status}
                        variant={selectedStatus.includes(status) ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => toggleFilter(status, selectedStatus, setSelectedStatus)}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Genre Filter */}
                {uniqueGenres.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Genre</label>
                    <div className="flex flex-wrap gap-2">
                      {uniqueGenres.map(genre => (
                        <Badge
                          key={genre}
                          variant={selectedGenres.includes(genre) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleFilter(genre, selectedGenres, setSelectedGenres)}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Condition Filter */}
                {uniqueConditions.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Condition</label>
                    <div className="flex flex-wrap gap-2">
                      {uniqueConditions.map(condition => (
                        <Badge
                          key={condition}
                          variant={selectedConditions.includes(condition) ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => toggleFilter(condition, selectedConditions, setSelectedConditions)}
                        >
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sort Control */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {searchQuery ? (
                filteredAndSortedGames.length === 0 ? (
                  <span>No games found for "{searchQuery}"</span>
                ) : filteredAndSortedGames.length === 1 ? (
                  <span>Found 1 game</span>
                ) : (
                  <span>Found {filteredAndSortedGames.length} games</span>
                )
              ) : (
                <span>Showing {filteredAndSortedGames.length} of {games.length} games</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="added-new">Newest Added</SelectItem>
                  <SelectItem value="added-old">Oldest Added</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  <SelectItem value="year-new">Year (Newest)</SelectItem>
                  <SelectItem value="year-old">Year (Oldest)</SelectItem>
                  <SelectItem value="platform-asc">Platform (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {games.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No games in your collection yet. Add your first game!
        </div>
      ) : filteredAndSortedGames.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No games match your filters. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedGames.map((game) => (
            <GameCard key={game._id} game={game} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

