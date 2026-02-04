import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import expressApp from "./app.js";
import registerBidsocket from "./socket/bid.scocket.js";

// Load env only locally
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const server = http.createServer(expressApp);

const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

registerBidsocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
