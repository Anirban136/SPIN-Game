import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial configuration (moved from constants to server as source of truth)
let gameConfig = [
  {
    id: 'FLIRTY',
    name: 'Flirty',
    icon: '💕',
    description: 'Beginner – Romantic',
    color: 'from-pink-400 to-rose-500',
    requiresConsent: false,
    isPremium: false,
    tasks: [
      { id: 'f1', text: 'Hold eye contact (30 seconds)' },
      { id: 'f2', text: 'Slow dance together' },
      { id: 'f3', text: 'Give 3 compliments' },
      { id: 'f4', text: 'Kiss on the cheek' },
      { id: 'f5', text: 'Whisper something romantic' },
      { id: 'f6', text: 'Forehead touch moment' },
      { id: 'f7', text: 'Hold hands for 1 minute' },
      { id: 'f8', text: 'One tight hug' },
      { id: 'f9', text: 'Remove one accessory' },
      { id: 'f10', text: 'Sit close silently' },
      { id: 'f11', text: 'Light back massage' },
      { id: 'f12', text: 'Play with hair gently' },
      { id: 'f13', text: 'Smile challenge' },
      { id: 'f14', text: 'Spin again + hug' },
      { id: 'f15', text: 'Ask a cute relationship question' },
      { id: 'f16', text: 'Free romantic choice' },
    ],
  },
  {
    id: 'HOT',
    name: 'Hot',
    icon: '🔥',
    description: 'Intermediate – Passionate',
    color: 'from-orange-500 to-red-600',
    requiresConsent: false,
    isPremium: false,
    tasks: [
      { id: 'h1', text: 'Open one shirt button' },
      { id: 'h2', text: 'Kiss on the neck' },
      { id: 'h3', text: 'Sit on partner’s lap' },
      { id: 'h4', text: 'Slow hug from behind' },
      { id: 'h5', text: 'Whisper a fantasy (non-graphic)' },
      { id: 'h6', text: 'Remove one layer (jacket/shirt)' },
      { id: 'h7', text: 'Gentle hand tracing' },
      { id: 'h8', text: '60-second kiss' },
      { id: 'h9', text: 'Carry partner briefly' },
      { id: 'h10', text: 'Blindfold tease (face only)' },
      { id: 'h11', text: 'Spin again + kiss' },
      { id: 'h12', text: 'Slow close dance' },
      { id: 'h13', text: 'Teasing compliment' },
      { id: 'h14', text: '1-minute close hug' },
      { id: 'h15', text: 'Partner chooses next move' },
      { id: 'h16', text: 'Double spin challenge' },
    ],
  },
  {
    id: 'NAUGHTY',
    name: 'Naughty',
    icon: '😈',
    description: 'Advanced – Bold',
    color: 'from-purple-600 to-indigo-900',
    requiresConsent: true,
    isPremium: true,
    tasks: [
      { id: 'n1', text: 'Remove one clothing item (consensual)' },
      { id: 'n2', text: 'Blindfold for 1 minute' },
      { id: 'n3', text: 'Tease without kissing' },
      { id: 'n4', text: 'Kiss trail (face & neck only)' },
      { id: 'n5', text: 'Lap sit facing each other' },
      { id: 'n6', text: 'Whisper bold desire' },
      { id: 'n7', text: 'Spin + partner chooses pose' },
      { id: 'n8', text: 'Light playful bite' },
      { id: 'n9', text: 'Hand tracing challenge' },
      { id: 'n10', text: 'Remove two accessories' },
      { id: 'n11', text: '90-second close hug' },
      { id: 'n12', text: 'Freeze pose challenge' },
      { id: 'n13', text: 'Hand and leg bondage' },
      { id: 'n14', text: 'Spin again + remove one layer' },
      { id: 'n15', text: 'Free bold move (mutual consent)' },
      { id: 'n16', text: 'Winner decides next action' },
    ],
  },
  {
    id: 'HEAVENLY',
    name: 'Heavenly',
    icon: '👼',
    description: 'Expert – Position Wheel',
    color: 'from-amber-400 to-yellow-600',
    requiresConsent: true,
    isPremium: true,
    tasks: [
      { id: 'hv1', text: 'Missionary Position', visual: '👩‍❤️‍👨', image: 'https://images.unsplash.com/photo-1518131359073-ad293c3f90c9?q=80&w=1000&auto=format&fit=crop' },
      { id: 'hv2', text: 'Doggy Style', visual: '🐾' },
      { id: 'hv3', text: 'Cowgirl Position', visual: '🤠' },
      { id: 'hv4', text: 'Reverse Cowgirl', visual: '🔄' },
      { id: 'hv5', text: 'Tabletop', visual: '🪑' },
      { id: 'hv6', text: 'Side by Side', visual: '👫' },
      { id: 'hv7', text: 'Spooning', visual: '🥄' },
      { id: 'hv8', text: 'Upstanding Citizen', visual: '🕴️' },
      { id: 'hv9', text: 'Wheelbarrow', visual: '🛒' },
      { id: 'hv10', text: 'Pretzel', visual: '🥨' },
      { id: 'hv11', text: 'Pile Driver', visual: '🔨' },
      { id: 'hv12', text: 'The Snake', visual: '🐍', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop' },
      { id: 'hv13', text: 'Coital Alignment Technique', visual: '🐈' },
      { id: 'hv14', text: '69', visual: '♋' },
      { id: 'hv15', text: 'Mutual Masturbation', visual: '✨' },
      { id: 'hv16', text: 'Eiffel Tower', visual: '🗼' },
    ],
  },
];

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  // In-memory room storage
  const rooms = new Map<string, { players: string[]; state: any }>();

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Send current config on connect
    socket.emit("config-update", gameConfig);

    socket.on("create-room", () => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      rooms.set(code, { players: [socket.id], state: {} });
      socket.join(code);
      socket.emit("room-created", code);
      console.log(`Room created: ${code} by ${socket.id}`);
    });

    socket.on("join-room", (code: string) => {
      const room = rooms.get(code);
      if (room) {
        if (room.players.length < 2) {
          room.players.push(socket.id);
          socket.join(code);
          io.to(code).emit("player-joined", {
            count: room.players.length,
            code,
          });
          console.log(`User ${socket.id} joined room: ${code}`);
        } else {
          socket.emit("error", "Room is full");
        }
      } else {
        socket.emit("error", "Room not found");
      }
    });

    socket.on("spin-wheel", ({ code, rotation, task }: { code: string; rotation: number; task: any }) => {
      socket.to(code).emit("wheel-spun", { rotation, task });
    });

    socket.on("change-mode", ({ code, modeId }: { code: string; modeId: string }) => {
      socket.to(code).emit("mode-changed", modeId);
    });

    socket.on("update-config", (newConfig: any) => {
      gameConfig = newConfig;
      io.emit("config-update", gameConfig);
      console.log("Game configuration updated by admin");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Clean up rooms if needed
      for (const [code, room] of rooms.entries()) {
        if (room.players.includes(socket.id)) {
          room.players = room.players.filter((id) => id !== socket.id);
          if (room.players.length === 0) {
            rooms.delete(code);
            console.log(`Room ${code} deleted`);
          } else {
            io.to(code).emit("player-left");
          }
        }
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
