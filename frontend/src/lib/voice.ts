"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceState =
  | "ready"
  | "listening"
  | "processing"
  | "error"
  | "cancelled";

type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
};

export type UseVoiceInputResult = {
  state: VoiceState;
  transcript: string;
  supported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
};

function getRecognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const ctor = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as
    | (new () => RecognitionLike)
    | undefined;
  return ctor ?? null;
}

export function useVoiceInput(lang = "en-IN"): UseVoiceInputResult {
  const [state, setState] = useState<VoiceState>("ready");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const stopRequestedRef = useRef(false);
  const supported = getRecognitionCtor() !== null;

  const cleanup = useCallback(() => {
    recognitionRef.current = null;
    stopRequestedRef.current = false;
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setState("error");
      return;
    }
    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.continuous = false;
    stopRequestedRef.current = false;
    setTranscript("");
    setState("listening");

    recognition.onresult = (event: unknown) => {
      const e = event as { results: ArrayLike<ArrayLike<{ transcript: string }>> };
      const text = e.results?.[0]?.[0]?.transcript ?? "";
      setTranscript(text);
      setState("processing");
    };

    recognition.onerror = () => {
      if (stopRequestedRef.current) {
        setState("cancelled");
      } else {
        setState("error");
      }
      cleanup();
    };

    recognition.onend = () => {
      if (stopRequestedRef.current) {
        setState("cancelled");
      } else if (recognitionRef.current === recognition) {
        setState((current) => (current === "listening" ? "cancelled" : current));
      }
      cleanup();
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setState("error");
      cleanup();
    }
  }, [lang, cleanup]);

  const stop = useCallback(() => {
    stopRequestedRef.current = true;
    recognitionRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    recognitionRef.current?.abort?.();
    cleanup();
    setTranscript("");
    setState("ready");
  }, [cleanup]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort?.();
      cleanup();
    };
  }, [cleanup]);

  return { state, transcript, supported, start, stop, reset };
}
