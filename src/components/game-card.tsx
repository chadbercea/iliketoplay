"use client";

import { IGame } from "@/types/game";
import Image from "next/image";
import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: IGame;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="relative w-full max-w-[300px] aspect-[9/16] rounded-xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg">
      {/* Cover Image Background */}
      {game.coverImageUrl ? (
        <Image
          src={game.coverImageUrl}
          alt={`${game.title} cover`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <Gamepad2 className="w-20 h-20 text-gray-500" strokeWidth={1} />
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, transparent 70%)'
        }}
      />
      
      {/* Content at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
        {/* Platform Chip */}
        <Badge 
          variant="outline" 
          className="w-fit bg-white/20 border-white/30 text-white text-xs uppercase tracking-wide backdrop-blur-sm"
        >
          {game.platform}
        </Badge>
        
        {/* Title */}
        <h3 className="text-white text-xl font-semibold leading-tight line-clamp-2 drop-shadow-lg">
          {game.title}
        </h3>
      </div>
    </div>
  );
}

