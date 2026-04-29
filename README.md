# DES Cryptography Simulation

An interactive, step-by-step DES (Data Encryption Standard) simulation built for academic presentations. Visualize every step of the DES algorithm from initial permutation through 16 Feistel rounds to final permutation.

## Features

- **Full DES Implementation** - Pure TypeScript DES engine (no external crypto libraries)
- **Step-by-Step Visualization** - 101 navigable steps through the entire DES process
- **Interactive Controls** - Play/pause auto-play, speed control, keyboard shortcuts
- **Educational Sidebar** - Learn about each step as you navigate
- **S-Box Visualization** - See active S-Box rows/columns per round
- **Key Schedule Timeline** - Visualize all 16 rounds of subkey generation
- **Dark Mode Glassmorphism UI** - Beautiful dark theme with cyan accents
- **NIST Test Vector Verified** - Passes standard DES test vectors

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Framer Motion (WAAPI-optimized animations)
- React Router v6

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Presentation Setup

Edit `src/config/presentation.ts` to add your course, professor, team members, and presentation date.

## Keyboard Shortcuts

- `←` / `→` - Previous / Next step
- `Space` - Play / Pause auto-play
- `R` - Reset to step 0
- `E` / `D` - Switch Encrypt / Decrypt mode
- `?` - Open educational sidebar

## Validation

The implementation passes the NIST test vector:
- Plaintext: `0123456789ABCDEF`
- Key: `133457799BBCDFF1`
- Ciphertext: `85E813540F0AB405`

## License

MIT
