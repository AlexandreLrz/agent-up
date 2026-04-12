"use client";

import { useState, useRef, useCallback } from "react";
import { Case, Message } from "@/lib/types";

export type CallStatus = "idle" | "connecting" | "live" | "ended";

export function useDeepgramCall(
  case_: Case,
  onMessage: (msg: Message) => void,
  onEnd: () => void,
  maxTurns: number
) {
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const turnCountRef = useRef(0);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);

  function stopAllAudio() {
    activeSourcesRef.current.forEach((s) => { try { s.stop(); } catch { } });
    activeSourcesRef.current = [];
    nextPlayTimeRef.current = 0;
  }

  function scheduleChunk(chunk: ArrayBuffer, audioCtx: AudioContext) {
    const pcm = new Int16Array(chunk);
    const float32 = new Float32Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) float32[i] = pcm[i] / 32768;

    const buffer = audioCtx.createBuffer(1, float32.length, 16000);
    buffer.copyToChannel(float32, 0);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);

    const startTime = Math.max(audioCtx.currentTime, nextPlayTimeRef.current);
    source.start(startTime);
    nextPlayTimeRef.current = startTime + buffer.duration;

    activeSourcesRef.current.push(source);
    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
    };
  }

  const endCall = useCallback(() => {
    stopAllAudio();
    processorRef.current?.disconnect();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    wsRef.current?.close();
    audioCtxRef.current?.close();
    setStatus("ended");
    onEnd();
  }, [onEnd]);

  const startCall = useCallback(async () => {
    setStatus("connecting");
    nextPlayTimeRef.current = 0;
    turnCountRef.current = 0;
    activeSourcesRef.current = [];

    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${window.location.host}/api/voice-proxy`);
    wsRef.current = ws;
    ws.binaryType = "arraybuffer";

    const audioCtx = new AudioContext({ sampleRate: 16000 });
    audioCtxRef.current = audioCtx;

    ws.onopen = async () => {
      ws.send(JSON.stringify({
        type: "ClientContext",
        scenario: case_.scenario,
        difficulty: case_.difficulty,
        openingMessage: case_.openingMessage,
      }));

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (isMuted || ws.readyState !== WebSocket.OPEN) return;
          const input = e.inputBuffer.getChannelData(0);
          const pcm = new Int16Array(input.length);
          for (let i = 0; i < input.length; i++) {
            pcm[i] = Math.max(-32768, Math.min(32767, input[i] * 32768));
          }
          ws.send(pcm.buffer);
        };

        source.connect(processor);
        processor.connect(audioCtx.destination);
        setStatus("live");
      } catch (err) {
        console.error("Mic error:", err);
        setStatus("ended");
      }
    };

    ws.onmessage = (e) => {
      if (e.data instanceof ArrayBuffer) {
        if (audioCtxRef.current) scheduleChunk(e.data, audioCtxRef.current);
        return;
      }
      try {
        const event = JSON.parse(e.data);
        if (event.type === "ConversationText") {
          const role = event.role === "user" ? "agent" : "customer";
          onMessage({ role, content: event.content, timestamp: new Date().toISOString() });
          if (role === "agent") {
            turnCountRef.current += 1;
            if (turnCountRef.current >= maxTurns) setTimeout(endCall, 1500);
          }
        }
        if (event.type === "UserStartedSpeaking") stopAllAudio();
      } catch { }
    };

    ws.onerror = (e) => console.error("DG WS error", e);
    ws.onclose = () => setStatus((s) => (s === "live" ? "ended" : s));
  }, [case_, endCall, isMuted, onMessage, maxTurns]);

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  return { status, isMuted, startCall, endCall, toggleMute };
}