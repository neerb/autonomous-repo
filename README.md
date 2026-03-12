# Nathan Test Repo

This is a basic web application framework built with React, React Router, and Vite.

## Getting Started

### Prerequisites

- Node.js 18.x or higher (LTS recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nathan-test-repo
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

The development server includes Hot Module Replacement (HMR), so changes to your code will be reflected instantly in the browser.

### Building for Production

Create an optimized production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
nathan-test-repo/
├── src/
│   ├── main.jsx              # Application entry point
│   ├── App.jsx               # Root component with routing
│   ├── components/           # Reusable UI components
│   │   └── Navigation.jsx    # Navigation bar
│   ├── pages/                # Route components
│   │   ├── Home.jsx          # Home page
│   │   └── Settings.jsx      # Settings page
│   └── styles/               # CSS files
│       ├── App.css           # Global styles
│       └── Navigation.css    # Navigation styles
├── public/                   # Static assets
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
└── package.json              # Project dependencies and scripts
```

## Available Routes

- `/` - Home page
- `/settings` - Settings page

## Technology Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool and development server
