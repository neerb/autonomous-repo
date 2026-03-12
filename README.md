# Binary Tree Fractal Simulation

A React-based web application that renders an animated binary tree fractal using HTML5 Canvas. The tree grows from a single trunk with recursive branching, then sways gently as if in the wind.

## Features

- **Recursive fractal generation** with configurable depth (default: 10 levels)
- **Two-phase animation:**
  - Growth phase: Tree animates from trunk to full canopy over 4 seconds
  - Sway phase: Continuous gentle wind-like motion
- **Visual depth gradient** from brown trunk to green leaves
- **Deterministic seeded randomness** for reproducible results
- **Smooth 60fps animation** with optimized canvas rendering

## Prerequisites

- Node.js 18.0.0 or higher
- npm (included with Node.js)

## Installation

```bash
npm install
```

## Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`.

## Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Architecture

### Project Structure

```
src/
├── components/
│   └── FractalTree.jsx      # Main canvas component with animation logic
├── utils/
│   ├── seededRandom.js      # Deterministic random number generator
│   └── fractalAlgorithm.js  # Tree generation and color calculations
├── App.jsx                  # Root application component
└── index.jsx               # React DOM bootstrap
```

### Key Design Decisions

- **Pre-calculated tree structure:** The entire tree is generated once during initialization to avoid per-frame allocation and recursion
- **Flattened branch array:** All branches stored in a single array for cache-friendly iteration during rendering
- **Time-based animation:** Uses elapsed milliseconds for consistent animation speed regardless of frame rate variations
- **Batch canvas drawing:** Single `beginPath()`/`stroke()` call per frame for optimal performance

## Configuration

You can customize tree parameters by modifying `DEFAULT_CONFIG` in `src/utils/fractalAlgorithm.js`:

```javascript
export const DEFAULT_CONFIG = {
  trunkLength: 120,           // Initial trunk length in pixels
  maxDepth: 10,               // Recursion depth (8-12 recommended)
  lengthScale: 0.7,           // Length reduction per generation
  baseAngle: Math.PI / 6,     // Base branching angle (30 degrees)
  angleVariation: Math.PI / 12, // Random angle range (±15 degrees)
  maxThickness: 8,            // Trunk thickness in pixels
  seed: 42                    // Random seed for reproducibility
};
```

### Animation Tuning

Adjust animation parameters in `FractalTree.jsx`:

- `GROWTH_DURATION`: Duration of growth phase in milliseconds (default: 4000)
- `swayFrequency`: Speed of sway motion in radians/ms (default: 0.001)
- `baseAmplitude`: Maximum sway angle in radians (default: 0.05)

## Performance

The application is optimized for smooth 60fps animation on mid-range hardware:

- Pre-calculated tree geometry eliminates runtime recursion
- Integer pixel coordinates reduce subpixel rendering overhead
- No object allocation inside animation loop
- Proper cleanup of animation frames prevents memory leaks

For performance profiling, use Chrome DevTools Performance tab to measure frame times (target: <16.67ms for 60fps).

## Browser Compatibility

Requires a modern browser with ES2020+ support:
- Chrome 80+
- Firefox 80+
- Safari 14+
- Edge 80+

## License

Private project - no license specified.