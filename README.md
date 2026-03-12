# Binary Tree Fractal Visualization

A recursive binary tree fractal renderer built with React and Canvas API. The visualization demonstrates algorithmic art through organic growth animation and gentle swaying motion.

## Features

- **Recursive Generation**: 11-level binary tree with ~2048 branches
- **Seeded Randomness**: Reproducible variations in branch angles and lengths
- **Two-Phase Animation**: 
  - Growth phase (5 seconds): Progressive reveal from trunk to canopy
  - Sway phase (continuous): Depth-based oscillation simulating wind
- **Performance Optimized**: Canvas-based rendering maintaining 60 FPS on modern hardware

## Algorithm

The fractal uses a recursive branching algorithm:

1. Start with a vertical trunk at canvas bottom-center
2. For each branch:
   - Calculate endpoint using length and angle
   - Apply color gradient (brown trunk → green leaves based on depth)
   - Recursively generate two child branches at ±25° (with random variation)
   - Reduce length by 67% and thickness exponentially per depth level
3. Stop recursion at depth 11 or when branch length < 1px

Randomization is seeded (default: 12345) to ensure the same tree structure regenerates on refresh, critical for debugging visual anomalies.

## Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── FractalTree.jsx      # Canvas rendering and animation logic
├── utils/
│   ├── fractalAlgorithm.js  # Pure function for tree generation
│   └── seededRandom.js      # LCG pseudo-random number generator
├── App.jsx                  # Root component with viewport sizing
└── index.jsx                # React 18 bootstrap
```

## Configuration

Edit constants in `src/utils/fractalAlgorithm.js`:

- `MAX_DEPTH`: Recursion depth (default: 12)
- `BASE_ANGLE`: Branch angle in degrees (default: 25)
- `LENGTH_DECAY`: Length reduction per level (default: 0.67)

Edit animation timing in `src/components/FractalTree.jsx`:

- `GROWTH_DURATION`: Growth phase length in ms (default: 5000)
- `SWAY_AMPLITUDE`: Maximum sway angle in radians (default: 0.08)
- `SWAY_FREQUENCY`: Sway oscillation speed in Hz (default: 0.5)

## License

MIT