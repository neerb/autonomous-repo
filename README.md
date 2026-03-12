# Nathan Test Repo

A React web application foundation built with Vite, React 18, and React Router.

## Prerequisites

- Node.js 18.x or 20.x LTS
- npm 9.x or later

Check your versions:
```bash
node --version
npm --version
```

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/neerb/autonomous-repo.git
cd autonomous-repo
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173` with hot module replacement enabled.

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally

## Project Structure

```
/
├── src/
│   ├── components/     # Reusable UI components
│   │   └── Navigation.jsx
│   ├── pages/          # Route-level components
│   │   ├── Home.jsx
│   │   └── Settings.jsx
│   ├── App.jsx         # Root component with routing
│   ├── App.css         # Application styles
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Architecture

- **Build Tool:** Vite (fast, minimal configuration, ESM-based)
- **UI Framework:** React 18 (functional components with hooks)
- **Routing:** React Router v6 (client-side navigation)
- **Styling:** Vanilla CSS (responsive, mobile-first)
- **Package Manager:** npm (use npm, not yarn, to avoid lock file conflicts)

## Routes

- `/` — Home page
- `/settings` — Settings page
- `/*` — 404 page for unmatched routes

## Contributing

Future orbits will add testing, linting, and additional features to this foundation.