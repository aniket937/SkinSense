"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import type { UseVoiceInputResult } from "@/lib/voice";

type VoicePanelProps = {
  open: boolean;
  onClose: () => void;
  voice: UseVoiceInputResult;
  transcript: string;
  speaking: boolean;
  onStopSpeaking: () => void;
};

export function VoicePanel({
  open,
  onClose,
  voice,
  transcript,
  speaking,
  onStopSpeaking,
}: VoicePanelProps) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (open && voice.supported && voice.state === "ready" && !startedRef.current) {
      startedRef.current = true;
      voice.start();
    }
    if (!open) {
      startedRef.current = false;
    }
  }, [open, voice]);

  if (!open) return null;

  const listening = voice.state === "listening";
  const processing = voice.state === "processing";
  const failed = voice.state === "error";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" role="dialog" aria-modal="true" aria-label="Ask by voice">
      <div className="brutal brutal-shadow-lg w-full max-w-md bg-surface p-6 text-center">
        {speaking ? (
          <>
            <span
              aria-hidden="true"
              className="display mx-auto flex h-20 w-20 items-center justify-center border-2 border-line bg-blush text-2xl"
            >
              ♪
            </span>
            <h2 className="display mt-5 text-2xl">Speaking</h2>
            <p className="mt-2 text-base text-ink-soft">
              Reading the answer out loud with your device&apos;s voice.
            </p>
            <div className="mt-6">
              <Button variant="secondary" onClick={onStopSpeaking}>
                Stop
              </Button>
            </div>
          </>
        ) : failed ? (
          <>
            <h2 className="display text-2xl">Voice didn&apos;t catch that</h2>
            <p className="mt-2 text-base text-ink-soft">
              You can type the question instead.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  voice.reset();
                  voice.start();
                }}
              >
                Try again
              </Button>
              <Button variant="quiet" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <span
              aria-hidden="true"
              className="display mx-auto flex h-20 w-20 items-center justify-center border-2 border-line bg-paper text-3xl"
            >
              ◉
            </span>
            <h2 className="display mt-5 text-2xl">
              {listening ? "Listening…" : processing ? "Thinking…" : "Ask SkinSense"}
            </h2>
            <p className="mt-2 text-base text-ink-soft">
              {listening ? "Ask naturally, like “Will this serum work with my routine?”" : processing ? "SkinSense is working on your answer." : ""}
            </p>

            {(listening || processing) && (
              <div className="mt-6 flex items-center justify-center gap-1" aria-hidden="true">
                <span
                  className={`h-3 w-3 animate-bounce border-2 border-line bg-clay-deep ${processing ? "[animation-delay:0ms]" : ""}`}
                />
                <span className="h-3 w-3 animate-bounce border-2 border-line bg-clay-deep [animation-delay:150ms]" />
                <span className="h-3 w-3 animate-bounce border-2 border-line bg-clay-deep [animation-delay:300ms]" />
              </div>
            )}

            {transcript && (
              <p className="mt-6 rounded border-2 border-line bg-paper p-3 text-base">
                “{transcript}”
              </p>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {listening ? (
                <Button variant="primary" onClick={voice.stop}>
                  Stop
                </Button>
              ) : processing ? (
                <Button variant="secondary" disabled>
                  Waiting…
                </Button>
              ) : null}
              {!listening && !processing && (
                <>
                  <Button variant="primary" onClick={voice.start}>
                    Start
                  </Button>
                  <Button variant="quiet" onClick={onClose}>
                    Close
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}