"use client";

import { IGame } from "@/types/game";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GameCardProps {
  game: IGame;
  onDelete: (id: string) => void;
}

export function GameCard({ game, onDelete }: GameCardProps) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this game?")) {
      onDelete(game._id!);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.title}</CardTitle>
        <CardDescription>
          {game.platform} {game.year ? `(${game.year})` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {game.genre && (
            <p className="text-sm">
              <span className="font-semibold">Genre:</span> {game.genre}
            </p>
          )}
          <p className="text-sm">
            <span className="font-semibold">Status:</span>{" "}
            <span className={game.status === "owned" ? "text-green-600" : "text-blue-600"}>
              {game.status === "owned" ? "Owned" : "Wishlist"}
            </span>
          </p>
          {game.condition && (
            <p className="text-sm">
              <span className="font-semibold">Condition:</span> {game.condition}
            </p>
          )}
          {game.purchaseInfo?.price && (
            <p className="text-sm">
              <span className="font-semibold">Price:</span> ${game.purchaseInfo.price}
            </p>
          )}
          {game.notes && (
            <p className="text-sm text-muted-foreground mt-2">{game.notes}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Link href={`/games/${game._id}/edit`}>
          <Button variant="outline">Edit</Button>
        </Link>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

