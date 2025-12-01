"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { IGame } from "@/types/game";
import { GameCard } from "./game-card";
import { GameCardBack } from "./game-card-back";

interface FlipCardProps {
  game: IGame;
  onDelete: (id: string) => void;
}

export function FlipCard({ game, onDelete }: FlipCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const transition = {
    duration: 0.6,
    ease: [0.32, 0.72, 0, 1] as [number, number, number, number]
  };

  // ============================================================================
  // SHARED CARD CONTENT - Both grid and expanded cards use identical structure
  // ============================================================================
  const cardContent = (
    <motion.div
      animate={{ rotateY: isExpanded ? 180 : 0 }}
      exit={{ rotateY: 0 }}
      transition={transition}
      style={{
        transformStyle: 'preserve-3d',
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Front Side - Always rendered */}
      <div style={{
        backfaceVisibility: 'hidden',
        position: 'absolute',
        width: '100%',
        height: '100%',
        inset: 0
      }}>
        <GameCard game={game} />
      </div>
      
      {/* Back Side - Always rendered */}
      <div style={{
        backfaceVisibility: 'hidden',
        position: 'absolute',
        width: '100%',
        height: '100%',
        inset: 0,
        transform: 'rotateY(180deg)'
      }}>
        <GameCardBack 
          game={game} 
          onDelete={onDelete} 
          onClose={() => setIsExpanded(false)} 
        />
      </div>
    </motion.div>
  );

  return (
    <>
      {/* ====================================================================== */}
      {/* GRID CARD - Always in DOM, hidden when expanded                       */}
      {/* ====================================================================== */}
      <motion.div
        layoutId={`game-card-${game._id}`}
        onClick={() => !isExpanded && setIsExpanded(true)}
        style={{
          aspectRatio: '9/16',
          cursor: isExpanded ? 'default' : 'pointer',
          opacity: isExpanded ? 0 : 1,              // Hide when expanded
          pointerEvents: isExpanded ? 'none' : 'auto',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
        transition={{ layout: transition }}
      >
        {cardContent}
      </motion.div>

      {/* ====================================================================== */}
      {/* EXPANDED CARD - Portal to body when expanded                          */}
      {/* ====================================================================== */}
      {mounted && createPortal(
        <>
          {/* Backdrop */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key={`backdrop-${game._id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={transition}
                onClick={() => setIsExpanded(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'black',
                  zIndex: 100
                }}
              />
            )}
          </AnimatePresence>
          
          {/* Expanded Card */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key={`card-${game._id}`}
                layoutId={`game-card-${game._id}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'fixed',
                  inset: 0,
                  margin: 'auto',
                  width: 'min(90vw, 600px)',
                  maxHeight: '90vh',
                  aspectRatio: '9/16',
                  zIndex: 101,
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
                transition={{ layout: transition }}
              >
                {cardContent}
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
}
