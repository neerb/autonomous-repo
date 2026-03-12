import { useEffect, useRef, useState } from 'react';

const ANIMATION_CONFIG = {
  GROWTH_DURATION: 5000,        // ms
  SWAY_AMPLITUDE: 0.08,         // radians (~4.5 degrees)
  SWAY_FREQUENCY: 0.5,          // Hz
  SWAY_DEPTH_MULTIPLIER: 0.15   // tip sway enhancement
};

export function FractalTree({ branches, canvasWidth, canvasHeight }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const [phase, setPhase] = useState('growth'); // 'growth' | 'sway'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let maxDepth = 0;
    branches.forEach(b => {
      if (b.depth > maxDepth) maxDepth = b.depth;
    });

    function animate(timestamp) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (phase === 'growth') {
        // Growth phase: progressively reveal branches by depth
        const progress = Math.min(elapsed / ANIMATION_CONFIG.GROWTH_DURATION, 1);
        const currentMaxDepth = Math.floor(progress * maxDepth);

        branches.forEach(branch => {
          if (branch.depth <= currentMaxDepth) {
            drawBranch(ctx, branch, 1.0);
          } else if (branch.depth === currentMaxDepth + 1) {
            // Partially draw the next depth level
            const depthProgress = (progress * maxDepth) - currentMaxDepth;
            drawBranch(ctx, branch, depthProgress);
          }
        });

        if (progress >= 1) {
          setPhase('sway');
          startTimeRef.current = timestamp; // Reset timer for sway phase
        }
      } else if (phase === 'sway') {
        // Sway phase: apply sinusoidal rotation to all branches
        const time = elapsed / 1000; // seconds
        const swayAngle = Math.sin(time * ANIMATION_CONFIG.SWAY_FREQUENCY * 2 * Math.PI) * ANIMATION_CONFIG.SWAY_AMPLITUDE;

        branches.forEach(branch => {
          // Calculate depth-based sway multiplier (tips sway more)
          const depthFactor = 1 + (branch.depth / maxDepth) * ANIMATION_CONFIG.SWAY_DEPTH_MULTIPLIER;
          const branchSway = swayAngle * depthFactor;

          // Rotate branch around its starting point
          const length = Math.sqrt(Math.pow(branch.x2 - branch.x1, 2) + Math.pow(branch.y2 - branch.y1, 2));
          const newAngle = branch.angle + branchSway;
          const x2 = branch.x1 + length * Math.cos(newAngle);
          const y2 = branch.y1 + length * Math.sin(newAngle);

          drawBranch(ctx, { ...branch, x2, y2 }, 1.0);
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [branches, canvasWidth, canvasHeight, phase]);

  function drawBranch(ctx, branch, opacity) {
    ctx.strokeStyle = branch.color;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = branch.thickness;
    ctx.beginPath();
    ctx.moveTo(branch.x1, branch.y1);
    ctx.lineTo(branch.x2, branch.y2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{ display: 'block' }}
    />
  );
}