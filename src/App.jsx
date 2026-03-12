import { useMemo } from 'react';
import { FractalTree } from './components/FractalTree.jsx';
import { generateFractalTree } from './utils/fractalAlgorithm.js';

export function App() {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  // Generate fractal tree once on mount
  const branches = useMemo(() => {
    return generateFractalTree({
      startX: canvasWidth / 2,
      startY: canvasHeight - 50,  // Start near bottom
      initialLength: 120,
      initialAngle: -90,           // Straight up
      maxDepth: 11,
      seed: 12345
    });
  }, [canvasWidth, canvasHeight]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <FractalTree 
        branches={branches} 
        canvasWidth={canvasWidth} 
        canvasHeight={canvasHeight} 
      />
    </div>
  );
}