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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsExpanded(false);
        }
      };
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isExpanded]);

  return (
    <motion.div
      layout
      onClick={() => !isExpanded && setIsExpanded(true)}
      animate={{
        rotateY: isExpanded ? 180 : 0,
        zIndex: isExpanded ? 50 : 1
      }}
      transition={{
        layout: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
        rotateY: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
      }}
      style={{
        transformStyle: 'preserve-3d',
        position: isExpanded ? 'fixed' : 'relative',
        top: isExpanded ? '50%' : 'auto',
        left: isExpanded ? '50%' : 'auto',
        transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
        width: isExpanded ? 'min(90vw, 600px)' : '100%',
        height: isExpanded ? 'min(90vh, 800px)' : 'auto',
        aspectRatio: isExpanded ? 'auto' : '9/16'
      }}
    >
      {isExpanded ? (
        <GameCardBack game={game} onDelete={onDelete} onClose={() => setIsExpanded(false)} />
      ) : (
        <GameCard game={game} />
      )}
    </motion.div>
  );
}

