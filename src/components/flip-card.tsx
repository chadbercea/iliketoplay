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

  // Shared animation config
  const transition = {
    duration: 0.6,
    ease: [0.32, 0.72, 0, 1]
  };

  return (
    <>
      {/* GRID CARD - Always visible, portal card covers it */}
      <motion.div
        layoutId={`game-card-${game._id}`}
        onClick={() => !isExpanded && setIsExpanded(true)}
        style={{
          aspectRatio: '9/16',
          cursor: isExpanded ? 'default' : 'pointer',
          borderRadius: '12px',
          overflow: 'hidden',
          transformOrigin: 'center center'
        }}
        transition={{ layout: transition }}
      >
        <GameCard game={game} />
      </motion.div>

      {/* EXPANDED CARD - Portal with persistent z-index container */}
      {mounted && createPortal(
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 100, 
          pointerEvents: 'none' 
        }}>
          <AnimatePresence>
            {isExpanded && (
              <>
                {/* Backdrop */}
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
                    pointerEvents: 'auto'
                  }}
                />
                
                {/* Expanded Card */}
                <motion.div
                  key={`card-${game._id}`}
                  layoutId={`game-card-${game._id}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    margin: 'auto',
                    width: 'min(90vw, 600px)',
                    height: 'min(90vh, 800px)',
                    zIndex: 1,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    perspective: '1000px',
                    transformOrigin: 'center center',
                    pointerEvents: 'auto'
                  }}
                  transition={{ layout: transition }}
                >
                  {/* Rotation Wrapper */}
                  <motion.div
                    key={`rotation-${game._id}`}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 180 }}
                    exit={{ rotateY: 0 }}
                    transition={transition}
                    style={{
                      transformStyle: 'preserve-3d',
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      transformOrigin: 'center center'
                    }}
                  >
                    {/* Front Side */}
                    <div style={{
                      backfaceVisibility: 'hidden',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0
                    }}>
                      <GameCard game={game} />
                    </div>
                    
                    {/* Back Side */}
                    <div style={{
                      backfaceVisibility: 'hidden',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      transform: 'rotateY(180deg)'
                    }}>
                      <GameCardBack game={game} onDelete={onDelete} onClose={() => setIsExpanded(false)} />
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </>
  );
}

