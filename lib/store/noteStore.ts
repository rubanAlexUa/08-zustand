import { create } from "zustand";
import { NoteFormValues } from "@/types/note";

type NoteDraftStore = {
  draft: NoteFormValues;
  setDraft: (note: NoteFormValues) => void;
  clearDraft: () => void;
};

const initialDraft = {
  title: "",
  content: "",
  tag: "Todo" as const,
};

export const useNoteDraftStore = create<NoteDraftStore>()((set) => ({
  draft: initialDraft,
  setDraft: (note) => set(() => ({ draft: note })),
  clearDraft: () => set(() => ({ draft: initialDraft })),
}));
