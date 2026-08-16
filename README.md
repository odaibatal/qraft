# Qraft Studio

Premium branded QR-code studio built for designers and small businesses.
Generate beautiful, on-brand QR codes for URLs, Wi-Fi networks, vCards, and plain text — with a live preview that regenerates instantly as you customize every detail.

## Features

- **Live Studio** — instant preview that updates on every change
- **Four QR types** — URL, Wi-Fi, vCard, and plain text
- **Full styling control** — foreground/background colors, error correction levels, and logo overlay
- **Export** — high-quality PNG and scalable SVG
- **Preset templates** — quick-start designs for cafés, portfolios, events, and social profiles
- **Bulk Generator** — create multiple QR codes at once
- **Brand Kit** — save and apply brand presets
- **Motion-first UI** — choreographed entrances, spring feedback, and a signature pixel-assembly animation
- **Accessible** — keyboard navigation, focus rings, semantic HTML, and full `prefers-reduced-motion` support
- **RTL support** — full Arabic translation and right-to-left layout

## Tech Stack

| Layer          | Technology                                             |
|----------------|--------------------------------------------------------|
| Framework      | React 19 · Vite · TypeScript (strict)                  |
| Styling        | Tailwind CSS v4                                        |
| Motion         | Motion (motion/react) · GSAP · ScrollTrigger          |
| Scroll         | Lenis                                                  |
| QR generation  | qrcode.react (real, live regeneration)                 |
| Icons          | lucide-react                                           |
| Testing        | Vitest · Testing Library                               |

## Getting Started

```bash
# install
npm install

# run dev server
npm run dev

# production build
npm run build

# run tests
npm test

# type check
npm run typecheck
```

## Scripts

| Script        | Description                          |
|---------------|--------------------------------------|
| `npm run dev` | Start dev server on port 5173        |
| `npm run build` | Production build                    |
| `npm run preview` | Preview production build         |
| `npm test`    | Run test suite                       |
| `npm run test:watch` | Run tests in watch mode      |
| `npm run typecheck` | TypeScript type checking       |
| `npm run format` | Format code with oxfmt           |

## License

MIT
