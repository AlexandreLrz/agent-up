import { WebSocket, WebSocketServer } from "ws";
import { buildDeepgramSettings } from "./buildDeepgramSettings";
// import dotenv from "dotenv";
// dotenv.config({ path: ".env" });


const DEEPGRAM_URL = "wss://agent.deepgram.com/v1/agent/converse";

export function createVoiceProxy(): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (clientWs: WebSocket) => {
    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY!;
    const dgWs = new WebSocket(DEEPGRAM_URL, {
      headers: { Authorization: `Token ${DEEPGRAM_API_KEY}` },
    });
    dgWs.binaryType = "arraybuffer";

    let dgReady = false;
    let pendingContext: { scenario: string; difficulty: string; openingMessage: string } | null = null;

    dgWs.on("open", () => {
      dgReady = true;
      if (pendingContext) {
        dgWs.send(JSON.stringify(buildDeepgramSettings(
          pendingContext.scenario,
          pendingContext.difficulty,
          pendingContext.openingMessage,
        )));
        pendingContext = null;
      }
    });

    clientWs.on("message", (data, isBinary) => {
      if (isBinary) {
        if (dgWs.readyState === WebSocket.OPEN) dgWs.send(data, { binary: true });
        return;
      }
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "ClientContext") {
          const { scenario, difficulty, openingMessage } = msg;
          if (dgReady) {
            dgWs.send(JSON.stringify(buildDeepgramSettings(scenario, difficulty, openingMessage)));
          } else {
            pendingContext = { scenario, difficulty, openingMessage };
          }
        }
      } catch {
        console.log("⚠️ Ignored message non-JSON");
      }
    });

    dgWs.on("message", (data, isBinary) => {
      if (clientWs.readyState === WebSocket.OPEN) clientWs.send(data, { binary: isBinary });
    });

    dgWs.on("error", (err) => console.error("❌ Deepgram error:", err));
    dgWs.on("close", (code, reason) => {
      if (clientWs.readyState === WebSocket.OPEN) clientWs.close();
    });

    clientWs.on("error", (err) => console.error("❌ Client error:", err));
    clientWs.on("close", () => {
      if (dgWs.readyState === WebSocket.OPEN) dgWs.close();
    });
  });

  return wss;
}