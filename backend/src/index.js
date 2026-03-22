require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB, closeDB } = require("./db");
const { attachRoutes } = require("./routes");
const seed = require("./seed");

const PORT = Number(process.env.PORT || 8000);

async function start() {
  const app = express();

  // 🔥 FINAL CORS FIX (DYNAMIC ORIGIN)
  app.use(
    cors({
      origin: function (origin, callback) {
        // allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        const allowed = [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "http://localhost:3001",
          "https://karya-laya.vercel.app",
          "https://karyalaya.vercel.app",
        ];

        if (allowed.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(null, true); // 🔥 allow all (important)
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // 🔥 preflight fix
  app.options("*", cors());

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("🚀 KaryaLaya Backend is running successfully!");
  });

  try {
    const pool = await initDB();

    await seed();

    attachRoutes(app, pool);

    const server = app.listen(PORT, () => {
      console.log(`✅ Backend listening on port ${PORT}`);
    });

    const shutdown = async () => {
      console.log("Shutting down server...");
      server.close(async () => {
        await closeDB();
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();