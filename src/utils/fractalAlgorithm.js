import { createSeededRandom } from './seededRandom.js';

/**
 * Configuration constants for fractal generation
 */
const CONFIG = {
  MAX_DEPTH: 12,
  BASE_ANGLE: 25,           // degrees
  ANGLE_VARIATION: 10,      // ± degrees
  LENGTH_DECAY: 0.67,       // branch length multiplier per depth level
  LENGTH_VARIATION: 0.1,    // ± proportion
  TRUNK_THICKNESS: 12,
  MIN_THICKNESS: 1
};

/**
 * Generates a complete binary tree fractal structure.
 * @param {Object} params
 * @param {number} params.startX - Root x coordinate
 * @param {number} params.startY - Root y coordinate
 * @param {number} params.initialLength - Trunk length
 * @param {number} params.initialAngle - Trunk angle in degrees (0 = up)
 * @param {number} params.maxDepth - Recursion depth limit
 * @param {number} params.seed - Random seed for reproducibility
 * @returns {Array<Object>} Array of branch objects with coordinates and metadata
 */
export function generateFractalTree(params) {
  const {
    startX,
    startY,
    initialLength,
    initialAngle = -90,  // -90 = straight up
    maxDepth = CONFIG.MAX_DEPTH,
    seed = 12345
  } = params;

  const random = createSeededRandom(seed);
  const branches = [];

  function drawBranch(x1, y1, length, angle, depth) {
    if (depth > maxDepth || length < 1) return;

    // Calculate endpoint
    const angleRad = (angle * Math.PI) / 180;
    const x2 = x1 + length * Math.cos(angleRad);
    const y2 = y1 + length * Math.sin(angleRad);

    // Calculate thickness with taper
    const thickness = Math.max(
      CONFIG.MIN_THICKNESS,
      CONFIG.TRUNK_THICKNESS * Math.pow(CONFIG.LENGTH_DECAY, depth)
    );

    // Calculate color interpolation (brown trunk → green leaves)
    const colorProgress = depth / maxDepth;
    const hue = 30 + (90 * colorProgress);        // 30 (brown) → 120 (green)
    const saturation = 40 + (20 * colorProgress);  // 40% → 60%
    const lightness = 30 + (30 * colorProgress);   // 30% → 60%

    branches.push({
      x1, y1, x2, y2,
      depth,
      thickness,
      color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      angle: angleRad  // Store for sway animation
    });

    // Recursively generate child branches
    const nextLength = length * (CONFIG.LENGTH_DECAY + (random() - 0.5) * CONFIG.LENGTH_VARIATION);
    const leftAngle = angle - (CONFIG.BASE_ANGLE + (random() - 0.5) * CONFIG.ANGLE_VARIATION);
    const rightAngle = angle + (CONFIG.BASE_ANGLE + (random() - 0.5) * CONFIG.ANGLE_VARIATION);

    drawBranch(x2, y2, nextLength, leftAngle, depth + 1);
    drawBranch(x2, y2, nextLength, rightAngle, depth + 1);
  }

  drawBranch(startX, startY, initialLength, initialAngle, 0);
  
  return branches;
}