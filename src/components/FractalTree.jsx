import React, { useEffect, useRef, useState } from 'react';
import { generateTreeStructure, DEFAULT_CONFIG, calculateBranchColor } from '../utils/fractalAlgorithm.js';

/**
 * FractalTree Component
 * 
 * Renders an animated binary tree fractal on HTML5 canvas with two animation phases:
 * 1. Growth Phase: Tree animates from trunk to full canopy over 4 seconds
 * 2. Sway Phase: Tree continuously sways with wind-like motion
 */
function FractalTree() {
  // Canvas dimensions
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 800;
  const GROWTH_DURATION = 4000; // 4 seconds in milliseconds
  
  // Refs for canvas context and animation frame ID
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const animationIdRef = useRef(null);
  const treeDataRef = useRef(null);
  const startTimeRef = useRef(null);
  
  // Animation state: 'growing', 'swaying'
  const [animationPhase, setAnimationPhase] = useState('growing');
  
  // Initialization effect - runs once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ctxRef.current = canvas.getContext('2d');
    
    // Generate complete tree structure
    const startX = CANVAS_WIDTH / 2;
    const startY = CANVAS_HEIGHT - 50;
    
    treeDataRef.current = generateTreeStructure({
      ...DEFAULT_CONFIG,
      startX,
      startY
    });
  }, []);
  
  // Animation loop effect
  useEffect(() => {
    if (!ctxRef.current || !treeDataRef.current) return;
    
    const ctx = ctxRef.current;
    const tree = treeDataRef.current;
    
    /**
     * Draw tree during growth phase
     * Progressively reveals branches based on elapsed time
     */
    function drawGrowingTree(ctx, tree, elapsed) {
      const progress = Math.min(elapsed / GROWTH_DURATION, 1);
      const visibleCount = Math.floor(tree.branches.length * progress);
      
      ctx.beginPath();
      
      for (let i = 0; i < visibleCount; i++) {
        const branch = tree.branches[i];
        const color = calculateBranchColor(branch.depth, DEFAULT_CONFIG.maxDepth);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = branch.thickness;
        ctx.lineCap = 'round';
        
        ctx.moveTo(Math.round(branch.startX), Math.round(branch.startY));
        ctx.lineTo(Math.round(branch.endX), Math.round(branch.endY));
        ctx.stroke();
      }
    }
    
    /**
     * Draw tree during sway phase
     * Applies sinusoidal motion with amplitude proportional to depth
     */
    function drawSwayingTree(ctx, tree, elapsed) {
      const swayFrequency = 0.001; // Slow gentle sway
      const baseAmplitude = 0.05; // Max sway angle in radians (about 3 degrees)
      
      tree.branches.forEach((branch) => {
        // Calculate sway offset (tips move more than trunk)
        const depthFactor = branch.depth / DEFAULT_CONFIG.maxDepth;
        const swayAmount = Math.sin(elapsed * swayFrequency) * baseAmplitude * depthFactor;
        
        // Apply sway rotation around branch start point
        ctx.save();
        ctx.translate(branch.startX, branch.startY);
        ctx.rotate(swayAmount);
        ctx.translate(-branch.startX, -branch.startY);
        
        // Draw branch
        const color = calculateBranchColor(branch.depth, DEFAULT_CONFIG.maxDepth);
        ctx.strokeStyle = color;
        ctx.lineWidth = branch.thickness;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(Math.round(branch.startX), Math.round(branch.startY));
        ctx.lineTo(Math.round(branch.endX), Math.round(branch.endY));
        ctx.stroke();
        
        ctx.restore();
      });
    }
    
    function animate(timestamp) {
      // Initialize start time on first frame
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      if (animationPhase === 'growing') {
        drawGrowingTree(ctx, tree, elapsed);
        
        // Transition to swaying when growth completes
        if (elapsed >= GROWTH_DURATION) {
          setAnimationPhase('swaying');
          startTimeRef.current = timestamp; // Reset for sway phase
        }
      } else if (animationPhase === 'swaying') {
        drawSwayingTree(ctx, tree, elapsed);
      }
      
      animationIdRef.current = requestAnimationFrame(animate);
    }
    
    animationIdRef.current = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animationPhase]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: '#87ceeb' 
    }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '2px solid #333' }}
      />
    </div>
  );
}

export default FractalTree;