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
        onClick={mounted && !isFlipped ? handleCardClick : undefined}
        className={mounted && !isFlipped ? "cursor-pointer" : ""}
      >
        {isFlipped ? (
          /* Placeholder outline when card is flipped */
          <div className="w-full max-w-[300px] aspect-[9/16] rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/30" />
        ) : (
          <GameCard game={game} />
        )}
      </div>

      {/* Flipping Card Overlay */}
      {mounted && isFlipped && startRect && createPortal(
        <div 
          className="fixed inset-0 z-50"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-300" />
          
          {/* Animating Card - starts at grid position, moves to center */}
          <div 
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              perspective: "2000px",
              width: "100vw",
              height: "100vh",
              pointerEvents: "none",
            }}
          >
            <div 
              className="flip-card-inner"
              style={{
                position: "absolute",
                left: `${startRect.left + startRect.width / 2}px`,
                top: `${startRect.top + startRect.height / 2}px`,
                width: "min(90vw, 600px)",
                height: "min(90vh, 800px)",
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
                animation: "moveAndFlip 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                pointerEvents: "auto",
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
                <div style={{ width: "300px", maxWidth: "100%" }}>
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
                }}
                onClick={handleCardClick}
              >
                <GameCardBack game={game} onDelete={onDelete} />
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes moveAndFlip {
              0% {
                transform: translate(-50%, -50%) rotateY(0deg) scale(0.5);
              }
              100% {
                transform: 
                  translate(
                    calc(50vw - ${startRect.left + startRect.width / 2}px - 50%),
                    calc(50vh - ${startRect.top + startRect.height / 2}px - 50%)
                  )
                  rotateY(180deg)
                  scale(1);
              }
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
}

