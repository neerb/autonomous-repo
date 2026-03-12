/**
 * Fractal Tree Algorithm
 * 
 * Pure functions that generate tree structure as a hierarchical data representation,
 * separating algorithm logic from rendering concerns.
 */

import { createSeededRandom } from './seededRandom.js';

// Default configuration constants
export const DEFAULT_CONFIG = {
  trunkLength: 120,
  maxDepth: 10,
  lengthScale: 0.7,
  baseAngle: Math.PI / 6,        // 30 degrees
  angleVariation: Math.PI / 12,  // ±15 degrees
  maxThickness: 8,
  seed: 42
};

/**
 * Generate complete tree structure
 * 
 * @param {Object} config - Tree generation parameters
 * @param {number} config.startX - Starting X coordinate
 * @param {number} config.startY - Starting Y coordinate
 * @param {number} config.trunkLength - Initial trunk length
 * @param {number} config.maxDepth - Maximum recursion depth
 * @param {number} config.lengthScale - Length reduction factor per generation
 * @param {number} config.baseAngle - Base branching angle in radians
 * @param {number} config.angleVariation - Random angle variation range in radians
 * @param {number} config.seed - Random seed for reproducibility
 * @returns {Object} Tree structure with flattened branches array
 */
export function generateTreeStructure(config) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const random = createSeededRandom(finalConfig.seed);
  
  // Create trunk branch (depth 0)
  const trunk = {
    startX: finalConfig.startX,
    startY: finalConfig.startY,
    endX: finalConfig.startX,
    endY: finalConfig.startY - finalConfig.trunkLength,
    angle: -Math.PI / 2, // Straight up
    length: finalConfig.trunkLength,
    depth: 0,
    thickness: finalConfig.maxThickness
  };
  
  // Generate all branches recursively
  const allBranches = [
    trunk,
    ...generateBranch(trunk, 1, finalConfig.maxDepth, random, finalConfig)
  ];
  
  return {
    branches: allBranches
  };
}

/**
 * Recursively generate branches
 * 
 * @param {Object} parent - Parent branch object
 * @param {number} depth - Current recursion depth
 * @param {number} maxDepth - Maximum recursion depth
 * @param {function} random - Random number generator
 * @param {Object} config - Tree configuration
 * @returns {Array} Flattened array of all descendant branches
 */
function generateBranch(parent, depth, maxDepth, random, config) {
  // Termination condition
  if (depth >= maxDepth) {
    return [];
  }
  
  const branches = [];
  
  // Calculate child branch properties
  const childLength = parent.length * config.lengthScale;
  const childThickness = config.maxThickness * (1 - depth / maxDepth);
  
  // Generate left branch
  const leftAngleOffset = -config.baseAngle + (random() * 2 - 1) * config.angleVariation;
  const leftAngle = parent.angle + leftAngleOffset;
  const leftBranch = {
    startX: parent.endX,
    startY: parent.endY,
    endX: parent.endX + Math.cos(leftAngle) * childLength,
    endY: parent.endY + Math.sin(leftAngle) * childLength,
    angle: leftAngle,
    length: childLength,
    depth: depth,
    thickness: Math.max(1, childThickness)
  };
  
  // Generate right branch
  const rightAngleOffset = config.baseAngle + (random() * 2 - 1) * config.angleVariation;
  const rightAngle = parent.angle + rightAngleOffset;
  const rightBranch = {
    startX: parent.endX,
    startY: parent.endY,
    endX: parent.endX + Math.cos(rightAngle) * childLength,
    endY: parent.endY + Math.sin(rightAngle) * childLength,
    angle: rightAngle,
    length: childLength,
    depth: depth,
    thickness: Math.max(1, childThickness)
  };
  
  // Add branches and their descendants
  branches.push(leftBranch);
  branches.push(...generateBranch(leftBranch, depth + 1, maxDepth, random, config));
  
  branches.push(rightBranch);
  branches.push(...generateBranch(rightBranch, depth + 1, maxDepth, random, config));
  
  return branches;
}

/**
 * Calculate branch color based on depth
 * Interpolates from brown (trunk) to green (leaves)
 * 
 * @param {number} depth - Branch depth
 * @param {number} maxDepth - Maximum tree depth
 * @returns {string} RGB color string
 */
export function calculateBranchColor(depth, maxDepth) {
  // Trunk color (dark brown)
  const trunkColor = { r: 74, g: 55, b: 40 }; // #4a3728
  
  // Leaf color (olive green)
  const leafColor = { r: 107, g: 142, b: 35 }; // #6b8e23
  
  // Linear interpolation based on depth ratio
  const ratio = depth / maxDepth;
  const r = Math.round(trunkColor.r + (leafColor.r - trunkColor.r) * ratio);
  const g = Math.round(trunkColor.g + (leafColor.g - trunkColor.g) * ratio);
  const b = Math.round(trunkColor.b + (leafColor.b - trunkColor.b) * ratio);
  
  return `rgb(${r}, ${g}, ${b})`;
}