"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IGame } from "@/types/game";
import { GameCard } from "./game-card";
import { GameCardBack } from "./game-card-back";

interface FlipCardProps {
  game: IGame;
  onDelete: (id: string) => void;
}

export function FlipCard({ game, onDelete }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

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

  return (
    <>
      {/* Backdrop */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 bg-black z-40"
          onClick={() => setIsFlipped(false)}
        />
      )}

      {/* Single Card Component */}
      <motion.div
        layout
        layoutId={`game-card-${game._id}`}
        onClick={() => !isFlipped && setIsFlipped(true)}
        className={!isFlipped ? "cursor-pointer" : ""}
        style={{
          position: isFlipped ? "fixed" : "relative",
          top: isFlipped ? "50%" : "auto",
          left: isFlipped ? "50%" : "auto",
          transform: isFlipped ? "translate(-50%, -50%)" : "none",
          width: isFlipped ? "min(90vw, 600px)" : "100%",
          height: isFlipped ? "min(90vh, 800px)" : "auto",
          aspectRatio: "9 / 16",
          zIndex: isFlipped ? 50 : 1,
          transformStyle: "preserve-3d",
        }}
        transition={{
          duration: 0.6,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        {/* Inner Rotation Container */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.6,
            ease: [0.32, 0.72, 0, 1],
          }}
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {/* Front */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
            }}
          >
            <GameCard game={game} />
          </div>

          {/* Back */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <GameCardBack game={game} onDelete={onDelete} onClose={() => setIsFlipped(false)} />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

