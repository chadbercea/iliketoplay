"use client";

import { useEffect, useRef } from 'react';

export function MagneticDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    // Dot grid settings
    const dotSpacing = 40;
    const dotRadius = 1;
    const magnetRadius = 200;
    const maxDisplacement = 15;
    
    // Create static dot positions
    const dots: Array<{ x: number; y: number }> = [];
    for (let x = 0; x < canvas.width; x += dotSpacing) {
      for (let y = 0; y < canvas.height; y += dotSpacing) {
        dots.push({ x, y });
      }
    }
    
    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      
      dots.forEach(dot => {
        // Calculate distance from mouse
        const dx = mouseX - dot.x;
        const dy = mouseY - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate displacement
        let offsetX = 0;
        let offsetY = 0;
        
        if (distance < magnetRadius) {
          const force = (1 - distance / magnetRadius) * maxDisplacement;
          const angle = Math.atan2(dy, dx);
          offsetX = Math.cos(angle) * force;
          offsetY = Math.sin(angle) * force;
        }
        
        // Draw dot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.arc(
          dot.x + offsetX,
          dot.y + offsetY,
          dotRadius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}

