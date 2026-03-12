# autonomous-repo
Testing purposes

## Getting Started

This is a React web application built with Vite and React Router.

### Prerequisites

- Node.js 18.x or higher (see `.nvmrc` file)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Build

Create a production build:

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
src/
  main.jsx              - Application entry point
  App.jsx               - Root component with routing configuration
  components/           - Reusable UI components
    Navigation.jsx      - Navigation component
  pages/                - Page components for routes
    Home.jsx            - Home page
    Settings.jsx        - Settings page
  styles/               - CSS files
    App.css             - Global styles
    Navigation.css      - Navigation styles
```

## Available Routes

- `/` - Home page
- `/settings` - Settings page
