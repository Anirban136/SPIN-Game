<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/514bfb63-9557-4507-a7e8-16966ce11713

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Long‑Distance Mode & Deployment

The long-distance functionality relies on a backend Socket.IO server that must be reachable by both players. This repository already includes a small Express server (`server.ts`) that handles room codes and broadcasts spins.

### Deploying the server

You can deploy the server to any host that supports Node.js and accepts WebSocket connections. Free tiers that work well include Railway, Render, Fly.io, or even Replit/Glitch. The basic process is:

1. Push this repository to GitHub (already done).
2. Create a new project/service on the chosen platform and link it to the GitHub repo.
3. Ensure the `start` script (`tsx server.ts`) is used by the host so it runs the server.
4. Define an environment variable `VITE_SERVER_URL` with the public URL of the deployed service (e.g. `https://spinplay-server.fly.dev`).
5. Rebuild the frontend if necessary and point clients at that URL.

The frontend code reads this variable (`import.meta.env.VITE_SERVER_URL`) and passes it to `io()` when creating the socket, so you don’t have to hard‑code anything.

### Local testing

For local development you can keep `VITE_SERVER_URL` blank, in which case the socket connects to the same origin (`http://localhost:3000` when running `npm run dev`).

Enjoy spinning with your partner from anywhere!
