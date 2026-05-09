"use client";

import { useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "../data/sketches";
import { sketches } from "../data/sketches";
import { arcsForCategory } from "../data/stories";
import type { CardFormat, Payload } from "../lib/payload";
import { FormatStep } from "./steps/FormatStep";
import { OccasionStep } from "./steps/OccasionStep";
import { CardCountStep } from "./steps/CardCountStep";
import { SketchPickStep } from "./steps/SketchPickStep";
import { WriterChoiceStep } from "./steps/WriterChoiceStep";
import { EditorStep } from "./steps/EditorStep";
import { NamesStep } from "./steps/NamesStep";
import { AudioStep } from "./steps/AudioStep";
import { AddressStep } from "./steps/AddressStep";
import { KeyStep } from "./steps/KeyStep";
import { RevealStep } from "./steps/RevealStep";

export type StepName =
  | "format"
  | "occasion"
  | "count"
  | "sketch"
  | "writer-choice"
  | "editor"
  | "names"
  | "audio"
  | "address"
  | "key"
  | "reveal";

export type Address = {
  street: string;
  city: string;
  region: string;
  zip: string;
  country: string;
};

export type StorySource = "self" | "magic_writer";

export type Chapter = { title: string; body: string };

export type ComposeState = {
  step: StepName;
  format: CardFormat | null;
  category: Category | null;
  count: number;
  cardIds: string[];
  senderName: string;
  recipientName: string;
  address: Address;
  arcId: string | null;
  key: string | null;
  seed: number | null;
  storySource: StorySource | null;
  chapters: Chapter[];
  audioClipId: string | null;
};

type Action =
  | { type: "next" }
  | { type: "back" }
  | { type: "set"; patch: Partial<ComposeState> }
  | { type: "goto"; step: StepName };

const STEP_ORDER: StepName[] = [
  "format",
  "occasion",
  "count",
  "sketch",
  "writer-choice",
  "editor",
  "names",
  "audio",
  "address",
  "key",
  "reveal",
];

function nextStep(s: ComposeState): StepName {
  const idx = STEP_ORDER.indexOf(s.step);
  let nextIdx = idx + 1;
  while (nextIdx < STEP_ORDER.length) {
    const candidate = STEP_ORDER[nextIdx];
    if (candidate === "address" && s.format !== "physical") {
      nextIdx += 1;
      continue;
    }
    return candidate;
  }
  return s.step;
}

function prevStep(s: ComposeState): StepName {
  const idx = STEP_ORDER.indexOf(s.step);
  let prevIdx = idx - 1;
  while (prevIdx >= 0) {
    const candidate = STEP_ORDER[prevIdx];
    if (candidate === "address" && s.format !== "physical") {
      prevIdx -= 1;
      continue;
    }
    return candidate;
  }
  return s.step;
}

function reducer(state: ComposeState, action: Action): ComposeState {
  switch (action.type) {
    case "next":
      return { ...state, step: nextStep(state) };
    case "back":
      return { ...state, step: prevStep(state) };
    case "set":
      return { ...state, ...action.patch };
    case "goto":
      return { ...state, step: action.step };
  }
}

const initial: ComposeState = {
  step: "format",
  format: null,
  category: null,
  count: 1,
  cardIds: [],
  senderName: "",
  recipientName: "",
  address: { street: "", city: "", region: "", zip: "", country: "" },
  arcId: null,
  key: null,
  seed: null,
  storySource: null,
  chapters: [],
  audioClipId: null,
};

export function ComposePage() {
  const [state, dispatch] = useReducer(reducer, initial);

  const set = (patch: Partial<ComposeState>) =>
    dispatch({ type: "set", patch });
  const next = () => dispatch({ type: "next" });
  const back = () => dispatch({ type: "back" });

  const enterWriterChoice = (source: StorySource) => {
    if (source === "magic_writer" && state.category) {
      const candidates = arcsForCategory(state.category);
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const chapters: Chapter[] = pick
        ? pick.chapters.slice(0, state.count).map((c) => ({
            title: c.title,
            body: c.body,
          }))
        : Array.from({ length: state.count }, () => ({ title: "", body: "" }));
      set({
        storySource: "magic_writer",
        arcId: pick?.id ?? null,
        chapters,
      });
    } else {
      set({
        storySource: "self",
        arcId: null,
        chapters: Array.from({ length: state.count }, () => ({ title: "", body: "" })),
      });
    }
    dispatch({ type: "goto", step: "editor" });
  };

  // Build payload for the reveal screen.
  const payload: Payload | null =
    state.key && state.category && state.cardIds.length > 0
      ? {
          v: 1,
          k: state.key,
          format: state.format ?? "digital",
          category: state.category,
          cardIds: state.cardIds,
          sender: state.senderName,
          recipient: state.recipientName,
          createdAt: Date.now(),
        }
      : null;

  return (
    <main className="relative z-20 pt-28 pb-32 min-h-screen">
      <div className="max-w-4xl mx-auto px-5">
        <Progress step={state.step} format={state.format} />
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {state.step === "format" && (
              <FormatStep
                format={state.format}
                onPick={(f) => {
                  set({ format: f });
                  next();
                }}
              />
            )}
            {state.step === "occasion" && (
              <OccasionStep
                category={state.category}
                onPick={(c) => {
                  set({ category: c, cardIds: [] });
                  next();
                }}
                onBack={back}
              />
            )}
            {state.step === "count" && (
              <CardCountStep
                category={state.category!}
                count={state.count}
                onPick={(n) => {
                  set({ count: n, cardIds: [] });
                  next();
                }}
                onBack={back}
              />
            )}
            {state.step === "sketch" && (
              <SketchPickStep
                category={state.category!}
                count={state.count}
                cardIds={state.cardIds}
                onChange={(ids) => set({ cardIds: ids })}
                onContinue={next}
                onBack={back}
                allSketches={sketches}
              />
            )}
            {state.step === "writer-choice" && state.category && (
              <WriterChoiceStep onPick={enterWriterChoice} onBack={back} />
            )}
            {state.step === "editor" && (
              <EditorStep
                chapters={state.chapters}
                count={state.count}
                onChange={(chapters) => set({ chapters })}
                onContinue={next}
                onBack={back}
              />
            )}
            {state.step === "names" && (
              <NamesStep
                sender={state.senderName}
                recipient={state.recipientName}
                onChange={(sender, recipient) =>
                  set({ senderName: sender, recipientName: recipient })
                }
                onContinue={next}
                onBack={back}
              />
            )}
            {state.step === "audio" && (
              <AudioStep
                audioClipId={state.audioClipId}
                onChange={(id) => set({ audioClipId: id })}
                onContinue={next}
                onBack={back}
              />
            )}
            {state.step === "address" && state.format === "physical" && (
              <AddressStep
                address={state.address}
                payload={payload}
                onChange={(address) => set({ address })}
                onContinue={next}
                onBack={back}
              />
            )}
            {state.step === "key" && (
              <KeyStep
                value={state.key ?? ""}
                onContinue={(key, seed) => {
                  set({ key, seed });
                  next();
                }}
                onBack={back}
              />
            )}
            {state.step === "reveal" && payload && state.key && state.storySource && (
              <RevealStep
                payload={payload}
                secretKey={state.key}
                storySource={state.storySource}
                arcId={state.arcId}
                chapters={state.chapters}
                audioClipId={state.audioClipId}
                onChangeKey={() => dispatch({ type: "goto", step: "key" })}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

function Progress({ step, format }: { step: StepName; format: CardFormat | null }) {
  const visible: StepName[] = STEP_ORDER.filter(
    (s) => s !== "address" || format === "physical",
  );
  const idx = visible.indexOf(step);
  return (
    <div className="flex justify-center mb-8 gap-2">
      {visible.map((s, i) => (
        <div
          key={s}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: i === idx ? 36 : 14,
            background: i <= idx ? "#1a1a1a" : "rgba(26,26,26,0.18)",
          }}
        />
      ))}
    </div>
  );
}
