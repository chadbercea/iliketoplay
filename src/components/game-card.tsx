"use client";

import { IGame } from "@/types/game";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, DollarSign, Gamepad2 } from "lucide-react";

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

  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case "mint":
        return "bg-green-100 text-green-800 border-green-300";
      case "excellent":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "good":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "fair":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "poor":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-xl hover:scale-[1.02] group">
      {/* Cover Image */}
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {game.coverImageUrl ? (
          <Image
            src={game.coverImageUrl}
            alt={`${game.title} cover`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Gamepad2 className="w-16 h-16 text-slate-400" strokeWidth={1.5} />
          </div>
        )}
        {/* Status Badge Overlay */}
        <div className="absolute top-2 right-2">
          <Badge
            className={
              game.status === "owned"
                ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            }
          >
            {game.status === "owned" ? "Owned" : "Wishlist"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl line-clamp-2">{game.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{game.platform}</span>
          {game.year && <span className="text-slate-400">•</span>}
          {game.year && <span>{game.year}</span>}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-3">
          {/* Badges Row */}
          <div className="flex flex-wrap gap-2">
            {game.genre && (
              <Badge variant="secondary" className="text-xs">
                {game.genre}
              </Badge>
            )}
            {game.condition && (
              <Badge variant="outline" className={`text-xs capitalize ${getConditionColor(game.condition)}`}>
                {game.condition}
              </Badge>
            )}
          </div>

          {/* Purchase Info */}
          {(game.purchaseInfo?.price || game.purchaseInfo?.date || game.purchaseInfo?.location) && (
            <div className="space-y-1 pt-2 border-t">
              {game.purchaseInfo.price && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">${game.purchaseInfo.price.toFixed(2)}</span>
                </div>
              )}
              {game.purchaseInfo.date && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(game.purchaseInfo.date).toLocaleDateString()}</span>
                </div>
              )}
              {game.purchaseInfo.location && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{game.purchaseInfo.location}</span>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {game.notes && (
            <p className="text-sm text-slate-600 line-clamp-2 pt-2 border-t italic">
              {game.notes}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-4 border-t bg-slate-50/50">
        <Link href={`/games/${game._id}/edit`} className="flex-1">
          <Button
            variant="outline"
            className="w-full"
            aria-label={`Edit ${game.title}`}
          >
            Edit
          </Button>
        </Link>
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="flex-1"
          aria-label={`Delete ${game.title}`}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

