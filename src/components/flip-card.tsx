"use client";

import { useState, useEffect, useRef } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [startRect, setStartRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isFlipped) {
      document.body.style.overflow = "hidden";
      
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
    if (!isFlipped && cardRef.current) {
      // Capture position before flipping
      const rect = cardRef.current.getBoundingClientRect();
      setStartRect(rect);
    }
    setIsFlipped(!isFlipped);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsFlipped(false);
    }
  };

  return (
    <>
      {/* Card in Grid */}
      <div
        ref={cardRef}
        onClick={mounted ? handleCardClick : undefined}
        className={mounted ? "cursor-pointer" : ""}
      >
        <GameCard game={game} />
      </div>

      {/* Flipping Card Overlay */}
      {mounted && isFlipped && startRect && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-300" />
          
          {/* Flip Container */}
          <div 
            className="flip-container"
            style={{
              perspective: "2000px",
              width: "min(90vw, 600px)",
              height: "min(90vh, 800px)",
            }}
          >
            <div 
              className="flip-card-inner"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                animation: "flipAndGrow 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
              }}
            >
              {/* Front Side */}
              <div 
                className="flip-card-front"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "300px", aspectRatio: "9/16" }}>
                  <GameCard game={game} />
                </div>
              </div>

              {/* Back Side */}
              <div 
                className="flip-card-back"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={handleCardClick}
              >
                <GameCardBack game={game} onDelete={onDelete} />
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes flipAndGrow {
              0% {
                transform: rotateY(0deg);
              }
              100% {
                transform: rotateY(180deg);
              }
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
}

