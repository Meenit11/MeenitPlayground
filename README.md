# Meenit's Playground 🎮

A joyful, mobile-first web game suite with three social deduction games. Each game has its own distinct visual theme and personality.

## Games

1. **Odd One In** - Room-based multiplayer. Be weird or be gone! (3-20 players)
2. **Undercover** - One word can save you, one word can end you! (4-10 players)
3. **Mafia** - Trust no one. Not even yourself. (5-15 players + Game Master)

## Tech Stack

- **Frontend:** Vite + React + React Router + Framer Motion
- **Backend:** Express (for Odd One In room sync)
- **State:** LocalStorage (Undercover, Mafia), API polling (Odd One In)

## Project Structure

```
├── src/
│   ├── components/       # Shared components
│   ├── games/
│   │   ├── odd-one-in/   # Room-based multiplayer
│   │   ├── undercover/   # Single-phone passing
│   │   └── mafia/        # Single-phone with Game Master
│   ├── pages/
│   └── styles/
├── server/               # Express API for Odd One In
├── public/
│   ├── images/          # Game assets (copied from /images)
│   └── data/            # words.json, questions.json
└── images/              # Source images
```

## Setup

```bash
npm install
npm run copy-assets   # Copies images & data to public/
```

## Development

```bash
npm run dev           # Runs both client (port 5173) and server (port 3001)
# Or separately:
npm run dev:client
npm run dev:server
```

## Build & Deploy (Render)

```bash
npm run build         # Builds Vite + copies assets
npm start             # Starts server (serves built client in production)
```

Set `NODE_ENV=production` on Render. The server serves the static build and API.

## Requirements Met

- ✅ Mobile-first (320px - 428px)
- ✅ Touch-optimized (no hover states)
- ✅ Three distinct visual themes
- ✅ LocalStorage + API for state
- ✅ Render deployment ready
- ✅ Smooth animations (Framer Motion)
