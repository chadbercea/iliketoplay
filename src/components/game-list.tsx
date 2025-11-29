"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IGame } from "@/types/game";
import { GameCard } from "./game-card";

export function GameList() {
  const router = useRouter();
  const [games, setGames] = useState<IGame[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="text-center py-8">Loading games...</div>;
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No games in your collection yet. Add your first game!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map((game) => (
        <GameCard key={game._id} game={game} onDelete={handleDelete} />
      ))}
    </div>
  );
}

