/**
 * Seeded Random Number Generator
 * 
 * Creates a deterministic pseudo-random number generator using a Linear Congruential Generator (LCG).
 * This ensures reproducible test outputs and consistent visual appearance across runs with the same seed.
 * 
 * @param {number} seed - Initial seed value (default: 42)
 * @returns {function} A generator function that returns values in [0, 1) range
 */
export function createSeededRandom(seed = 42) {
  // LCG parameters - commonly used high-quality constants
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32); // 2^32
  
  // Internal state stored in closure
  let state = seed;
  
  // Return generator function
  return function() {
    state = (a * state + c) % m;
    return state / m; // Normalize to [0, 1)
  };
}
