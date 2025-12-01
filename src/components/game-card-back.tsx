"use client";

import { IGame } from "@/types/game";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { X, Gamepad2 } from "lucide-react";

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

      {/* Blurred Artwork Header - 33% */}
      <div className="relative w-full h-[33.333%] overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
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
            {/* Sharp foreground layer */}
            <Image
              src={game.coverImageUrl}
              alt={`${game.title} cover`}
              fill
              className="object-contain"
              sizes="600px"
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
        {/* Title */}
        <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-3">
          {game.title}
        </h2>

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

