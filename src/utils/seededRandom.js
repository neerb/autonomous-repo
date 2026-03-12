/**
 * Linear Congruential Generator for reproducible pseudo-random sequences.
 * @param {number} seed - Integer seed value
 * @returns {function} Random number generator function returning values in [0, 1)
 */
export function createSeededRandom(seed) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}
