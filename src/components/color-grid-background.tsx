"use client";

import { useEffect, useRef } from 'react';

const colors = [
  [255, 0, 0],     // Red
  [255, 107, 0],   // Orange
  [255, 170, 0],   // Amber
  [255, 208, 0],   // Yellow
  [0, 255, 0],     // Green
  [0, 255, 136],   // Mint
  [0, 255, 255],   // Cyan
  [0, 136, 255],   // Blue
  [0, 68, 255],    // Royal Blue
  [102, 0, 255],   // Purple
  [170, 0, 255],   // Violet
  [255, 0, 255],   // Magenta
  [255, 0, 136],   // Pink
  [255, 255, 255], // White
];

interface Square {
  x: number;
  y: number;
  color: number[];
  opacity: number;
  targetOpacity: number;
  fadeStartTime: number;
  isFadingIn: boolean;
}

export function ColorGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const squaresRef = useRef<Map<string, Square>>(new Map());
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    // Setup
    const squareSize = 16;
    let cols = 0;
    let rows = 0;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / squareSize);
      rows = Math.ceil(canvas.height / squareSize);
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const col = Math.floor(x / squareSize);
      const row = Math.floor(y / squareSize);
      const key = `${col},${row}`;
      
      const squares = squaresRef.current;
      
      if (!squares.has(key)) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        squares.set(key, {
          x: col * squareSize,
          y: row * squareSize,
          color: randomColor,
          opacity: 0,
          targetOpacity: 0.1,
          fadeStartTime: Date.now(),
          isFadingIn: true
        });
      } else {
        const square = squares.get(key)!;
        if (!square.isFadingIn) {
          square.isFadingIn = true;
          square.targetOpacity = 0.1;
          square.fadeStartTime = Date.now();
        }
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      // Clear with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const now = Date.now();
      const squares = squaresRef.current;
      const toDelete: string[] = [];
      
      squares.forEach((square, key) => {
        const elapsed = now - square.fadeStartTime;
        
        if (square.isFadingIn) {
          // Fade in: 300ms
          const progress = Math.min(elapsed / 300, 1);
          square.opacity = progress * 0.1;
          
          if (progress >= 1) {
            square.isFadingIn = false;
            square.fadeStartTime = now;
            square.targetOpacity = 0;
          }
        } else {
          // Fade out: 2000ms
          const progress = Math.min(elapsed / 2000, 1);
          square.opacity = 0.1 * (1 - progress);
          
          if (progress >= 1) {
            toDelete.push(key);
            return;
          }
        }
        
        // Draw square
        const [r, g, b] = square.color;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${square.opacity})`;
        ctx.fillRect(square.x, square.y, squareSize, squareSize);
      });
      
      // Clean up fully faded squares
      toDelete.forEach(key => squares.delete(key));
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        cursor: 'default'
      }}
    />
  );
}

