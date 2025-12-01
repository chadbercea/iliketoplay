"use client";

import { IGame } from "@/types/game";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";

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

  return (
    <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col relative">
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-5">
        {/* Title */}
        <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-3">
          {game.title}
        </h2>

        {/* Metacritic Score */}
        {game.metacriticScore && (
          <div className="flex flex-col gap-1">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Metacritic Score</div>
            <div>
              <span className="inline-block px-3 py-1.5 bg-green-600 text-black font-bold rounded text-lg">
                {game.metacriticScore}
              </span>
            </div>
          </div>
        )}

        {/* Publisher */}
        {game.publisher && (
          <div className="flex flex-col gap-1">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Publisher</div>
            <div className="text-white text-base">{game.publisher}</div>
          </div>
        )}

        {/* Release Date */}
        {game.releaseDate && (
          <div className="flex flex-col gap-1">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Release Date</div>
            <div className="text-white text-base">
              {new Date(game.releaseDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        )}

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

        {/* Description */}
        {game.description && (
          <div className="flex flex-col gap-1">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Description</div>
            <div className="text-gray-300 text-base leading-relaxed">{game.description}</div>
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
      <div className="flex gap-3 p-4 border-t border-gray-700 bg-gray-800/50">
        <Link href={`/games/${game._id}/edit`} className="flex-1">
          <Button
            variant="outline"
            className="w-full min-h-[44px]"
            aria-label={`Edit ${game.title}`}
          >
            Edit
          </Button>
        </Link>
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="flex-1 min-h-[44px]"
          aria-label={`Delete ${game.title}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

