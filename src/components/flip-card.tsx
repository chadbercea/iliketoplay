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
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  return (
    <>
      {!isFlipped ? (
        /* Card in Grid - Only when NOT flipped */
        <motion.div
          layoutId={`game-card-${game._id}`}
          onClick={() => mounted && setIsFlipped(true)}
          className="cursor-pointer"
          style={{
            transformStyle: "preserve-3d",
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <GameCard game={game} />
        </motion.div>
      ) : (
        /* Placeholder when flipped */
        <div className="w-full max-w-[300px] aspect-[9/16] rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/30" />
      )}

      {/* Modal Overlay - Only rendered in portal when flipped */}
      {mounted && isFlipped && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsFlipped(false);
            }
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Animated Card */}
          <motion.div
            layoutId={`game-card-${game._id}`}
            className="relative z-10"
            style={{
              width: "min(90vw, min(90vh * 9 / 16, 600px))",
              aspectRatio: "9 / 16",
              transformStyle: "preserve-3d",
            }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 180 }}
              exit={{ rotateY: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
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
        </motion.div>,
        document.body
      )}
    </>
  );
}

