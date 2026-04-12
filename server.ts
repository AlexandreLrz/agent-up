// import dotenv from "dotenv";
// dotenv.config({ path: ".env" });

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { createVoiceProxy } from "./voiceProxy";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res, parse(req.url!, true));
  });

  const voiceProxy = createVoiceProxy();

  server.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url!);
    if (pathname === "/api/voice-proxy") {
      voiceProxy.handleUpgrade(req, socket, head, (ws) => {
        voiceProxy.emit("connection", ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, () => {
    console.log(`🚀 Server running`);
  });
});