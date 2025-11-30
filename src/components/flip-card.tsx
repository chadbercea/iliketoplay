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
    // OUTER WRAPPER: Handles positioning and centering
    <motion.div
      layout
      onClick={() => !isExpanded && setIsExpanded(true)}
      style={{
        position: isExpanded ? 'fixed' : 'relative',
        inset: isExpanded ? 0 : 'auto',
        display: isExpanded ? 'flex' : 'block',
        alignItems: isExpanded ? 'center' : 'normal',
        justifyContent: isExpanded ? 'center' : 'normal',
        zIndex: isExpanded ? 50 : 1
      }}
      transition={{
        layout: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
      }}
    >
      {/* INNER WRAPPER: Handles rotation only */}
      <motion.div
        animate={{ rotateY: isExpanded ? 180 : 0 }}
        transition={{
          duration: 0.6,
          ease: [0.32, 0.72, 0, 1]
        }}
        style={{
          transformStyle: 'preserve-3d',
          width: isExpanded ? 'min(90vw, 600px)' : '100%',
          height: isExpanded ? 'min(90vh, 800px)' : 'auto',
          aspectRatio: isExpanded ? 'auto' : '9/16',
          position: 'relative'
        }}
      >
        {/* FRONT SIDE */}
        <div style={{
          backfaceVisibility: 'hidden',
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}>
          <GameCard game={game} />
        </div>
        
        {/* BACK SIDE: Counter-rotated to be readable */}
        <div style={{
          backfaceVisibility: 'hidden',
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: 'rotateY(180deg)'
        }}>
          <GameCardBack game={game} onDelete={onDelete} onClose={() => setIsExpanded(false)} />
        </div>
      </motion.div>
    </motion.div>
  );
}

