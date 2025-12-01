"use client";

import { IGame } from "@/types/game";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { X, Gamepad2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GameCardBackProps {
  game: IGame;
  onDelete: (id: string) => void;
  onClose?: () => void;
}

export function GameCardBack({ game, onDelete, onClose }: GameCardBackProps) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this game?")) {
      onDelete(game._id!);
    }
  };

  // Get rating from field or parse from notes (fallback for old games)
  let rating = game.rating;
  if (!rating && game.notes) {
    const ratingMatch = game.notes.match(/Rating:\s*([\d.]+)\/5/);
    if (ratingMatch) {
      rating = parseFloat(ratingMatch[1]);
    }
  }

  // Round to 1 decimal place for display AND color determination
  const roundedRating = rating ? Math.round(rating * 10) / 10 : undefined;
  const displayRating = roundedRating?.toFixed(1);

  // Get badge color based on ROUNDED rating
  const getBadgeColor = (ratingValue: number) => {
    if (ratingValue === 5.0) return '#3b82f6';  // Blue
    if (ratingValue >= 4.0) return '#66cc33';   // Green
    if (ratingValue >= 3.0) return '#ffcc33';   // Yellow
    return '#ff0000';                      // Red
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-[40px] overflow-hidden shadow-2xl flex flex-col relative">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Blurred Artwork Header - 33% */}
      <div className="relative w-full h-[33.333%] overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center p-2.5">
        {game.coverImageUrl ? (
          <>
            {/* Blurred background layer */}
            <Image
              src={game.coverImageUrl}
              alt=""
              fill
              className="object-cover"
              style={{ filter: 'blur(8px)' }}
              sizes="600px"
            />
            {/* Sharp foreground layer - full image visible */}
            <img
              src={game.coverImageUrl}
              alt={`${game.title} cover`}
              className="relative z-10 max-w-full max-h-full object-contain rounded-[20px]"
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Gamepad2 className="w-12 h-12 text-gray-500" strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Scrollable Content - 67% */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-5 p-6">
        {/* Title + Rating Badge */}
        <div className="flex justify-between items-center gap-3 border-b border-gray-700 pb-3">
          <h2 className="text-2xl font-bold text-white flex-grow">
            {game.title}
          </h2>
          
          {/* RAWG Rating Badge */}
          {roundedRating && displayRating && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="flex items-center justify-center flex-shrink-0 cursor-help"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '8px',
                      backgroundColor: getBadgeColor(roundedRating)
                    }}
                  >
                    <span className="text-white text-xl font-bold">
                      {displayRating}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>RAWG Rating: {displayRating}/5</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Genre */}
        {game.genre && (
          <div className="flex flex-col gap-1">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Genre</div>
            <div className="text-white text-base">{game.genre}</div>
          </div>
        )}

        {/* Platform */}
        <div className="flex flex-col gap-1">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Platform</div>
          <div className="text-white text-base">{game.platform}</div>
        </div>

        {/* Year */}
        {game.year && (
          <div className="flex flex-col gap-1">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Year</div>
            <div className="text-white text-base">{game.year}</div>
          </div>
        )}

        {/* Personal Notes */}
        {game.notes && (
          <div className="flex flex-col gap-1">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Personal Notes</div>
            <div className="p-3 bg-white/5 border-l-4 border-gray-600 rounded italic text-gray-400">
              {game.notes}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Action Buttons - Always at Bottom */}
      <div className="flex gap-3 p-6 border-t border-gray-700 bg-gray-800/50">
        <Link href={`/games/${game._id}/edit`} className="flex-1">
          <Button
            variant="outline"
            className="w-full min-h-[44px] rounded-full"
            aria-label={`Edit ${game.title}`}
          >
            Edit
          </Button>
        </Link>
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="flex-1 min-h-[44px] rounded-full"
          aria-label={`Delete ${game.title}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

