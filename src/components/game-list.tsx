"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IGame } from "@/types/game";
import { FlipCard } from "./flip-card";
import { GameCardSkeleton } from "./game-card-skeleton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "./ui/sheet";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Fuse from "fuse.js";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SortOption = "title-asc" | "title-desc" | "year-new" | "year-old" | "added-new" | "added-old" | "platform-asc";

type FilterPreset = {
  id: string;
  label: string;
  filters: {
    platforms?: string[];
    status?: string[];
    genres?: string[];
  };
};

const FILTER_PRESETS: FilterPreset[] = [
  { id: "all", label: "All Games", filters: {} },
  { id: "wishlist", label: "Wishlist", filters: { status: ["wishlist"] } },
  { id: "owned", label: "Owned", filters: { status: ["owned"] } },
  { id: "nes", label: "NES", filters: { platforms: ["NES"] } },
  { id: "snes", label: "SNES", filters: { platforms: ["SNES"] } },
];

const SORT_OPTIONS = [
  { value: "added-new", label: "Newest Added" },
  { value: "added-old", label: "Oldest Added" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
  { value: "year-new", label: "Year (Newest)" },
  { value: "year-old", label: "Year (Oldest)" },
  { value: "platform-asc", label: "Platform (A-Z)" },
];

export function GameList() {
  const router = useRouter();
  const [games, setGames] = useState<IGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);

  // Filter states
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("added-new");

  // Temp filter states for sheet (apply on confirm)
  const [tempPlatforms, setTempPlatforms] = useState<string[]>([]);
  const [tempStatus, setTempStatus] = useState<string[]>([]);
  const [tempGenres, setTempGenres] = useState<string[]>([]);
  const [tempConditions, setTempConditions] = useState<string[]>([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games");
      const data = await response.json();
      if (data.success) {
        setGames(data.data);
      } else {
        toast.error("Failed to load games");
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
      toast.error("Failed to load games. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const gameToDelete = games.find((g) => g._id === id);
    const gameName = gameToDelete?.title || "Game";

    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGames(games.filter((game) => game._id !== id));
        toast.success(`${gameName} deleted successfully`);
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete game");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the game");
    }
  };

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(games, {
      keys: ["title", "platform", "genre", "notes"],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [games]);

  // Get unique values for filter options
  const uniquePlatforms = useMemo(() => [...new Set(games.map((g) => g.platform).filter(Boolean))].sort(), [games]);
  const uniqueGenres = useMemo(() => [...new Set(games.map((g) => g.genre).filter(Boolean))].sort() as string[], [games]);
  const uniqueConditions = useMemo(() => [...new Set(games.map((g) => g.condition).filter(Boolean))].sort() as string[], [games]);

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
      result = result.filter((g) => selectedPlatforms.includes(g.platform));
    }
    if (selectedStatus.length > 0) {
      result = result.filter((g) => selectedStatus.includes(g.status));
    }
    if (selectedGenres.length > 0) {
      result = result.filter((g) => g.genre && selectedGenres.includes(g.genre));
    }
    if (selectedConditions.length > 0) {
      result = result.filter((g) => g.condition && selectedConditions.includes(g.condition));
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

  const hasActiveFilters = selectedPlatforms.length > 0 || selectedStatus.length > 0 || selectedGenres.length > 0 || selectedConditions.length > 0;

  const activeFiltersCount = [selectedPlatforms, selectedStatus, selectedGenres, selectedConditions].reduce((acc, arr) => acc + arr.length, 0);

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
      setFilters(currentFilters.filter((f) => f !== value));
    } else {
      setFilters([...currentFilters, value]);
    }
  };

  const removeFilter = (type: "platform" | "status" | "genre" | "condition", value: string) => {
    switch (type) {
      case "platform":
        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== value));
        break;
      case "status":
        setSelectedStatus(selectedStatus.filter((s) => s !== value));
        break;
      case "genre":
        setSelectedGenres(selectedGenres.filter((g) => g !== value));
        break;
      case "condition":
        setSelectedConditions(selectedConditions.filter((c) => c !== value));
        break;
    }
  };

  const applyPreset = (preset: FilterPreset) => {
    setSelectedPlatforms(preset.filters.platforms || []);
    setSelectedStatus(preset.filters.status || []);
    setSelectedGenres(preset.filters.genres || []);
    setSelectedConditions([]);
  };

  const openFilterSheet = () => {
    setTempPlatforms(selectedPlatforms);
    setTempStatus(selectedStatus);
    setTempGenres(selectedGenres);
    setTempConditions(selectedConditions);
    setShowFilterSheet(true);
  };

  const applyFilters = () => {
    setSelectedPlatforms(tempPlatforms);
    setSelectedStatus(tempStatus);
    setSelectedGenres(tempGenres);
    setSelectedConditions(tempConditions);
    setShowFilterSheet(false);
  };

  const cancelFilters = () => {
    setShowFilterSheet(false);
  };

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Sort";

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.length > 0 && (
        <>
          {/* Sticky Search Bar */}
          <div className="sticky top-0 z-20 bg-background pb-4 space-y-4">
            {/* Search and Action Buttons */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 min-h-[44px]"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter Sheet Trigger */}
              <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="shrink-0 min-h-[44px] min-w-[44px]" onClick={openFilterSheet}>
                    <SlidersHorizontal className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Filters</span>
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] sm:h-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Filter your game collection</SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6 overflow-y-auto max-h-[calc(80vh-180px)]">
                    {/* Platform Filter */}
                    {uniquePlatforms.length > 0 && (
                      <div>
                        <label className="text-sm font-medium mb-3 block">Platform</label>
                        <div className="flex flex-wrap gap-2">
                          {uniquePlatforms.map((platform) => (
                            <Badge
                              key={platform}
                              variant={tempPlatforms.includes(platform) ? "default" : "outline"}
                              className="cursor-pointer min-h-[44px] px-4"
                              onClick={() => toggleFilter(platform, tempPlatforms, setTempPlatforms)}
                            >
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Filter */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Status</label>
                      <div className="flex flex-wrap gap-2">
                        {["owned", "wishlist"].map((status) => (
                          <Badge
                            key={status}
                            variant={tempStatus.includes(status) ? "default" : "outline"}
                            className="cursor-pointer capitalize min-h-[44px] px-4"
                            onClick={() => toggleFilter(status, tempStatus, setTempStatus)}
                          >
                            {status}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Genre Filter */}
                    {uniqueGenres.length > 0 && (
                      <div>
                        <label className="text-sm font-medium mb-3 block">Genre</label>
                        <div className="flex flex-wrap gap-2">
                          {uniqueGenres.map((genre) => (
                            <Badge
                              key={genre}
                              variant={tempGenres.includes(genre) ? "default" : "outline"}
                              className="cursor-pointer min-h-[44px] px-4"
                              onClick={() => toggleFilter(genre, tempGenres, setTempGenres)}
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
                        <label className="text-sm font-medium mb-3 block">Condition</label>
                        <div className="flex flex-wrap gap-2">
                          {uniqueConditions.map((condition) => (
                            <Badge
                              key={condition}
                              variant={tempConditions.includes(condition) ? "default" : "outline"}
                              className="cursor-pointer capitalize min-h-[44px] px-4"
                              onClick={() => toggleFilter(condition, tempConditions, setTempConditions)}
                            >
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <SheetFooter className="flex gap-2 sm:gap-2">
                    <Button variant="outline" onClick={cancelFilters} className="flex-1 min-h-[44px]">
                      Cancel
                    </Button>
                    <Button onClick={applyFilters} className="flex-1 min-h-[44px]">
                      Apply Filters
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* Sort Sheet Trigger */}
              <Sheet open={showSortSheet} onOpenChange={setShowSortSheet}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="shrink-0 min-h-[44px] min-w-[44px]">
                    <ArrowUpDown className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{currentSortLabel}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-auto">
                  <SheetHeader>
                    <SheetTitle>Sort By</SheetTitle>
                    <SheetDescription>Choose how to sort your games</SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-2">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as SortOption);
                          setShowSortSheet(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg min-h-[44px] transition-colors",
                          sortBy === option.value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Filter Presets */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {FILTER_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  variant={preset.id === "all" && !hasActiveFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="shrink-0 min-h-[36px]"
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex gap-2 flex-wrap items-center">
                {selectedPlatforms.map((platform) => (
                  <Badge key={`platform-${platform}`} variant="secondary" className="gap-1">
                    {platform}
                    <button onClick={() => removeFilter("platform", platform)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedStatus.map((status) => (
                  <Badge key={`status-${status}`} variant="secondary" className="gap-1 capitalize">
                    {status}
                    <button onClick={() => removeFilter("status", status)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedGenres.map((genre) => (
                  <Badge key={`genre-${genre}`} variant="secondary" className="gap-1">
                    {genre}
                    <button onClick={() => removeFilter("genre", genre)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedConditions.map((condition) => (
                  <Badge key={`condition-${condition}`} variant="secondary" className="gap-1 capitalize">
                    {condition}
                    <button onClick={() => removeFilter("condition", condition)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {activeFiltersCount > 1 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7">
                    Clear All
                  </Button>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {searchQuery ? (
                filteredAndSortedGames.length === 0 ? (
                  <span>No games found for "{searchQuery}"</span>
                ) : filteredAndSortedGames.length === 1 ? (
                  <span>Found 1 game</span>
                ) : (
                  <span>Found {filteredAndSortedGames.length} games</span>
                )
              ) : (
                <span>
                  Showing {filteredAndSortedGames.length} of {games.length} games
                </span>
              )}
            </div>
          </div>

          {/* Results Grid */}
          {filteredAndSortedGames.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No games match your filters.</p>
              <Button variant="link" onClick={clearAllFilters} className="mt-2">
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedGames.map((game) => (
                <FlipCard key={game._id} game={game} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </>
      )}

      {games.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No games in your collection yet.</p>
          <p className="text-sm mt-2">Add your first game to get started!</p>
        </div>
      )}
    </div>
  );
}

