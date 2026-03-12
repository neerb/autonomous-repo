# React Calculator Web App

A basic calculator web application built with React that performs addition, subtraction, multiplication, and division.

## Features

- Basic arithmetic operations (+, −, ×, ÷)
- Decimal number support
- Operation chaining (consecutive calculations)
- Keyboard input support
- Error handling for division by zero
- Clean, intuitive interface

## Prerequisites

- Node.js 18.x or higher
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/neerb/autonomous-repo.git
cd autonomous-repo
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Usage

### Mouse Input
- Click number buttons (0-9) to input numbers
- Click operation buttons (+, −, ×, ÷) to perform calculations
- Click = to complete calculation
- Click C to clear and reset

### Keyboard Input
- Number keys (0-9) for digit input
- Operators (+, -, *, /) for operations
- Enter or = for equals
- Escape or C for clear
- Period (.) for decimal point

## Project Structure

```
autonomous-repo/
├── src/
│   ├── components/
│   │   ├── Calculator.jsx    # Main calculator container
│   │   ├── Calculator.css
│   │   ├── Display.jsx        # Numeric display component
│   │   ├── Display.css
│   │   ├── Button.jsx         # Reusable button component
│   │   └── Button.css
│   ├── utils/
│   │   └── calculator.js      # Calculation logic and formatting
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Technical Details

- **Framework:** React 18.x
- **Build Tool:** Vite 5.x
- **Styling:** Plain CSS with component-specific stylesheets
- **State Management:** React useState hooks
- **Precision:** 10 significant digits for calculations

## Known Limitations

- Displays up to 12 characters (switches to scientific notation for larger numbers)
- Standard JavaScript floating-point precision limits apply
- Desktop-first design (not optimized for mobile)