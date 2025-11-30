"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      {/* Card in Grid */}
      <motion.div
        layoutId={`game-card-${game._id}`}
        onClick={() => !isFlipped && setIsFlipped(true)}
        className={!isFlipped ? "cursor-pointer" : "invisible"}
        style={{
          aspectRatio: "9 / 16",
          transformStyle: "preserve-3d",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <GameCard game={game} />
      </motion.div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isFlipped && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-black"
              onClick={() => setIsFlipped(false)}
            />

            {/* Animated Card */}
            <motion.div
              layoutId={`game-card-${game._id}`}
              className="relative"
              style={{
                width: "min(90vw, 600px)",
                height: "min(90vh, 800px)",
                aspectRatio: "9 / 16",
                transformStyle: "preserve-3d",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 180 }}
                exit={{ rotateY: 0 }}
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
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

