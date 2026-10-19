"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { MicIcon } from "@/components/shell/icons";
import { VoicePanel } from "@/components/domain/VoicePanel";
import { uid } from "@/lib/format";
import { useVoiceInput } from "@/lib/voice";
import { STORAGE_KEYS, loadJSON } from "@/lib/storage";
import { askSkinSense } from "@/services/ask";
import type { AskMessage } from "@/types/ask";

const suggestions = [
  "What does niacinamide do?",
  "Why is this step in my routine?",
  "Can I add this product?",
  "Why do these two products feel different?",
];

export default function AskPageWrapper() {
  return (
    <Suspense fallback={null}>
      <AskPage />
    </Suspense>
  );
}

function AskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AskMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(searchParams.get("voice") === "1");
  const [speaking, setSpeaking] = useState(false);
  const [context, setContext] = useState<{
    topic?: string;
    product?: string;
  }>(() => {
    const topic = searchParams.get("topic");
    const product = searchParams.get("product");
    return product ? { product } : topic ? { topic } : {};
  });

  const prefs = useRef(
    loadJSON<{ voiceOutput?: boolean; sttLanguage?: string }>(STORAGE_KEYS.prefs, {})
  );
  const voice = useVoiceInput(prefs.current.sttLanguage ?? "en-IN");

  const listRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (voiceOpen && !voice.supported) {
      setVoiceOpen(false);
    }
  }, [voiceOpen, voice.supported]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, pending]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function appendMessage(message: AskMessage) {
    setMessages((current) => [...current, message]);
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }

  function speak(text: string) {
    if (!prefs.current.voiceOutput) return;
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  async function submit(text: string) {
    const question = text.trim();
    if (!question || pending) return;
    setDraft("");
    appendMessage({ id: uid(), role: "user", text: question });
    setPending(true);
    try {
      const answer = await askSkinSense(question, context);
      appendMessage({
        id: uid(),
        role: "skinsense",
        text: answer.text,
        source: answer.source,
        topic: answer.topic ?? context.topic,
      });
      speak(answer.text);
    } catch {
      appendMessage({
        id: uid(),
        role: "skinsense",
        text: "SkinSense couldn't finish answering that right now. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    if (voice.state === "processing" && voice.transcript) {
      submit(voice.transcript);
      setVoiceOpen(false);
      voice.reset();
    }
  }, [voice.state, voice.transcript]);

  function openVoice() {
    setSpeaking(false);
    setVoiceOpen(true);
  }

  function clearContext() {
    setContext({});
    router.replace("/ask", { scroll: false });
  }

  const hasContext = context.topic !== undefined || context.product !== undefined;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      <section aria-labelledby="ask-heading">
        <p className="eyebrow">Ask SkinSense</p>
        <h1 id="ask-heading" className="display mt-2 text-3xl sm:text-4xl">
          Ask SkinSense
        </h1>
        <p className="mt-2 max-w-xl text-lg text-ink-soft">
          Ask about your routine, a product, or an ingredient.
        </p>
      </section>

      {hasContext && (
        <div className="mt-5">
          <Badge tone="amber">
            Discussing: {context.product ?? context.topic}
            <button
              type="button"
              aria-label="Clear discussion context"
              className="ml-2 inline-flex h-9 w-9 items-center justify-center border-2 border-line bg-surface text-sm font-bold"
              onClick={clearContext}
            >
              ×
            </button>
          </Badge>
        </div>
      )}

      {!voice.supported && (
        <div className="mt-5">
          <StatusBanner
            tone="uncertain"
            title="Voice isn't available right now. You can ask SkinSense using text instead."
          />
        </div>
      )}

      <div
        ref={listRef}
        aria-live="polite"
        className="mt-8 h-[28rem] space-y-4 overflow-y-auto border-2 border-line bg-paper p-4"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-start justify-center gap-4">
            <p className="text-base text-ink-soft">
              Here are a few questions people ask. Tap one, or type your own.
            </p>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => submit(suggestion)}
                className="brutal brutal-shadow-sm bg-surface px-4 py-3 text-left text-base font-semibold hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                “{suggestion}”
              </button>
            ))}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "ml-auto max-w-[85%] border-2 border-line bg-ink px-4 py-3 text-surface"
                : "max-w-[85%] bg-surface"
            }
          >
            {message.role === "skinsense" ? (
              <div className="brutal brutal-shadow-sm border-line bg-surface p-4">
                {message.source === "backend" && (
                  <Badge tone="sage">From SkinSense knowledge</Badge>
                )}
                <div className="mt-2 whitespace-pre-wrap text-base">
                  {message.text}
                </div>
                {message.source === "demo" && (
                  <div className="mt-3">
                    <StatusBanner tone="demo" />
                  </div>
                )}
                {speaking && message === messages[messages.length - 1] && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-sm text-ink-soft">Speaking…</span>
                    <Button variant="quiet" size="sm" onClick={stopSpeaking}>
                      Stop
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-base">{message.text}</p>
            )}
          </div>
        ))}

        {pending && (
          <div className="max-w-[85%]">
            <div className="brutal brutal-shadow-sm bg-surface p-4">
              <span role="status" className="text-base text-ink-soft">
                SkinSense is thinking…
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end gap-2 border-2 border-line bg-surface p-2">
        <textarea
          ref={draftRef}
          aria-label="Your question"
          rows={2}
          className="min-h-12 flex-1 resize-y border-0 bg-transparent px-3 py-2 text-base focus:outline-none"
          placeholder="Ask SkinSense anything…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit(draft);
            }
          }}
        />
        {voice.supported && (
          <button
            type="button"
            aria-label="Ask by voice"
            className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-line bg-surface"
            onClick={openVoice}
          >
            <MicIcon />
          </button>
        )}
        <Button variant="primary" onClick={() => submit(draft)} disabled={pending || !draft.trim()}>
          Send
        </Button>
      </div>

      <p className="mt-3 text-xs text-ink-soft">
        Conversation lives in this tab and clears when you close it. SkinSense
        answers are educational decision support, not medical advice.
      </p>

      <VoicePanel
        open={voiceOpen}
        onClose={() => {
          setVoiceOpen(false);
          voice.reset();
        }}
        voice={voice}
        transcript={voice.transcript}
        speaking={speaking}
        onStopSpeaking={stopSpeaking}
      />
    </div>
  );
}