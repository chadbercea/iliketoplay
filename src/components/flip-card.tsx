"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IGame } from "@/types/game";
import { GameCard } from "./game-card";
import { GameCardBack } from "./game-card-back";

interface FlipCardProps {
  game: IGame;
  onDelete: (id: string) => void;
}

export function FlipCard({ game, onDelete }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isFlipped) {
      // Disable body scroll when modal open
      document.body.style.overflow = "hidden";
      
      // Close on Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsFlipped(false);
        }
      };
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isFlipped]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close if clicking the backdrop, not the card content
    if (e.target === e.currentTarget) {
      setIsFlipped(false);
    }
  };

  return (
    <>
      {/* Front Card in Grid */}
      <div
        onClick={handleCardClick}
        className="cursor-pointer"
        style={{
          visibility: isFlipped ? "hidden" : "visible",
        }}
      >
        <GameCard game={game} />
      </div>

      {/* Modal with Back Card */}
      {mounted && isFlipped && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Animated Back Card */}
          <div 
            className="relative z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
            style={{
              animation: "flipIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}
            onClick={handleCardClick}
          >
            <GameCardBack game={game} onDelete={onDelete} />
          </div>

          <style jsx>{`
            @keyframes flipIn {
              0% {
                transform: perspective(1200px) rotateX(-90deg) scale(0.8);
                opacity: 0;
              }
              100% {
                transform: perspective(1200px) rotateX(0deg) scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
}

